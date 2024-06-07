import { BaseVisitor, Visitor, accept } from '../visitor/visitor'
import { BaseContext } from './context'
import { Expressions } from '../visitor/syntax-names'
import { awst, wtypes } from '../awst'
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
import { CodeError, NotSupported, TodoError } from '../errors'
import { ExpressionBuilder } from './eb'
import { nodeFactory } from '../awst/node-factory'
import { requireExpressionBuilder } from './eb/util'

type Constant = awst.IntegerConstant | awst.BoolConstant | awst.BytesConstant
type LiteralOrEb = awst.Literal | ExpressionBuilder

/**
 * Parses an expression and attempts to extract a compile time constant from it.
 *
 * It is currently super basic, but it could be extended to evaluate more complex deterministic expressions
 */
export class CompileTimeConstantVisitor extends BaseVisitor<BaseContext> implements Visitor<Expressions, LiteralOrEb> {
  public accept = <TNode extends ts.Node>(node: TNode) => accept<CompileTimeConstantVisitor, TNode>(this, node)

  static getCompileTimeConstant(context: BaseContext, node: ts.Expression): Constant {
    const visitor = new CompileTimeConstantVisitor(context)
    const result = visitor.accept(node)
    if (result instanceof awst.Literal) {
      switch (typeof result.value) {
        case 'bigint':
          return nodeFactory.uInt64Constant({
            value: result.value,
            sourceLocation: result.sourceLocation,
          })
        case 'boolean':
          return nodeFactory.boolConstant({
            value: result.value,
            sourceLocation: result.sourceLocation,
          })
        default:
          if (result.value instanceof Uint8Array) {
            return nodeFactory.bytesConstant({
              value: result.value,
              sourceLocation: result.sourceLocation,
            })
          }
      }
      throw new CodeError('Unsupported literal', { sourceLocation: result.sourceLocation })
    } else {
      const rvalue = result.rvalue()
      if (rvalue instanceof awst.BoolConstant) {
        return rvalue
      } else if (rvalue instanceof awst.IntegerConstant) {
        return rvalue
      } else if (rvalue instanceof awst.BytesConstant) {
        return rvalue
      }
    }

    throw new CodeError(`Expression does not appear to be a compile time constant`, {
      sourceLocation: context.getSourceLocation(node),
    })
  }

  constructor(context: BaseContext) {
    super(context)
  }

  visitTaggedTemplateExpression(node: ts.TaggedTemplateExpression): LiteralOrEb {
    throw new NotSupported('ts', { sourceLocation: this.sourceLocation(node) })
  }
  visitCallExpression(node: ts.CallExpression): LiteralOrEb {
    const target = requireExpressionBuilder(this.accept(node.expression))
    const args = node.arguments.map((a) => this.accept(a))
    return target.call(args, this.sourceLocation(node))
  }

  visitPropertyAccessExpression(node: PropertyAccessExpression): LiteralOrEb {
    throw new NotSupported('PropertyAccessExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitElementAccessExpression(node: ElementAccessExpression): LiteralOrEb {
    throw new NotSupported('ElementAccessExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitTypeAssertionExpression(node: TypeAssertion): LiteralOrEb {
    throw new NotSupported('TypeAssertion', { sourceLocation: this.sourceLocation(node) })
  }
  visitDeleteExpression(node: DeleteExpression): LiteralOrEb {
    throw new NotSupported('DeleteExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitTypeOfExpression(node: TypeOfExpression): LiteralOrEb {
    throw new NotSupported('TypeOfExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitVoidExpression(node: VoidExpression): LiteralOrEb {
    throw new NotSupported('VoidExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitAwaitExpression(node: AwaitExpression): LiteralOrEb {
    throw new NotSupported('AwaitExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitPrefixUnaryExpression(node: PrefixUnaryExpression): LiteralOrEb {
    throw new NotSupported('PrefixUnaryExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitPostfixUnaryExpression(node: PostfixUnaryExpression): LiteralOrEb {
    throw new NotSupported('PostfixUnaryExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitBinaryExpression(node: BinaryExpression): LiteralOrEb {
    throw new NotSupported('BinaryExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitConditionalExpression(node: ConditionalExpression): LiteralOrEb {
    throw new NotSupported('ConditionalExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitYieldExpression(node: YieldExpression): LiteralOrEb {
    throw new NotSupported('Yield expressions')
  }
  visitOmittedExpression(node: OmittedExpression): LiteralOrEb {
    throw new NotSupported('OmittedExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitExpressionWithTypeArguments(node: ExpressionWithTypeArguments): LiteralOrEb {
    throw new NotSupported('ExpressionWithTypeArguments', { sourceLocation: this.sourceLocation(node) })
  }
  visitAsExpression(node: AsExpression): LiteralOrEb {
    throw new NotSupported('AsExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitNonNullExpression(node: NonNullExpression): LiteralOrEb {
    throw new NotSupported('NonNullExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitSyntheticExpression(node: SyntheticExpression): LiteralOrEb {
    throw new NotSupported('SyntheticExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitSatisfiesExpression(node: SatisfiesExpression): LiteralOrEb {
    return this.accept(node.expression)
  }
  visitParenthesizedExpression(node: ParenthesizedExpression): LiteralOrEb {
    return this.accept(node.expression)
  }
  visitFunctionExpression(node: FunctionExpression): LiteralOrEb {
    throw new NotSupported('FunctionExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitTemplateExpression(node: TemplateExpression): LiteralOrEb {
    throw new NotSupported('TemplateExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitArrayLiteralExpression(node: ArrayLiteralExpression): LiteralOrEb {
    throw new NotSupported('ArrayLiteralExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitClassExpression(node: ClassExpression): LiteralOrEb {
    throw new NotSupported('ClassExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitIdentifier(node: Identifier): LiteralOrEb {
    return this.context.getExpressionBuilderForNode(node)
  }
  visitImportKeyword(node: ImportExpression): LiteralOrEb {
    throw new NotSupported('ImportExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitNewExpression(node: NewExpression): LiteralOrEb {
    throw new NotSupported('NewExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitNullKeyword(node: NullLiteral): LiteralOrEb {
    throw new NotSupported('NullLiteral', { sourceLocation: this.sourceLocation(node) })
  }
  visitObjectLiteralExpression(node: ObjectLiteralExpression): LiteralOrEb {
    throw new NotSupported('ObjectLiteralExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitPrivateIdentifier(node: PrivateIdentifier): LiteralOrEb {
    throw new NotSupported('PrivateIdentifier', { sourceLocation: this.sourceLocation(node) })
  }
  visitSuperKeyword(node: SuperExpression): LiteralOrEb {
    throw new NotSupported('SuperExpression', { sourceLocation: this.sourceLocation(node) })
  }
  visitThisKeyword(node: ThisExpression): LiteralOrEb {
    throw new NotSupported('ThisExpression', { sourceLocation: this.sourceLocation(node) })
  }
}
