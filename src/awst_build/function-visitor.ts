import { accept, BaseVisitor, Visitor } from '../visitor/visitor'
import { SourceFileContext } from './context'
import { ContractContext } from './contract-visitor'
import * as awst from '../awst/nodes'
import ts from 'typescript'
import { codeInvariant, invariant } from '../util'
import {
  AugmentedAssignmentBinaryOp,
  BinaryOpSyntaxes,
  ComparisonOpSyntaxes,
  Expressions,
  getSyntaxName,
  isKeyOf,
  Statements,
} from '../visitor/syntax-names'
import { NotSupported, TodoError } from '../errors'
import { logger } from '../logger'
import { NodeBuilder } from './eb'
import { nodeFactory } from '../awst/node-factory'
import { wrapInBlock } from '../awst/util'

import { UInt64ExpressionBuilder } from './eb/uint64-expression-builder'
import { LiteralExpressionBuilder } from './eb/literal-expression-builder'
import { requireInstanceBuilder } from './eb/util'

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
    Visitor<Statements, awst.Statement | awst.Statement[]>,
    Visitor<Expressions, NodeBuilder>
{
  private readonly _result: awst.Subroutine | awst.ContractMethod
  constructor(ctx: FunctionContext, node: ts.MethodDeclaration | ts.FunctionDeclaration, contractInfo: ContractMethodInfo | undefined) {
    super(ctx)
    const sourceLocation = this.sourceLocation(node)
    codeInvariant(node.name, 'Anonymous functions are not supported', sourceLocation)
    const name = this.context.textVisitor.accept(node.name)

    const args = node.parameters.map((p) => this.accept(p))
    codeInvariant(node.body, 'Functions must have a body')
    const body = this.accept(node.body)
    const returnType = node.type ? this.context.getPTypeForNode(node.type) : this.context.getImplicitReturnType(node)
    if (contractInfo) {
      this._result = new awst.ContractMethod({
        className: contractInfo.className,
        abimethodConfig: undefined,
        name,
        sourceLocation,
        moduleName: this.context.moduleName,
        args,
        returnType: returnType.wtypeOrThrow,
        body,
        docstring: undefined,
      })
    } else {
      this._result = new awst.Subroutine({
        name,
        sourceLocation,
        moduleName: this.context.moduleName,
        args,
        returnType: returnType.wtypeOrThrow,
        body,
        docstring: undefined,
      })
    }
  }

  visitIdentifier(node: ts.Identifier): NodeBuilder {
    const constant = this.context.tryResolveConstant(node)
    if (constant) {
      return new LiteralExpressionBuilder(constant.value, constant.sourceLocation)
    }
    return this.context.getBuilderForNode(node)
  }
  visitTypeAliasDeclaration(node: ts.TypeAliasDeclaration): awst.Statement[] {
    return []
  }
  visitImportKeyword(node: ts.ImportExpression): NodeBuilder {
    throw new TodoError()
  }
  visitNullKeyword(node: ts.NullLiteral): NodeBuilder {
    throw new TodoError()
  }
  visitPrivateIdentifier(node: ts.PrivateIdentifier): NodeBuilder {
    throw new TodoError()
  }
  visitSuperKeyword(node: ts.SuperExpression): NodeBuilder {
    throw new TodoError()
  }
  visitThisKeyword(node: ts.ThisExpression): NodeBuilder {
    throw new TodoError()
  }

  visitFunctionExpression(node: ts.FunctionExpression): NodeBuilder {
    throw new TodoError()
  }
  visitClassExpression(node: ts.ClassExpression): NodeBuilder {
    throw new TodoError()
  }
  visitObjectLiteralExpression(node: ts.ObjectLiteralExpression): NodeBuilder {
    throw new TodoError()
  }
  visitArrayLiteralExpression(node: ts.ArrayLiteralExpression): NodeBuilder {
    throw new TodoError()
  }
  visitPropertyAccessExpression(node: ts.PropertyAccessExpression): NodeBuilder {
    const target = this.accept(node.expression)
    const property = this.context.textVisitor.accept(node.name)
    return target.memberAccess(property, this.sourceLocation(node))
  }
  visitElementAccessExpression(node: ts.ElementAccessExpression): NodeBuilder {
    throw new TodoError()
  }
  visitCallExpression(node: ts.CallExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const eb = this.accept(node.expression)
    const args = node.arguments.map((a) => requireInstanceBuilder(this.accept(a), sourceLocation))
    return eb.call(args, sourceLocation)
  }
  visitNewExpression(node: ts.NewExpression): NodeBuilder {
    throw new TodoError()
  }
  visitTaggedTemplateExpression(node: ts.TaggedTemplateExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const target = this.accept(node.tag)
    if (ts.isNoSubstitutionTemplateLiteral(node.template)) {
      return target.taggedTemplate(this.context.textVisitor.accept(node.template), [], sourceLocation)
    } else {
      const head = this.context.textVisitor.accept(node.template.head)
      const spans = node.template.templateSpans.map(
        (s) => [requireInstanceBuilder(this.accept(s.expression), sourceLocation), this.context.textVisitor.accept(s.literal)] as const,
      )
      return target.taggedTemplate(head, spans, sourceLocation)
    }
  }
  visitTypeAssertionExpression(node: ts.TypeAssertion): NodeBuilder {
    throw new TodoError()
  }
  visitParenthesizedExpression(node: ts.ParenthesizedExpression): NodeBuilder {
    throw new TodoError()
  }
  visitDeleteExpression(node: ts.DeleteExpression): NodeBuilder {
    throw new TodoError()
  }
  visitTypeOfExpression(node: ts.TypeOfExpression): NodeBuilder {
    throw new TodoError()
  }
  visitVoidExpression(node: ts.VoidExpression): NodeBuilder {
    throw new TodoError()
  }
  visitAwaitExpression(node: ts.AwaitExpression): NodeBuilder {
    throw new TodoError()
  }
  visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression): NodeBuilder {
    throw new TodoError()
  }
  visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression): NodeBuilder {
    throw new TodoError()
  }
  visitBinaryExpression(node: ts.BinaryExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const left = requireInstanceBuilder(this.accept(node.left), sourceLocation)
    const right = requireInstanceBuilder(this.accept(node.right), sourceLocation)
    const binaryOpKind = node.operatorToken.kind
    if (isKeyOf(binaryOpKind, BinaryOpSyntaxes)) {
      return left.binaryOp(right, BinaryOpSyntaxes[binaryOpKind], sourceLocation)
    } else if (isKeyOf(binaryOpKind, AugmentedAssignmentBinaryOp)) {
      const temp = left.binaryOp(right, AugmentedAssignmentBinaryOp[binaryOpKind], sourceLocation)
      const assignmentExpression = nodeFactory.assignmentExpression({
        target: left.resolveLValue(),
        sourceLocation: sourceLocation,
        value: temp.resolve(),
        wtype: temp.resolve().wtype,
      })
      return new UInt64ExpressionBuilder(assignmentExpression)
    } else if (isKeyOf(binaryOpKind, ComparisonOpSyntaxes)) {
      return left.compare(right, ComparisonOpSyntaxes[binaryOpKind], sourceLocation)
    }
    throw new NotSupported(`Binary expression with op ${getSyntaxName(binaryOpKind)}}`)
  }
  visitConditionalExpression(node: ts.ConditionalExpression): NodeBuilder {
    throw new TodoError()
  }
  visitTemplateExpression(node: ts.TemplateExpression): NodeBuilder {
    throw new TodoError()
  }
  visitYieldExpression(node: ts.YieldExpression): NodeBuilder {
    throw new TodoError()
  }
  visitOmittedExpression(node: ts.OmittedExpression): NodeBuilder {
    throw new TodoError()
  }
  visitExpressionWithTypeArguments(node: ts.ExpressionWithTypeArguments): NodeBuilder {
    throw new TodoError()
  }
  visitAsExpression(node: ts.AsExpression): NodeBuilder {
    throw new TodoError()
  }
  visitNonNullExpression(node: ts.NonNullExpression): NodeBuilder {
    throw new TodoError()
  }
  visitSyntheticExpression(node: ts.SyntheticExpression): NodeBuilder {
    throw new TodoError()
  }
  visitSatisfiesExpression(node: ts.SatisfiesExpression): NodeBuilder {
    throw new TodoError()
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
      const value = requireInstanceBuilder(this.accept(d.initializer), sourceLocation)
      return nodeFactory.assignmentStatement({
        target: target.resolveLValue(),
        sourceLocation: sourceLocation,
        value: value.resolve(),
      })
    })
  }
  visitForStatement(node: ts.ForStatement): awst.Statement | awst.Statement[] {
    throw new TodoError()
  }
  visitForOfStatement(node: ts.ForOfStatement): awst.Statement | awst.Statement[] {
    throw new TodoError()
  }
  visitForInStatement(node: ts.ForInStatement): awst.Statement | awst.Statement[] {
    throw new TodoError()
  }
  visitTryStatement(node: ts.TryStatement): awst.Statement | awst.Statement[] {
    throw new NotSupported('Try statements', {
      sourceLocation: this.sourceLocation(node),
    })
  }
  visitEmptyStatement(node: ts.EmptyStatement): awst.Statement | awst.Statement[] {
    throw new TodoError()
  }
  visitExpressionStatement(node: ts.ExpressionStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)
    return new awst.ExpressionStatement({
      sourceLocation: sourceLocation,
      expr: requireInstanceBuilder(this.accept(node.expression), sourceLocation).resolve(),
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
    throw new TodoError()
  }
  visitWhileStatement(node: ts.WhileStatement): awst.Statement | awst.Statement[] {
    throw new TodoError()
  }
  visitContinueStatement(node: ts.ContinueStatement): awst.Statement | awst.Statement[] {
    return new awst.ContinueStatement({
      sourceLocation: this.sourceLocation(node),
    })
  }
  visitBreakStatement(node: ts.BreakStatement): awst.Statement | awst.Statement[] {
    return new awst.BreakStatement({
      sourceLocation: this.sourceLocation(node),
    })
  }
  visitReturnStatement(node: ts.ReturnStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)
    return nodeFactory.returnStatement({
      sourceLocation: sourceLocation,
      value: node.expression && requireInstanceBuilder(this.accept(node.expression), sourceLocation).resolve(),
    })
  }
  visitWithStatement(node: ts.WithStatement): awst.Statement | awst.Statement[] {
    throw new TodoError()
  }
  visitSwitchStatement(node: ts.SwitchStatement): awst.Statement | awst.Statement[] {
    throw new TodoError()
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

  private accept = <TNode extends ts.Node>(node: TNode) => accept<FunctionVisitor, TNode>(this, node)

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
}
