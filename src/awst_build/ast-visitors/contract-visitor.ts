import ts from 'typescript'
import { ContractReference } from '../../awst/models'
import { nodeFactory } from '../../awst/node-factory'
import type * as awst from '../../awst/nodes'
import type { ContractMethod } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'
import { Constants } from '../../constants'
import { CodeError } from '../../errors'
import { logger } from '../../logger'
import { codeInvariant, invariant } from '../../util'
import { ContractSuperBuilder } from '../eb/contract-builder'
import { BoxProxyExpressionBuilder } from '../eb/storage/box'
import { GlobalStateFunctionResultBuilder } from '../eb/storage/global-state'
import { LocalStateFunctionResultBuilder } from '../eb/storage/local-state'
import { requireInstanceBuilder } from '../eb/util'
import { ContractClassModel } from '../models/contract-class-model'
import type { ContractOptionsDecoratorData } from '../models/decorator-data'
import type { ContractClassPType } from '../ptypes'
import { ClassDefinitionVisitor } from './class-definition-visitor'
import { ConstructorVisitor } from './constructor-visitor'
import { ContractMethodVisitor } from './contract-method-visitor'
import { DecoratorVisitor } from './decorator-visitor'
import { visitInChildContext } from './util'

export class ContractVisitor extends ClassDefinitionVisitor {
  private _ctor?: () => ContractMethod
  private _methods: Array<() => ContractMethod> = []
  private readonly _contractPType: ContractClassPType
  private readonly _propertyInitialization: awst.Statement[] = []

  throwNotSupported(node: ts.Node, desc: string): never {
    throw new CodeError(`${desc} are not supported in contract definitions`, {
      sourceLocation: this.sourceLocation(node),
    })
  }

  private readonly metaData: {
    isAbstract: boolean
    contractOptions: ContractOptionsDecoratorData | undefined
    sourceLocation: SourceLocation
    description: string | null
  }

  constructor(classDec: ts.ClassDeclaration, ptype: ContractClassPType) {
    super()
    const sourceLocation = this.context.getSourceLocation(classDec)
    codeInvariant(classDec.name, 'Anonymous classes are not supported for contracts', sourceLocation)

    this._contractPType = ptype

    this.metaData = {
      isAbstract: Boolean(classDec.modifiers?.some((m) => m.kind === ts.SyntaxKind.AbstractKeyword)),
      sourceLocation,
      contractOptions: DecoratorVisitor.buildContractData(classDec),
      description: this.getNodeDescription(classDec),
    }

    for (const property of classDec.members.filter(ts.isPropertyDeclaration)) {
      this.acceptAndIgnoreBuildErrors(property)
    }
    const ctor = classDec.members.find(ts.isConstructorDeclaration)
    if (ctor) this.acceptAndIgnoreBuildErrors(ctor)

    for (const member of classDec.members) {
      if (!ts.isConstructorDeclaration(member) && !ts.isPropertyDeclaration(member)) {
        this.acceptAndIgnoreBuildErrors(member)
      }
    }
  }

  get result(): [] | [awst.Contract] {
    const { isAbstract, sourceLocation, contractOptions, description } = this.metaData

    let approvalProgram: ContractMethod | null = null
    let clearProgram: ContractMethod | null = null
    const methods: ContractMethod[] = []
    const ctor: ContractMethod | null = this._ctor?.() ?? this.makeDefaultConstructor(sourceLocation)

    for (const deferredMethod of this._methods) {
      const contractMethod = deferredMethod()
      switch (contractMethod.memberName) {
        case Constants.symbolNames.approvalProgramMethodName:
          approvalProgram = contractMethod
          break
        case Constants.symbolNames.clearStateProgramMethodName:
          clearProgram = contractMethod
          break
        default:
          methods.push(contractMethod)
      }
    }

    const contract = new ContractClassModel({
      type: this._contractPType,
      propertyInitialization: this._propertyInitialization,
      isAbstract: isAbstract,
      appState: this.context.getStorageDefinitionsForContract(this._contractPType),
      ctor,
      methods,
      description,
      approvalProgram,
      clearProgram,
      options: contractOptions,
      sourceLocation: sourceLocation,
    })
    this.context.addToCompilationSet(contract.id, contract)
    const contractClass = this.context.compilationSet.getContractClass(ContractReference.fromPType(this._contractPType))
    if (!contractClass.isAbstract) {
      return [contractClass.buildContract(this.context.compilationSet)]
    }
    return []
  }

  private acceptAndIgnoreBuildErrors(node: ts.ClassElement) {
    try {
      this.accept(node)
    } catch (e) {
      invariant(e instanceof Error, 'Only errors should be thrown')
      logger.error(e)
    }
  }

  private makeDefaultConstructor(sourceLocation: SourceLocation) {
    // If there is no property initialization, we don't need an implicit constructor
    if (this._propertyInitialization.length === 0) return null
    invariant(this._contractPType.baseTypes.length === 1, 'Only single base type supported for now')
    return nodeFactory.contractMethod({
      memberName: Constants.symbolNames.constructorMethodName,
      cref: ContractReference.fromPType(this._contractPType),
      args: [],
      arc4MethodConfig: null,
      sourceLocation,
      returnType: wtypes.voidWType,

      documentation: nodeFactory.methodDocumentation(),
      body: nodeFactory.block(
        { sourceLocation },
        nodeFactory.expressionStatement({
          expr: requireInstanceBuilder(
            new ContractSuperBuilder(this._contractPType.baseTypes[0], sourceLocation).call([], [], sourceLocation),
          ).resolve(),
        }),
        ...this._propertyInitialization,
      ),
      inline: null,
    })
  }

  visitConstructor(node: ts.ConstructorDeclaration): void {
    this._ctor = ConstructorVisitor.buildConstructor(node, this._contractPType, {
      cref: ContractReference.fromPType(this._contractPType),
      propertyInitializerStatements: this._propertyInitialization,
    })
  }

  visitMethodDeclaration(node: ts.MethodDeclaration): void {
    this._methods.push(
      ContractMethodVisitor.buildContractMethod(node, { contractType: this._contractPType, decoratorData: this.metaData.contractOptions }),
    )
  }
  visitPropertyDeclaration(node: ts.PropertyDeclaration): void {
    const sourceLocation = this.sourceLocation(node)
    codeInvariant(!node.questionToken, 'Optional properties are not supported', sourceLocation)
    codeInvariant(!node.exclamationToken, 'Non-null assertion operators on properties are not supported', sourceLocation)
    codeInvariant(!node.modifiers?.some((m) => m.kind === ts.SyntaxKind.StaticKeyword), 'Static properties are not supported')

    const propertyName = this.textVisitor.accept(node.name)
    codeInvariant(node.initializer, 'Properties must have an initializer', sourceLocation)
    if (node.type) {
      logger.info(sourceLocation, 'Type annotations are not required on initialized properties')
    }
    const initializer = this.accept(node.initializer)

    if (initializer instanceof GlobalStateFunctionResultBuilder) {
      const storageDeclaration = initializer.buildStorageDeclaration(
        propertyName,
        this.sourceLocation(node.name),
        this.getNodeDescription(node),
        this._contractPType,
      )
      this.context.addStorageDeclaration(storageDeclaration)
      if (initializer.initialValue) {
        this._propertyInitialization.push(
          nodeFactory.assignmentStatement({
            target: nodeFactory.appStateExpression({
              key: storageDeclaration.key,
              wtype: storageDeclaration.ptype.contentType.wtypeOrThrow,
              sourceLocation: storageDeclaration.sourceLocation,
              existsAssertionMessage: null,
            }),
            value: initializer.initialValue,
            sourceLocation,
          }),
        )
      }
    } else if (initializer instanceof BoxProxyExpressionBuilder || initializer instanceof LocalStateFunctionResultBuilder) {
      this.context.addStorageDeclaration(
        initializer.buildStorageDeclaration(
          propertyName,
          this.sourceLocation(node.name),
          this.getNodeDescription(node),
          this._contractPType,
        ),
      )
    } else {
      logger.error(
        initializer.sourceLocation,
        `Unsupported property type ${initializer.typeDescription}. Only GlobalState, LocalState, and Box proxies can be stored on a contract.`,
      )
    }
  }

  public static buildContract(classDec: ts.ClassDeclaration, ptype: ContractClassPType) {
    return visitInChildContext(this, classDec, ptype)
  }
}
