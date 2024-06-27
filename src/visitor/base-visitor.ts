import { BaseContext } from '../awst_build/context'
import { AugmentedAssignmentBinaryOp, BinaryOpSyntaxes, ComparisonOpSyntaxes, Expressions, getSyntaxName, isKeyOf } from './syntax-names'
import { InstanceBuilder, NodeBuilder } from '../awst_build/eb'
import ts from 'typescript'
import { TextVisitor } from '../awst_build/text-visitor'
import { LiteralExpressionBuilder } from '../awst_build/eb/literal-expression-builder'
import { CodeError, NotSupported, TodoError } from '../errors'
import { SourceLocation } from '../awst/source-location'
import { requireInstanceBuilder } from '../awst_build/eb/util'
import { accept, Visitor } from './visitor'
import { ObjectLiteralExpressionBuilder } from '../awst_build/eb/object-literal-expression-builder'
import { codeInvariant } from '../util'
import { ContractClassType } from '../awst_build/ptypes/ptype-classes'
import { ContractThisBuilder } from '../awst_build/eb/contract-builder'

export abstract class BaseVisitor<TContext extends BaseContext> implements Visitor<Expressions, NodeBuilder> {
  private baseAccept = <TNode extends ts.Node>(node: TNode) => accept<BaseVisitor<BaseContext>, TNode>(this, node)
  readonly textVisitor: TextVisitor

  protected constructor(public context: TContext) {
    this.textVisitor = new TextVisitor(context)
  }

  visitBigIntLiteral(node: ts.BigIntLiteral): InstanceBuilder {
    return new LiteralExpressionBuilder(BigInt(node.text.slice(0, -1)), this.sourceLocation(node))
  }

  visitRegularExpressionLiteral(node: ts.RegularExpressionLiteral): InstanceBuilder {
    throw new NotSupported('Regular expressions', {
      sourceLocation: this.sourceLocation(node),
    })
  }

  visitFalseKeyword(node: ts.FalseLiteral): InstanceBuilder {
    return new LiteralExpressionBuilder(false, this.sourceLocation(node))
  }

  visitTrueKeyword(node: ts.TrueLiteral): InstanceBuilder {
    return new LiteralExpressionBuilder(true, this.sourceLocation(node))
  }

  sourceLocation(node: ts.Node): SourceLocation {
    return this.context.getSourceLocation(node)
  }

  visitStringLiteral(node: ts.StringLiteral): InstanceBuilder {
    return new LiteralExpressionBuilder(node.text, this.sourceLocation(node))
  }

  visitNoSubstitutionTemplateLiteral(node: ts.NoSubstitutionTemplateLiteral): InstanceBuilder {
    return new LiteralExpressionBuilder(node.text, this.sourceLocation(node))
  }

  visitNumericLiteral(node: ts.NumericLiteral): InstanceBuilder {
    return new LiteralExpressionBuilder(BigInt(node.text), this.sourceLocation(node))
  }

  visitIdentifier(node: ts.Identifier): NodeBuilder {
    const constant = this.context.tryResolveConstant(node)
    if (constant) {
      return new LiteralExpressionBuilder(constant.value, constant.sourceLocation)
    }
    return this.context.getBuilderForNode(node)
  }

  visitImportKeyword(node: ts.ImportExpression): NodeBuilder {
    throw new TodoError('ImportExpression')
  }

  visitNullKeyword(node: ts.NullLiteral): NodeBuilder {
    throw new TodoError('NullLiteral')
  }

  visitPrivateIdentifier(node: ts.PrivateIdentifier): NodeBuilder {
    throw new TodoError('PrivateIdentifier')
  }

  visitSuperKeyword(node: ts.SuperExpression): NodeBuilder {
    throw new TodoError('SuperExpression')
  }

  visitThisKeyword(node: ts.ThisExpression): NodeBuilder {
    const ptype = this.context.resolver.resolveInstance(node)
    const sourceLocation = this.sourceLocation(node)
    if (ptype instanceof ContractClassType) {
      return new ContractThisBuilder(ptype, sourceLocation)
    }
    throw new CodeError(`'this' keyword is not valid outside of a contract type`, { sourceLocation })
  }

  visitFunctionExpression(node: ts.FunctionExpression): NodeBuilder {
    throw new TodoError('FunctionExpression')
  }

  visitClassExpression(node: ts.ClassExpression): NodeBuilder {
    throw new NotSupported('Class expressions')
  }

  visitObjectLiteralExpression(node: ts.ObjectLiteralExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const properties: Array<[string, InstanceBuilder]> = node.properties.flatMap((p) => {
      const propertySourceLocation = this.sourceLocation(p)
      if (ts.isPropertyAssignment(p)) {
        return [[this.textVisitor.accept(p.name), requireInstanceBuilder(this.baseAccept(p.initializer), propertySourceLocation)]]
      } else if (ts.isShorthandPropertyAssignment(p)) {
        codeInvariant(!p.objectAssignmentInitializer, 'Object assignment initializer not supported', propertySourceLocation)
        return [[this.textVisitor.accept(p.name), requireInstanceBuilder(this.baseAccept(p.name), propertySourceLocation)]]
      }
      return []
    })

    return new ObjectLiteralExpressionBuilder(sourceLocation, Object.fromEntries(properties))
  }

  visitArrayLiteralExpression(node: ts.ArrayLiteralExpression): NodeBuilder {
    throw new TodoError('ArrayLiteralExpression')
  }

  visitPropertyAccessExpression(node: ts.PropertyAccessExpression): NodeBuilder {
    const target = this.baseAccept(node.expression)
    const property = this.textVisitor.accept(node.name)
    return target.memberAccess(property, this.sourceLocation(node))
  }

  visitElementAccessExpression(node: ts.ElementAccessExpression): NodeBuilder {
    throw new TodoError('ElementAccessExpression')
  }

  visitCallExpression(node: ts.CallExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const eb = this.baseAccept(node.expression)
    const args = node.arguments.map((a) => requireInstanceBuilder(this.baseAccept(a), sourceLocation))
    // TODO: Check this works
    const typeArgs = node.typeArguments?.map((t) => this.context.resolver.resolveTypeNode(t)) ?? []
    return eb.call(args, typeArgs, sourceLocation)
  }

  visitNewExpression(node: ts.NewExpression): NodeBuilder {
    throw new TodoError('NewExpression')
  }

  visitTaggedTemplateExpression(node: ts.TaggedTemplateExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const target = this.baseAccept(node.tag)
    if (ts.isNoSubstitutionTemplateLiteral(node.template)) {
      return target.taggedTemplate(this.textVisitor.accept(node.template), [], sourceLocation)
    } else {
      const head = this.textVisitor.accept(node.template.head)
      const spans = node.template.templateSpans.map(
        (s) => [requireInstanceBuilder(this.baseAccept(s.expression), sourceLocation), this.textVisitor.accept(s.literal)] as const,
      )
      return target.taggedTemplate(head, spans, sourceLocation)
    }
  }

  visitTypeAssertionExpression(node: ts.TypeAssertion): NodeBuilder {
    throw new TodoError('TypeAssertion')
  }

  visitParenthesizedExpression(node: ts.ParenthesizedExpression): NodeBuilder {
    throw new TodoError('ParenthesizedExpression')
  }

  visitDeleteExpression(node: ts.DeleteExpression): NodeBuilder {
    throw new TodoError('DeleteExpression')
  }

  visitTypeOfExpression(node: ts.TypeOfExpression): NodeBuilder {
    throw new TodoError('TypeOfExpression')
  }

  visitVoidExpression(node: ts.VoidExpression): NodeBuilder {
    throw new TodoError('VoidExpression')
  }

  visitAwaitExpression(node: ts.AwaitExpression): NodeBuilder {
    throw new TodoError('AwaitExpression')
  }

  visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression): NodeBuilder {
    throw new TodoError('PrefixUnaryExpression')
  }

  visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression): NodeBuilder {
    throw new TodoError('PostfixUnaryExpression')
  }

  visitBinaryExpression(node: ts.BinaryExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const left = requireInstanceBuilder(this.baseAccept(node.left), sourceLocation)
    const right = requireInstanceBuilder(this.baseAccept(node.right), sourceLocation)
    const binaryOpKind = node.operatorToken.kind
    if (isKeyOf(binaryOpKind, BinaryOpSyntaxes)) {
      return left.binaryOp(right, BinaryOpSyntaxes[binaryOpKind], sourceLocation)
    } else if (isKeyOf(binaryOpKind, AugmentedAssignmentBinaryOp)) {
      return left.augmentedAssignment(right, AugmentedAssignmentBinaryOp[binaryOpKind], sourceLocation)
    } else if (binaryOpKind === ts.SyntaxKind.EqualsToken) {
      return left.assign(right, sourceLocation)
    } else if (isKeyOf(binaryOpKind, ComparisonOpSyntaxes)) {
      return left.compare(right, ComparisonOpSyntaxes[binaryOpKind], sourceLocation)
    }
    throw new NotSupported(`Binary expression with op ${getSyntaxName(binaryOpKind)}`)
  }

  visitConditionalExpression(node: ts.ConditionalExpression): NodeBuilder {
    throw new TodoError('ConditionalExpression')
  }

  visitTemplateExpression(node: ts.TemplateExpression): NodeBuilder {
    throw new TodoError('TemplateExpression')
  }

  visitYieldExpression(node: ts.YieldExpression): NodeBuilder {
    throw new TodoError('YieldExpression')
  }

  visitOmittedExpression(node: ts.OmittedExpression): NodeBuilder {
    throw new TodoError('OmittedExpression')
  }

  visitExpressionWithTypeArguments(node: ts.ExpressionWithTypeArguments): NodeBuilder {
    throw new TodoError('ExpressionWithTypeArguments')
  }

  visitAsExpression(node: ts.AsExpression): NodeBuilder {
    throw new TodoError('AsExpression')
  }

  visitNonNullExpression(node: ts.NonNullExpression): NodeBuilder {
    throw new TodoError('NonNullExpression')
  }

  visitSyntheticExpression(node: ts.SyntheticExpression): NodeBuilder {
    throw new TodoError('SyntheticExpression')
  }

  visitSatisfiesExpression(node: ts.SatisfiesExpression): NodeBuilder {
    throw new TodoError('SatisfiesExpression')
  }
}
