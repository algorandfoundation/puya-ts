import { accept, Visitor } from '../visitor/visitor'
import { SourceFileContext } from './context'
import ts from 'typescript'
import * as awst from '../awst/nodes'
import { AppStorageDefinition, ContractFragment, ContractMethod } from '../awst/nodes'
import { ClassElements } from '../visitor/syntax-names'
import { TodoError } from '../errors'
import { codeInvariant, invariant } from '../util'
import { Constants } from '../constants'
import { FunctionVisitor } from './function-visitor'
import { logger } from '../logger'
import { BaseVisitor } from './base-visitor'
import { GlobalStateFunctionResultBuilder } from './eb/storage/global-state'
import { ContractClassType } from './ptypes/ptype-classes'

export class ContractContext extends SourceFileContext {
  constructor(parent: SourceFileContext) {
    super(parent.sourceFile, parent.program, parent.nameResolver.createChild())
  }
}

export class ContractVisitor extends BaseVisitor<ContractContext> implements Visitor<ClassElements, void> {
  private _ctor?: ContractMethod
  private _subroutines: ContractMethod[] = []
  private _approvalProgram?: ContractMethod
  private _clearStateProgram?: ContractMethod
  private _className: string
  private _contractPType: ContractClassType
  private _appState = new Map<string, AppStorageDefinition>()
  public readonly result: ContractFragment
  public accept = <TNode extends ts.Node>(node: TNode) => accept<ContractVisitor, TNode>(this, node)

  constructor(ctx: ContractContext, classDec: ts.ClassDeclaration) {
    super(ctx)
    const sourceLocation = this.context.getSourceLocation(classDec)
    codeInvariant(classDec.name, 'Anonymous classes are not supported for contracts', sourceLocation)
    this._className = this.textVisitor.accept(classDec.name)

    const contractPtype = this.context.getPTypeForNode(classDec)
    invariant(contractPtype instanceof ContractClassType, 'Contract PType must be ContractClassType')
    this._contractPType = contractPtype

    const isAbstract = Boolean(classDec.modifiers?.some((m) => m.kind === ts.SyntaxKind.AbstractKeyword))

    for (const member of classDec.members) {
      this.accept(member)
    }

    this.result = new ContractFragment({
      name: this._className,
      nameOverride: undefined,
      appState: this._appState,
      init: this._ctor,
      subroutines: this._subroutines,
      docstring: undefined,
      approvalProgram: this._approvalProgram,
      clearProgram: this._clearStateProgram,
      isAbstract,
      isArc4: contractPtype.isARC4,
      bases: [],
      moduleName: this.context.moduleName,
      reservedScratchSpace: new Set(),
      methods: new Map(),
      sourceLocation: sourceLocation,
      stateTotals: {
        globalBytes: undefined,
        globalUints: undefined,
        localBytes: undefined,
        localUints: undefined,
      },
    })
  }

  visitClassStaticBlockDeclaration(node: ts.ClassStaticBlockDeclaration): void {
    throw new TodoError('visitClassStaticBlockDeclaration')
  }
  visitConstructor(node: ts.ConstructorDeclaration): void {
    this._ctor = FunctionVisitor.buildConstructor(this.context, node, { className: this._className })
  }
  visitGetAccessor(node: ts.GetAccessorDeclaration): void {
    throw new TodoError('visitGetAccessor')
  }
  visitIndexSignature(node: ts.IndexSignatureDeclaration): void {
    throw new TodoError('visitIndexSignature')
  }
  visitMethodDeclaration(node: ts.MethodDeclaration): void {
    const methodName = this.textVisitor.accept(node.name)

    switch (methodName) {
      case Constants.approvalProgramMethodName:
        this._approvalProgram = FunctionVisitor.buildContractMethod(this.context, node, { className: this._className })
        break
      case Constants.clearStateProgramMethodName:
        this._clearStateProgram = FunctionVisitor.buildContractMethod(this.context, node, { className: this._className })
        break
      default:
        this._subroutines.push(FunctionVisitor.buildContractMethod(this.context, node, { className: this._className }))
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
      const storageDef = initializer.buildStorageDefinition(propertyName, this.sourceLocation(node.name), this._contractPType)
      this._appState.set(propertyName, storageDef.definition)
    }

    return
    // TODO: do something with initializer
  }
  visitSemicolonClassElement(node: ts.SemicolonClassElement): void {
    throw new TodoError('visitSemicolonClassElement')
  }
  visitSetAccessor(node: ts.SetAccessorDeclaration): void {
    throw new TodoError('visitSetAccessor')
  }

  public static buildContract(ctx: SourceFileContext, classDec: ts.ClassDeclaration): awst.ContractFragment {
    return new ContractVisitor(new ContractContext(ctx), classDec).result
  }
}
