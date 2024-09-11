import type { Visitor } from '../visitor/visitor'
import { accept } from '../visitor/visitor'
import ts from 'typescript'
import type * as awst from '../awst/nodes'
import type { ContractMethod } from '../awst/nodes'
import { ContractFragment } from '../awst/nodes'
import type { ClassElements } from '../visitor/syntax-names'
import { AwstBuildFailureError, NotSupported, TodoError } from '../errors'
import { codeInvariant, invariant } from '../util'
import { Constants } from '../constants'
import { logger } from '../logger'
import { BaseVisitor } from './base-visitor'
import { GlobalStateFunctionResultBuilder } from './eb/storage/global-state'
import { baseContractType, ContractClassPType, arc4BaseContractType, GlobalStateType } from './ptypes'
import type { Arc4AbiDecoratorData, DecoratorData } from './decorator-visitor'
import { DecoratorVisitor } from './decorator-visitor'
import type { SourceLocation } from '../awst/source-location'
import type { DefaultArgumentSource } from '../awst/models'
import { ContractReference } from '../awst/models'
import { ARC4BareMethodConfig } from '../awst/models'
import { ARC4ABIMethodConfig } from '../awst/models'
import { ARC4CreateOption, OnCompletionAction } from '../awst/models'
import { isValidLiteralForPType, requireInstanceBuilder } from './eb/util'
import type { AwstBuildContext } from './context/awst-build-context'
import { nodeFactory } from '../awst/node-factory'
import { boolWType, voidWType } from '../awst/wtypes'
import { ContractMethodVisitor } from './contract-method-visitor'
import { ContractSuperBuilder } from './eb/contract-builder'
import { ConstructorVisitor } from './constructor-visitor'

export class ContractVisitor extends BaseVisitor implements Visitor<ClassElements, void> {
  private _ctor?: ContractMethod
  private _subroutines: ContractMethod[] = []
  private _approvalProgram: ContractMethod | null = null
  private _clearStateProgram: ContractMethod | null = null
  private _className: string
  private _contractPType: ContractClassPType
  private readonly _propertyInitialization: awst.Statement[] = []
  public readonly result: ContractFragment
  public accept = <TNode extends ts.Node>(node: TNode) => accept<ContractVisitor, TNode>(this, node)

  constructor(ctx: AwstBuildContext, classDec: ts.ClassDeclaration) {
    super(ctx)
    const sourceLocation = this.context.getSourceLocation(classDec)
    codeInvariant(classDec.name, 'Anonymous classes are not supported for contracts', sourceLocation)
    this._className = this.textVisitor.accept(classDec.name)

    const contractPtype = this.context.getPTypeForNode(classDec)
    invariant(contractPtype instanceof ContractClassPType, 'Contract PType must be ContractClassType')
    this._contractPType = contractPtype

    const isAbstract = Boolean(classDec.modifiers?.some((m) => m.kind === ts.SyntaxKind.AbstractKeyword))

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
    const cref = ContractReference.fromPType(this._contractPType)
    this.result = new ContractFragment({
      name: this._className,
      appState: this.context.getStorageDefinitionsForContract(this._contractPType),
      init: this._ctor ?? this.makeDefaultConstructor(sourceLocation),
      subroutines: this._subroutines,
      docstring: null,
      approvalProgram: this._approvalProgram,
      clearProgram: this._clearStateProgram,
      bases: this.getBaseContracts(contractPtype),
      id: cref,
      reservedScratchSpace: new Set(),
      sourceLocation: sourceLocation,
      stateTotals: {
        globalBytes: null,
        globalUints: null,
        localBytes: null,
        localUints: null,
      },
    })
    if (!isAbstract) {
      this.context.addToCompilationSet(cref)
    }
  }

  private acceptAndIgnoreBuildErrors(node: ts.ClassElement) {
    try {
      this.accept(node)
    } catch (e) {
      // Ignore this error and continue visiting other members, so we can show additional errors
      if (!(e instanceof AwstBuildFailureError)) {
        throw e
      }
    }
  }

  private makeDefaultConstructor(sourceLocation: SourceLocation) {
    invariant(this._contractPType.baseTypes.length === 1, 'Only single base type supported for now')
    return nodeFactory.contractMethod({
      memberName: Constants.constructorMethodName,
      cref: ContractReference.fromPType(this._contractPType),
      args: [],
      arc4MethodConfig: null,
      sourceLocation,
      returnType: voidWType,
      synthetic: true,
      inheritable: true,
      documentation: nodeFactory.methodDocumentation(),
      body: nodeFactory.block(
        { sourceLocation },
        nodeFactory.expressionStatement({
          expr: requireInstanceBuilder(
            new ContractSuperBuilder(this._contractPType.baseTypes[0], sourceLocation, this.context).call([], [], sourceLocation),
            sourceLocation,
          ).resolve(),
        }),
        ...this._propertyInitialization,
      ),
    })
  }

  private getBaseContracts(contractType: ContractClassPType): ContractReference[] {
    return contractType.baseTypes.flatMap((baseType) => {
      return [
        new ContractReference({
          className: baseType.name,
          moduleName: baseType.module,
        }),
        ...this.getBaseContracts(baseType),
      ]
    })
  }

  visitClassStaticBlockDeclaration(node: ts.ClassStaticBlockDeclaration): void {
    throw new TodoError('visitClassStaticBlockDeclaration')
  }
  visitConstructor(node: ts.ConstructorDeclaration): void {
    this._ctor = ConstructorVisitor.buildConstructor(this.context, node, {
      cref: ContractReference.fromPType(this._contractPType),
      propertyInitializerStatements: this._propertyInitialization,
    })
  }
  visitGetAccessor(node: ts.GetAccessorDeclaration): void {
    throw new TodoError('visitGetAccessor')
  }
  visitIndexSignature(node: ts.IndexSignatureDeclaration): void {
    throw new NotSupported('Index signatures')
  }

  private buildDefaultArgument({
    methodName,
    parameterName,
    config,
    decoratorLocation,
  }: {
    methodName: string
    parameterName: string
    config: Arc4AbiDecoratorData['defaultArguments'][string]
    decoratorLocation: SourceLocation
  }): DefaultArgumentSource {
    const [, paramType] = this._contractPType.methods[methodName].parameters.find(([p]) => p === parameterName) ?? [undefined, undefined]
    codeInvariant(
      paramType,
      `Default argument specification '${parameterName}' does not match any parameters on the target method`,
      decoratorLocation,
    )
    if (config.type === 'constant') {
      codeInvariant(isValidLiteralForPType(config.value, paramType), `Literal cannot be converted to type ${paramType}`, decoratorLocation)

      return {
        source: 'constant',
        value: config.value,
      }
    }
    const methodType = this._contractPType.methods[config.name]
    if (methodType) {
      codeInvariant(
        methodType.returnType.equals(paramType),
        `Default argument specification for '${parameterName}' does not match parameter type`,
        decoratorLocation,
      )
      return {
        source: 'abi-method',
        memberName: config.name,
      }
    }
    const propertyType = this._contractPType.properties[config.name]
    if (propertyType instanceof GlobalStateType) {
      codeInvariant(
        propertyType.contentType.equals(paramType),
        `Default argument specification for '${parameterName}' does not match parameter type`,
        decoratorLocation,
      )
      return {
        source: 'global-state',
        memberName: config.name,
      }
    }
    throw new TodoError('Unsupported default argument config')
  }

  private buildArc4Config({
    decorator,
    methodName,
    isPublic,
    methodLocation,
  }: {
    methodName: string
    decorator: DecoratorData | undefined
    isPublic: boolean
    methodLocation: SourceLocation
  }): awst.ContractMethod['arc4MethodConfig'] {
    if (!isPublic && decorator && [Constants.arc4BareDecoratorName, Constants.arc4AbiDecoratorName].includes(decorator.type)) {
      logger.error(methodLocation, 'Private method cannot be exposed as an abi method')
    }

    if (decorator?.type === 'arc4.baremethod') {
      return new ARC4BareMethodConfig({
        sourceLocation: decorator.sourceLocation,
        allowedCompletionTypes: decorator.ocas,
        create: decorator.create,
      })
    } else if (decorator?.type === 'arc4.abimethod') {
      return new ARC4ABIMethodConfig({
        sourceLocation: decorator.sourceLocation,
        allowedCompletionTypes: decorator.ocas,
        create: decorator.create,
        name: decorator.nameOverride ?? methodName,
        readonly: decorator.readonly,
        defaultArgs: Object.fromEntries(
          Object.entries(decorator.defaultArguments).map(([parameterName, argConfig]) => [
            parameterName,
            this.buildDefaultArgument({
              methodName,
              parameterName,
              config: argConfig,
              decoratorLocation: decorator.sourceLocation,
            }),
          ]),
        ),
        structs: {}, // TODO
      })
    } else if (isPublic && this._contractPType.isARC4) {
      return new ARC4ABIMethodConfig({
        sourceLocation: methodLocation,
        allowedCompletionTypes: [OnCompletionAction.NoOp],

        create: ARC4CreateOption.Disallow,
        name: methodName,
        readonly: false,
        defaultArgs: {},
        structs: {}, // TODO
      })
    }
    return null
  }

  visitMethodDeclaration(node: ts.MethodDeclaration): void {
    const sourceLocation = this.sourceLocation(node)
    const methodName = this.textVisitor.accept(node.name)

    const decorators = (node.modifiers ?? []).flatMap((modifier) => {
      if (!ts.isDecorator(modifier)) return []

      return DecoratorVisitor.buildDecoratorData(this.context, modifier)
    })
    const isPublic = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.PublicKeyword) === true

    if (decorators.length > 1) {
      logger.error(
        sourceLocation,
        'Only one decorator is allowed per method. Multiple on complete actions can be provided in a single decorator',
      )
    }
    const cref = ContractReference.fromPType(this._contractPType)
    switch (methodName) {
      case Constants.approvalProgramMethodName:
        if (decorators.length) logger.error(sourceLocation, `${Constants.approvalProgramMethodName} should not have a decorator`)
        this._approvalProgram = ContractMethodVisitor.buildContractMethod(this.context, node, { cref })
        break
      case Constants.clearStateProgramMethodName:
        if (decorators.length) logger.error(sourceLocation, `${Constants.clearStateProgramMethodName} should not have a decorator`)
        this._clearStateProgram = ContractMethodVisitor.buildContractMethod(this.context, node, { cref })
        break
      default:
        this._subroutines.push(
          ContractMethodVisitor.buildContractMethod(this.context, node, {
            cref,
            arc4MethodConfig: this.buildArc4Config({
              decorator: decorators[0],
              methodName,
              isPublic,
              methodLocation: sourceLocation,
            }),
          }),
        )
    }
  }
  visitPropertyDeclaration(node: ts.PropertyDeclaration): void {
    const sourceLocation = this.sourceLocation(node)
    codeInvariant(!node.questionToken, 'Optional properties are not supported', sourceLocation)
    codeInvariant(!node.exclamationToken, 'Non-null assertion operators on properties are not supported', sourceLocation)
    // TODO: Check modifiers?

    const propertyName = this.textVisitor.accept(node.name)
    codeInvariant(node.initializer, 'Properties must have an initializer', sourceLocation)
    if (node.type) {
      logger.info(sourceLocation, 'Type annotations are not required on initialized properties')
    }
    const initializer = this.accept(node.initializer)

    if (initializer instanceof GlobalStateFunctionResultBuilder) {
      const storageDeclaration = initializer.buildStorageDeclaration(propertyName, this.sourceLocation(node.name), this._contractPType)
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
    }

    return
    // TODO: do something with initializer
  }
  visitSemicolonClassElement(node: ts.SemicolonClassElement): void {
    // Ignore
  }
  visitSetAccessor(node: ts.SetAccessorDeclaration): void {
    throw new TodoError('visitSetAccessor')
  }

  public static buildContract(ctx: AwstBuildContext, classDec: ts.ClassDeclaration): awst.ContractFragment {
    return new ContractVisitor(ctx.createChildContext(), classDec).result
  }
}
