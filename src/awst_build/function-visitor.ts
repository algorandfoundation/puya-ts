import { accept, Visitor } from '../visitor/visitor'
import { SourceFileContext } from './context'
import { ContractContext } from './contract-visitor'
import * as awst from '../awst/nodes'
import ts, { SyntaxKind } from 'typescript'
import { codeInvariant, invariant } from '../util'
import { Statements } from '../visitor/syntax-names'
import { NotSupported, TodoError } from '../errors'
import { logger } from '../logger'
import { nodeFactory } from '../awst/node-factory'
import { wrapInBlock } from '../awst/util'
import { requestExpressionOfType, requireExpressionOfType, requireInstanceBuilder } from './eb/util'
import { PType, voidPType } from './ptypes'
import { ARC4CreateOption, OnCompletionAction } from '../awst/arc4'
import { BaseVisitor } from './base-visitor'
import { TransientType } from './ptypes/ptype-classes'
import { SourceLocation } from '../awst/source-location'
import { NodeBuilder } from './eb'

export type ContractMethodInfo = {
  className: string
}

export class FunctionContext extends SourceFileContext {
  constructor(parent: ContractContext | SourceFileContext) {
    super(parent.sourceFile, parent.program, parent.nameResolver.createChild())
  }
}

export class FunctionVisitor
  extends BaseVisitor<FunctionContext>
  implements
    Visitor<ts.ParameterDeclaration, awst.SubroutineArgument>,
    Visitor<ts.Block, awst.Block>,
    Visitor<Statements, awst.Statement | awst.Statement[]>
{
  private accept = <TNode extends ts.Node>(node: TNode) => accept<FunctionVisitor, TNode>(this, node)

  private readonly _result: awst.Subroutine | awst.ContractMethod
  private readonly _returnType: PType
  private readonly _functionName: string
  constructor(
    ctx: FunctionContext,
    node: ts.MethodDeclaration | ts.FunctionDeclaration | ts.ConstructorDeclaration,
    contractInfo: ContractMethodInfo | undefined,
  ) {
    super(ctx)
    const sourceLocation = this.sourceLocation(node)

    if (ts.isConstructorDeclaration(node)) {
      this._functionName = '~ctor~'
      this._returnType = voidPType
    } else {
      codeInvariant(node.name, 'Anonymous functions are not supported', sourceLocation)
      this._functionName = this.textVisitor.accept(node.name)
      this._returnType = node.type ? ctx.getPTypeForNode(node.type) : ctx.getImplicitReturnType(node)
      if (this._returnType instanceof TransientType) {
        logger.error(
          sourceLocation,
          `${this._returnType} cannot be used as a return type. Consider annotating the return type explicitly as ${this._returnType.altType}`,
        )
      }
    }

    const args = node.parameters.map((p) => this.accept(p))
    codeInvariant(node.body, 'Functions must have a body')
    const body = this.accept(node.body)
    if (contractInfo) {
      this._result = new awst.ContractMethod({
        className: contractInfo.className,
        arc4MethodConfig: {
          is_bare: true,
          allowed_completion_types: [OnCompletionAction.NoOp],
          create: ARC4CreateOption.Disallow,
          source_location: sourceLocation,
        },
        name: this._functionName,
        sourceLocation,
        moduleName: this.context.moduleName,
        args,
        returnType: this._returnType.wtypeOrThrow,
        body,
        docstring: undefined,
      })
    } else {
      this._result = new awst.Subroutine({
        name: this._functionName,
        sourceLocation,
        moduleName: this.context.moduleName,
        args,
        returnType: this._returnType.wtypeOrThrow,
        body,
        docstring: undefined,
      })
    }
  }

  visitTypeAliasDeclaration(node: ts.TypeAliasDeclaration): awst.Statement[] {
    return []
  }

  visitClassDeclaration(node: ts.ClassDeclaration): awst.Statement | awst.Statement[] {
    throw new NotSupported('Nested classes', {
      sourceLocation: this.sourceLocation(node),
    })
  }

  visitVariableStatement(node: ts.VariableStatement): awst.Statement | awst.Statement[] {
    return node.declarationList.declarations.flatMap((d) => {
      const sourceLocation = this.sourceLocation(d)
      if (!d.initializer) {
        logger.warn(sourceLocation, 'Ignoring variable statement with no initializer')
        return []
      }
      const target = requireInstanceBuilder(this.accept(d.name), sourceLocation)
      invariant(target.ptype, 'Target of assignment must have ptype')
      const value = requireExpressionOfType(this.accept(d.initializer), target.ptype, sourceLocation)
      return nodeFactory.assignmentStatement({
        target: target.resolveLValue(),
        sourceLocation: sourceLocation,
        value,
      })
    })
  }

  visitForStatement(node: ts.ForStatement): awst.Statement | awst.Statement[] {
    throw new TodoError('ForStatement')
  }
  visitForOfStatement(node: ts.ForOfStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)

    let items: awst.LValue
    if (ts.isExpression(node.initializer)) {
      items = requireInstanceBuilder(this.accept(node.initializer), sourceLocation).resolveLValue()
    } else {
      codeInvariant(
        node.initializer.declarations.length === 1,
        'For of loops can only declare a single loop variable',
        this.sourceLocation(node.initializer),
      )
      const [declaration] = node.initializer.declarations
      items = requireInstanceBuilder(this.accept(declaration.name), sourceLocation).resolveLValue()
    }
    return nodeFactory.forInLoop({
      sourceLocation,
      sequence: requireInstanceBuilder(this.accept(node.expression), sourceLocation).iterate(sourceLocation),
      items,
      loopBody: wrapInBlock(this.accept(node.statement), sourceLocation),
    })
  }
  visitForInStatement(node: ts.ForInStatement): awst.Statement | awst.Statement[] {
    throw new NotSupported('For in statements', {
      sourceLocation: this.sourceLocation(node),
    })
  }
  visitTryStatement(node: ts.TryStatement): awst.Statement | awst.Statement[] {
    throw new NotSupported('Try statements', {
      sourceLocation: this.sourceLocation(node),
    })
  }
  visitEmptyStatement(node: ts.EmptyStatement): awst.Statement | awst.Statement[] {
    throw new TodoError('EmptyStatement')
  }
  visitExpressionStatement(node: ts.ExpressionStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)
    const expr = this.accept(node.expression)
    return new awst.ExpressionStatement({
      sourceLocation: sourceLocation,
      expr: requireInstanceBuilder(expr, sourceLocation).resolve(),
    })
  }
  visitIfStatement(node: ts.IfStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)
    const condition = this.accept(node.expression).boolEval(sourceLocation, false)

    const ifBranch = wrapInBlock(this.accept(node.thenStatement), this.sourceLocation(node.thenStatement))
    const elseBranch = node.elseStatement && wrapInBlock(this.accept(node.elseStatement), this.sourceLocation(node.elseStatement))

    return nodeFactory.ifElse({
      condition,
      ifBranch,
      elseBranch,
      sourceLocation,
    })
  }
  visitDoStatement(node: ts.DoStatement): awst.Statement | awst.Statement[] {
    throw new TodoError('DoStatement')
  }
  visitWhileStatement(node: ts.WhileStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)
    return nodeFactory.whileLoop({
      sourceLocation,
      condition: this.accept(node.expression).boolEval(sourceLocation, false),
      loopBody: wrapInBlock(this.accept(node.statement), this.sourceLocation(node.statement)),
    })
  }
  visitContinueStatement(node: ts.ContinueStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)
    codeInvariant(!node.label, 'Continuing to a labeled construct is not currently supported', sourceLocation)
    return new awst.ContinueStatement({
      sourceLocation: sourceLocation,
    })
  }
  visitBreakStatement(node: ts.BreakStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)
    codeInvariant(!node.label, 'Breaking to a labeled construct is not currently supported', sourceLocation)
    return new awst.BreakStatement({
      sourceLocation: sourceLocation,
    })
  }
  visitReturnStatement(node: ts.ReturnStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)
    if (!node.expression) {
      return nodeFactory.returnStatement({
        sourceLocation: sourceLocation,
        value: undefined,
      })
    }
    const returnValue = this.accept(node.expression)
    return nodeFactory.returnStatement({
      sourceLocation: sourceLocation,
      value: requireExpressionOfType(returnValue, this._returnType, sourceLocation),
    })
  }
  visitWithStatement(node: ts.WithStatement): awst.Statement | awst.Statement[] {
    throw new NotSupported('with statements', { sourceLocation: this.sourceLocation(node) })
  }
  visitSwitchStatement(node: ts.SwitchStatement): awst.Statement | awst.Statement[] {
    throw new TodoError('SwitchStatement')
    // const buildSwitchCaseBody = (statements: ts.NodeArray<ts.Statement>, sourceLocation: SourceLocation) => {
    //   return wrapInBlock(
    //     statements.flatMap((s) => this.accept(s)),
    //     sourceLocation,
    //   )
    // }
    //
    // const sourceLocation = this.sourceLocation(node)
    //
    // const caseBlocks: awst.SwitchCaseBlock[] = []
    //
    // const current = {
    //   clauses: new Array<awst.Expression>(),
    // }
    //
    // let defaultCase: awst.Block | undefined = undefined
    // const subject = requireInstanceBuilder(this.accept(node.expression), sourceLocation)
    //
    // codeInvariant(subject.ptype, 'The subject of a switch statement must have a resolvable ptype', this.sourceLocation(node.expression))
    //
    // // Collate clauses without statements with the proceeding clause
    // for (const clause of node.caseBlock.clauses) {
    //   const sourceLocation = this.sourceLocation(clause)
    //   if (clause.kind === SyntaxKind.DefaultClause) {
    //     defaultCase = buildSwitchCaseBody(clause.statements, sourceLocation)
    //     if (current.clauses.length) {
    //       logger.warn(current.clauses[0].sourceLocation, 'Switch cases which fall through to the default clause are ignored')
    //     }
    //   } else {
    //     if (defaultCase) {
    //       logger.warn(sourceLocation, 'Switch cases appearing after a default clause are ignored')
    //     }
    //     current.clauses.push(requireExpressionOfType(this.accept(clause.expression), subject.ptype, sourceLocation))
    //     if (clause.statements.length) {
    //       caseBlocks.push(
    //         nodeFactory.switchCaseBlock({
    //           sourceLocation,
    //           clauses: current.clauses,
    //           block: buildSwitchCaseBody(clause.statements, sourceLocation),
    //         }),
    //       )
    //       current.clauses = []
    //     }
    //   }
    // }
    //
    // return nodeFactory.switch({
    //   value: subject.resolve(),
    //   sourceLocation,
    //   defaultCase,
    //   cases: caseBlocks,
    // })
  }

  visitLabeledStatement(node: ts.LabeledStatement): awst.Statement | awst.Statement[] {
    return this.accept(node.statement)
  }
  visitThrowStatement(node: ts.ThrowStatement): awst.Statement | awst.Statement[] {
    throw new NotSupported('Throw statements', {
      sourceLocation: this.sourceLocation(node),
    })
  }
  visitDebuggerStatement(node: ts.DebuggerStatement): awst.Statement | awst.Statement[] {
    logger.warn(this.sourceLocation(node), 'Ignoring debugger statement')
    return []
  }
  visitImportDeclaration(node: ts.ImportDeclaration): awst.Statement | awst.Statement[] {
    return []
  }

  visitBlock(node: ts.Block): awst.Block {
    return new awst.Block({
      body: node.statements.flatMap((s) => this.accept(s)),
      description: undefined,
      sourceLocation: this.sourceLocation(node),
    })
  }

  visitParameter(node: ts.ParameterDeclaration): awst.SubroutineArgument {
    codeInvariant(node.type, 'Parameters must have type annotation')
    return new awst.SubroutineArgument({
      sourceLocation: this.sourceLocation(node),
      name: this.context.resolveVariable(node.name),
      wtype: this.context.getPTypeForNode(node.type).wtypeOrThrow,
    })
  }

  get result() {
    return this._result
  }

  public static buildSubroutine(ctx: SourceFileContext, node: ts.FunctionDeclaration): awst.Subroutine {
    const result = new FunctionVisitor(new FunctionContext(ctx), node, undefined).result
    invariant(result instanceof awst.Subroutine, "result must be Subroutine'")
    return result
  }
  public static buildContractMethod(
    ctx: ContractContext,
    node: ts.MethodDeclaration,
    contractMethodInfo: ContractMethodInfo,
  ): awst.ContractMethod {
    const result = new FunctionVisitor(new FunctionContext(ctx), node, contractMethodInfo).result
    invariant(result instanceof awst.ContractMethod, "result must be ContractMethod'")
    return result
  }
  public static buildConstructor(ctx: ContractContext, node: ts.ConstructorDeclaration, contractMethodInfo: ContractMethodInfo) {
    const result = new FunctionVisitor(new FunctionContext(ctx), node, contractMethodInfo).result
    invariant(result instanceof awst.ContractMethod, "result must be ContractMethod'")
    return result
  }
}
