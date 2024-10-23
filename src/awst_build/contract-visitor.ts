import ts from 'typescript'
import { ContractReference } from '../awst/models'
import { nodeFactory } from '../awst/node-factory'
import type * as awst from '../awst/nodes'
import type { ContractMethod } from '../awst/nodes'
import { ContractFragment } from '../awst/nodes'
import type { SourceLocation } from '../awst/source-location'
import { voidWType } from '../awst/wtypes'
import { Constants } from '../constants'
import { AwstBuildFailureError, NotSupported, TodoError } from '../errors'
import { logger } from '../logger'
import { codeInvariant, invariant } from '../util'
import type { ClassElements } from '../visitor/syntax-names'
import type { Visitor } from '../visitor/visitor'
import { accept } from '../visitor/visitor'
import { BaseVisitor } from './base-visitor'
import { ConstructorVisitor } from './constructor-visitor'
import type { AwstBuildContext } from './context/awst-build-context'
import { ContractMethodVisitor } from './contract-method-visitor'
import { ContractSuperBuilder } from './eb/contract-builder'
import { BoxProxyExpressionBuilder } from './eb/storage/box'
import { GlobalStateFunctionResultBuilder } from './eb/storage/global-state'
import { LocalStateFunctionResultBuilder } from './eb/storage/local-state'
import { requireInstanceBuilder } from './eb/util'
import { ContractClassPType } from './ptypes'

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

  visitMethodDeclaration(node: ts.MethodDeclaration): void {
    const contractMethod = ContractMethodVisitor.buildContractMethod(this.context, node, this._contractPType)
    switch (contractMethod.memberName) {
      case Constants.approvalProgramMethodName:
        this._approvalProgram = contractMethod
        break
      case Constants.clearStateProgramMethodName:
        this._clearStateProgram = contractMethod
        break
      default:
        this._subroutines.push(contractMethod)
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
    } else if (initializer instanceof BoxProxyExpressionBuilder || initializer instanceof LocalStateFunctionResultBuilder) {
      this.context.addStorageDeclaration(
        initializer.buildStorageDeclaration(propertyName, this.sourceLocation(node.name), this._contractPType),
      )
    } else {
      logger.error(initializer.sourceLocation, `Unsupported property type ${initializer.typeDescription}`)
    }
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
