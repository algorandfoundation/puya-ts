import { Visitor, accept } from '../visitor/visitor'
import { BaseContext } from './context'
import { Expressions } from '../visitor/syntax-names'
import { awst } from '../awst'
import ts, {
  PropertyAccessExpression,
  ElementAccessExpression,
  TypeAssertion,
  DeleteExpression,
  TypeOfExpression,
  VoidExpression,
  AwaitExpression,
  PrefixUnaryExpression,
  PostfixUnaryExpression,
  BinaryExpression,
  ConditionalExpression,
  YieldExpression,
  OmittedExpression,
  ExpressionWithTypeArguments,
  AsExpression,
  NonNullExpression,
  SyntheticExpression,
  SatisfiesExpression,
  ParenthesizedExpression,
  FunctionExpression,
  TemplateExpression,
  ArrayLiteralExpression,
  ClassExpression,
  Identifier,
  ImportExpression,
  NewExpression,
  NullLiteral,
  ObjectLiteralExpression,
  PrivateIdentifier,
  SuperExpression,
  ThisExpression,
} from 'typescript'
import { NotSupported } from '../errors'
import { NodeBuilder } from './eb'
import { requireConstantOfType, requireInstanceBuilder } from './eb/util'
import { PType } from './ptypes'
import { BaseVisitor } from '../visitor/base-visitor'

/**
 * Parses an expression and attempts to extract a compile time constant from it.
 *
 * It is currently super basic, but it could be extended to evaluate more complex deterministic expressions
 */
export class CompileTimeConstantVisitor extends BaseVisitor<BaseContext> implements Visitor<Expressions, NodeBuilder> {
  public accept = <TNode extends ts.Node>(node: TNode) => accept<CompileTimeConstantVisitor, TNode>(this, node)

  static getCompileTimeConstant(context: BaseContext, node: ts.Expression, ptype: PType): awst.Constant {
    const visitor = new CompileTimeConstantVisitor(context)
    const sourceLocation = context.getSourceLocation(node)
    return requireConstantOfType(visitor.accept(node), ptype, sourceLocation)
  }

  constructor(context: BaseContext) {
    super(context)
  }

  visitTaggedTemplateExpression(node: ts.TaggedTemplateExpression): NodeBuilder {
    throw new NotSupported('ts', { sourceLocation: this.sourceLocation(node) })
  }
  visitCallExpression(node: ts.CallExpression): NodeBuilder {
    const target = this.accept(node.expression)
    const sourceLocation = this.sourceLocation(node)
    const args = node.arguments.map((a) => requireInstanceBuilder(this.accept(a), sourceLocation))
    // TODO: Check this works
    const typeArgs = node.typeArguments?.map((t) => this.context.resolver.resolveTypeNode(t)) ?? []

    return target.call(args, typeArgs, this.sourceLocation(node))
  }

  visitPropertyAccessExpression(node: PropertyAccessExpression): NodeBuilder {
    throw new NotSupported('PropertyAccessExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitElementAccessExpression(node: ElementAccessExpression): NodeBuilder {
    throw new NotSupported('ElementAccessExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitTypeAssertionExpression(node: TypeAssertion): NodeBuilder {
    throw new NotSupported('TypeAssertion', { sourceLocation: this.sourceLocation(node) })
  }
  visitDeleteExpression(node: DeleteExpression): NodeBuilder {
    throw new NotSupported('DeleteExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitTypeOfExpression(node: TypeOfExpression): NodeBuilder {
    throw new NotSupported('TypeOfExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitVoidExpression(node: VoidExpression): NodeBuilder {
    throw new NotSupported('VoidExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitAwaitExpression(node: AwaitExpression): NodeBuilder {
    throw new NotSupported('AwaitExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitPrefixUnaryExpression(node: PrefixUnaryExpression): NodeBuilder {
    throw new NotSupported('PrefixUnaryExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitPostfixUnaryExpression(node: PostfixUnaryExpression): NodeBuilder {
    throw new NotSupported('PostfixUnaryExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitBinaryExpression(node: BinaryExpression): NodeBuilder {
    throw new NotSupported('BinaryExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitConditionalExpression(node: ConditionalExpression): NodeBuilder {
    throw new NotSupported('ConditionalExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitYieldExpression(node: YieldExpression): NodeBuilder {
    throw new NotSupported('Yield expressions')
  }
  visitOmittedExpression(node: OmittedExpression): NodeBuilder {
    throw new NotSupported('OmittedExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitExpressionWithTypeArguments(node: ExpressionWithTypeArguments): NodeBuilder {
    throw new NotSupported('ExpressionWithTypeArguments', { sourceLocation: this.sourceLocation(node) })
  }
  visitAsExpression(node: AsExpression): NodeBuilder {
    throw new NotSupported('AsExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitNonNullExpression(node: NonNullExpression): NodeBuilder {
    throw new NotSupported('NonNullExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitSyntheticExpression(node: SyntheticExpression): NodeBuilder {
    throw new NotSupported('SyntheticExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitSatisfiesExpression(node: SatisfiesExpression): NodeBuilder {
    return this.accept(node.expression)
  }
  visitParenthesizedExpression(node: ParenthesizedExpression): NodeBuilder {
    return this.accept(node.expression)
  }
  visitFunctionExpression(node: FunctionExpression): NodeBuilder {
    throw new NotSupported('FunctionExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitTemplateExpression(node: TemplateExpression): NodeBuilder {
    throw new NotSupported('TemplateExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitArrayLiteralExpression(node: ArrayLiteralExpression): NodeBuilder {
    throw new NotSupported('ArrayLiteralExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitClassExpression(node: ClassExpression): NodeBuilder {
    throw new NotSupported('ClassExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitIdentifier(node: Identifier): NodeBuilder {
    return this.context.getBuilderForNode(node)
  }
  visitImportKeyword(node: ImportExpression): NodeBuilder {
    throw new NotSupported('ImportExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitNewExpression(node: NewExpression): NodeBuilder {
    throw new NotSupported('NewExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitNullKeyword(node: NullLiteral): NodeBuilder {
    throw new NotSupported('NullLiteral', { sourceLocation: this.sourceLocation(node) })
  }
  visitObjectLiteralExpression(node: ObjectLiteralExpression): NodeBuilder {
    throw new NotSupported('ObjectLiteralExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitPrivateIdentifier(node: PrivateIdentifier): NodeBuilder {
    throw new NotSupported('PrivateIdentifier', { sourceLocation: this.sourceLocation(node) })
  }
  visitSuperKeyword(node: SuperExpression): NodeBuilder {
    throw new NotSupported('SuperExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitThisKeyword(node: ThisExpression): NodeBuilder {
    throw new NotSupported('ThisExpression', { sourceLocation: this.sourceLocation(node) })
  }
}
