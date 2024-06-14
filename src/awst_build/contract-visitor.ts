import { accept, BaseVisitor, Visitor } from '../visitor/visitor'
import { SourceFileContext } from './context'
import ts from 'typescript'
import * as awst from '../awst/nodes'
import { ContractFragment, ContractMethod } from '../awst/nodes'
import { ClassElements } from '../visitor/syntax-names'
import { TodoError } from '../errors'
import { codeInvariant } from '../util'
import { Constants } from '../constants'
import { FunctionVisitor } from './function-visitor'

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
  public readonly result: ContractFragment
  public accept = <TNode extends ts.Node>(node: TNode) => accept<ContractVisitor, TNode>(this, node)

  constructor(ctx: ContractContext, classDec: ts.ClassDeclaration) {
    super(ctx)
    const sourceLocation = this.context.getSourceLocation(classDec)
    codeInvariant(classDec.name, 'Anonymous classes are not supported for contracts', sourceLocation)
    this._className = this.context.textVisitor.accept(classDec.name)

    const isAbstract = Boolean(classDec.modifiers?.some((m) => m.kind === ts.SyntaxKind.AbstractKeyword))

    for (const member of classDec.members) {
      this.accept(member)
    }

    this.result = new ContractFragment({
      name: this._className,
      nameOverride: undefined,
      appState: new Map(),
      init: this._ctor,
      subroutines: this._subroutines,
      docstring: undefined,
      approvalProgram: this._approvalProgram,
      clearProgram: this._clearStateProgram,
      isAbstract,
      isArc4: false,
      bases: [],
      moduleName: this.context.moduleName,
      reservedScratchSpace: new Set(),
      sourceLocation: sourceLocation,
      stateTotals: {
        globalBytes: undefined,
        globalUints: undefined,
        localBytes: undefined,
        localUints: undefined,
      },
      symtable: new Map(),
    })
  }

  visitClassStaticBlockDeclaration(node: ts.ClassStaticBlockDeclaration): void {
    throw new TodoError()
  }
  visitConstructor(node: ts.ConstructorDeclaration): void {
    throw new TodoError()
  }
  visitGetAccessor(node: ts.GetAccessorDeclaration): void {
    throw new TodoError()
  }
  visitIndexSignature(node: ts.IndexSignatureDeclaration): void {
    throw new TodoError()
  }
  visitMethodDeclaration(node: ts.MethodDeclaration): void {
    const methodName = this.context.textVisitor.accept(node.name)

    switch (methodName) {
      case Constants.approvalProgramMethodName:
        this._approvalProgram = FunctionVisitor.buildContractMethod(this.context, node, { className: this._className })
        break
      case Constants.clearStateMethodName:
        this._clearStateProgram = FunctionVisitor.buildContractMethod(this.context, node, { className: this._className })
        break
      default:
        this._subroutines.push(FunctionVisitor.buildContractMethod(this.context, node, { className: this._className }))
    }
  }
  visitPropertyDeclaration(node: ts.PropertyDeclaration): void {
    throw new TodoError()
  }
  visitSemicolonClassElement(node: ts.SemicolonClassElement): void {
    throw new TodoError()
  }
  visitSetAccessor(node: ts.SetAccessorDeclaration): void {
    throw new TodoError()
  }

  public static buildContract(ctx: SourceFileContext, classDec: ts.ClassDeclaration): awst.ContractFragment {
    return new ContractVisitor(new ContractContext(ctx), classDec).result
  }
}
