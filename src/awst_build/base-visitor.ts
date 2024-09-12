import type { Expressions } from '../visitor/syntax-names'
import {
  AugmentedAssignmentBinaryOp,
  AugmentedAssignmentLogicalOpSyntaxes,
  BinaryOpSyntaxes,
  ComparisonOpSyntaxes,
  getNodeName,
  getSyntaxName,
  isKeyOf,
  LogicalOpSyntaxes,
  UnaryExpressionUnaryOps,
} from '../visitor/syntax-names'
import type { InstanceBuilder } from './eb'
import { NodeBuilder } from './eb'
import ts from 'typescript'
import { TextVisitor } from './text-visitor'
import { CodeError, NotSupported, TodoError } from '../errors'
import type { SourceLocation } from '../awst/source-location'
import { requireExpressionOfType, requireInstanceBuilder } from './eb/util'
import type { Visitor } from '../visitor/visitor'
import { accept } from '../visitor/visitor'
import type { ObjectLiteralParts } from './eb/literal/object-literal-expression-builder'
import { ObjectLiteralExpressionBuilder } from './eb/literal/object-literal-expression-builder'
import { codeInvariant, enumerate, invariant } from '../util'
import type { PType } from './ptypes'
import { biguintPType } from './ptypes'
import { uint64PType, UnionPType } from './ptypes'
import { NumberPType } from './ptypes'
import { BigIntPType } from './ptypes'
import { TuplePType } from './ptypes'
import { ObjectPType } from './ptypes'
import { StringFunctionBuilder, StringExpressionBuilder } from './eb/string-expression-builder'
import { nodeFactory } from '../awst/node-factory'
import { ArrayLiteralExpressionBuilder } from './eb/literal/array-literal-expression-builder'
import { BigIntLiteralExpressionBuilder } from './eb/literal/big-int-literal-expression-builder'
import { logger } from '../logger'
import { instanceEb, typeRegistry } from './type-registry'
import { ConditionalExpressionBuilder } from './eb/literal/conditional-expression-builder'
import { BooleanExpressionBuilder } from './eb/boolean-expression-builder'
import { boolPType } from './ptypes'
import type { AwstBuildContext } from './context/awst-build-context'
import type { Statement, Expression, LValue } from '../awst/nodes'
import { OmittedExpressionBuilder } from './eb/omitted-expression-builder'
import { awst } from '../awst'

export abstract class BaseVisitor implements Visitor<Expressions, NodeBuilder> {
  private baseAccept = <TNode extends ts.Node>(node: TNode) => accept<BaseVisitor, TNode>(this, node)
  readonly textVisitor: TextVisitor

  protected constructor(public context: AwstBuildContext) {
    this.textVisitor = new TextVisitor(context)
  }

  logNotSupported(node: ts.Node | undefined, message: string) {
    if (!node) return
    logger.error(new NotSupported(message, { sourceLocation: this.sourceLocation(node) }))
  }

  throwNotSupported(node: ts.Node, message: string): never {
    throw new NotSupported(message, { sourceLocation: this.sourceLocation(node) })
  }

  visitBigIntLiteral(node: ts.BigIntLiteral): InstanceBuilder {
    const literalValue = BigInt(node.text.slice(0, -1))
    return new BigIntLiteralExpressionBuilder(literalValue, new BigIntPType({ literalValue }), this.sourceLocation(node))
  }

  visitRegularExpressionLiteral(node: ts.RegularExpressionLiteral): InstanceBuilder {
    this.throwNotSupported(node, 'Regular expressions')
  }

  visitFalseKeyword(node: ts.FalseLiteral): InstanceBuilder {
    return new BooleanExpressionBuilder(nodeFactory.boolConstant({ value: false, sourceLocation: this.sourceLocation(node) }))
  }

  visitTrueKeyword(node: ts.TrueLiteral): InstanceBuilder {
    return new BooleanExpressionBuilder(nodeFactory.boolConstant({ value: true, sourceLocation: this.sourceLocation(node) }))
  }

  sourceLocation(node: ts.Node): SourceLocation {
    return this.context.getSourceLocation(node)
  }

  visitStringLiteral(node: ts.StringLiteral): InstanceBuilder {
    return new StringExpressionBuilder(nodeFactory.stringConstant({ value: node.text, sourceLocation: this.sourceLocation(node) }))
  }

  visitNoSubstitutionTemplateLiteral(node: ts.NoSubstitutionTemplateLiteral): InstanceBuilder {
    return new StringExpressionBuilder(nodeFactory.stringConstant({ value: node.text, sourceLocation: this.sourceLocation(node) }))
  }

  visitNumericLiteral(node: ts.NumericLiteral): InstanceBuilder {
    const literalValue = BigInt(node.text)
    return new BigIntLiteralExpressionBuilder(literalValue, new NumberPType({ literalValue }), this.sourceLocation(node))
  }

  visitIdentifier(node: ts.Identifier): NodeBuilder {
    return this.context.getBuilderForNode(node)
  }

  visitImportKeyword(node: ts.ImportExpression): NodeBuilder {
    this.throwNotSupported(node, 'Dynamic imports')
  }

  visitNullKeyword(node: ts.NullLiteral): NodeBuilder {
    this.throwNotSupported(node, 'Null values')
  }

  visitPrivateIdentifier(node: ts.PrivateIdentifier): NodeBuilder {
    throw new TodoError('PrivateIdentifier')
  }

  visitSuperKeyword(node: ts.SuperExpression): NodeBuilder {
    this.throwNotSupported(node, `'super' keyword outside of a contract type`)
  }

  visitThisKeyword(node: ts.ThisExpression): NodeBuilder {
    this.throwNotSupported(node, `'this' keyword outside of a contract type`)
  }

  visitFunctionExpression(node: ts.FunctionExpression): NodeBuilder {
    throw new TodoError('FunctionExpression')
  }

  visitClassExpression(node: ts.ClassExpression): NodeBuilder {
    this.throwNotSupported(node, 'Class expressions')
  }

  visitObjectLiteralExpression(node: ts.ObjectLiteralExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const parts: Array<ObjectLiteralParts> = node.properties.flatMap((p): ObjectLiteralParts[] => {
      const propertySourceLocation = this.sourceLocation(p)
      switch (p.kind) {
        case ts.SyntaxKind.PropertyAssignment:
          return [
            {
              type: 'properties',
              properties: {
                [this.textVisitor.accept(p.name)]: requireInstanceBuilder(this.baseAccept(p.initializer), propertySourceLocation),
              },
            },
          ]
        case ts.SyntaxKind.ShorthandPropertyAssignment:
          codeInvariant(!p.objectAssignmentInitializer, 'Object assignment initializer not supported', propertySourceLocation)
          this.logNotSupported(p.equalsToken, 'The equals token is not valid here')
          return [
            {
              type: 'properties',
              properties: { [this.textVisitor.accept(p.name)]: requireInstanceBuilder(this.baseAccept(p.name), propertySourceLocation) },
            },
          ]
        case ts.SyntaxKind.SpreadAssignment:
          return [
            {
              type: 'spread-object',
              obj: requireInstanceBuilder(this.baseAccept(p.expression), propertySourceLocation),
            },
          ]
        default:
          logger.error(propertySourceLocation, `Unsupported object literal property kind ${getNodeName(p)}`)
          return []
      }
    })
    const ptype = this.context.getPTypeForNode(node)
    invariant(ptype instanceof ObjectPType, 'Object literal ptype should resolve to ObjectPType')
    return new ObjectLiteralExpressionBuilder(sourceLocation, ptype, parts, () => this.context.generateDiscardedVarName())
  }

  visitArrayLiteralExpression(node: ts.ArrayLiteralExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    return new ArrayLiteralExpressionBuilder(
      sourceLocation,
      node.elements.map((e) => requireInstanceBuilder(this.baseAccept(e), sourceLocation)),
    )
  }

  visitPropertyAccessExpression(node: ts.PropertyAccessExpression): NodeBuilder {
    this.logNotSupported(node.questionDotToken, 'The optional chaining (?.) operator is not supported')
    const target = this.baseAccept(node.expression)
    const property = this.textVisitor.accept(node.name)
    return target.memberAccess(property, this.sourceLocation(node))
  }

  visitElementAccessExpression(node: ts.ElementAccessExpression): NodeBuilder {
    this.logNotSupported(node.questionDotToken, 'The optional chaining (?.) operator is not supported')

    const sourceLocation = this.sourceLocation(node)
    const target = this.baseAccept(node.expression)
    const argument = this.baseAccept(node.argumentExpression)
    return target.indexAccess(requireInstanceBuilder(argument, this.sourceLocation(node.argumentExpression)), sourceLocation)
  }

  visitCallExpression(node: ts.CallExpression): NodeBuilder {
    this.logNotSupported(node.questionDotToken, 'The optional chaining (?.) operator is not supported')
    const sourceLocation = this.sourceLocation(node)
    const eb = this.baseAccept(node.expression)
    const args = node.arguments.map((a) => requireInstanceBuilder(this.baseAccept(a), sourceLocation))
    const typeArgs = node.typeArguments?.map((t) => this.context.getPTypeForNode(t)) ?? this.context.getPTypeForNode(node).getGenericArgs()
    return eb.call(args, typeArgs, sourceLocation)
  }

  visitNewExpression(node: ts.NewExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const eb = this.baseAccept(node.expression)
    const args = node.arguments?.map((a) => requireInstanceBuilder(this.baseAccept(a), sourceLocation)) ?? []
    const typeArgs = node.typeArguments?.map((t) => this.context.getPTypeForNode(t)) ?? this.context.getPTypeForNode(node).getGenericArgs()
    return eb.newCall(args, typeArgs, sourceLocation)
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
    return this.baseAccept(node.expression)
  }

  /**
   * `delete obj.prop`
   *
   * Not supported currently as typescript requires 'prop' to be optional and we don't support optional values
   */
  visitDeleteExpression(node: ts.DeleteExpression): NodeBuilder {
    this.throwNotSupported(node, 'Delete expressions')
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
    const sourceLocation = this.sourceLocation(node)
    const target = requireInstanceBuilder(this.baseAccept(node.operand), sourceLocation)
    if (node.operator === ts.SyntaxKind.ExclamationToken) {
      return new BooleanExpressionBuilder(target.boolEval(sourceLocation, true))
    }
    const op = UnaryExpressionUnaryOps[node.operator]
    return target.prefixUnaryOp(op, sourceLocation)
  }

  visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const target = requireInstanceBuilder(this.baseAccept(node.operand), sourceLocation)
    const op = UnaryExpressionUnaryOps[node.operator]
    return target.postfixUnaryOp(op, sourceLocation)
  }

  evaluateCondition(nodeOrBuilder: ts.Expression | NodeBuilder, negate = false): Expression {
    using _ = this.context.evaluationCtx.enterBooleanContext()
    if (nodeOrBuilder instanceof NodeBuilder) {
      return requireInstanceBuilder(nodeOrBuilder, nodeOrBuilder.sourceLocation).boolEval(nodeOrBuilder.sourceLocation, negate)
    } else {
      const sourceLocation = this.sourceLocation(nodeOrBuilder)
      return requireInstanceBuilder(this.baseAccept(nodeOrBuilder), sourceLocation).boolEval(sourceLocation, negate)
    }
  }

  visitBinaryExpression(node: ts.BinaryExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const binaryOpKind = node.operatorToken.kind
    if (isKeyOf(binaryOpKind, BinaryOpSyntaxes)) {
      const left = requireInstanceBuilder(this.baseAccept(node.left), sourceLocation)
      const right = requireInstanceBuilder(this.baseAccept(node.right), sourceLocation)
      return left.binaryOp(right, BinaryOpSyntaxes[binaryOpKind], sourceLocation)
    } else if (isKeyOf(binaryOpKind, AugmentedAssignmentBinaryOp)) {
      using _ = this.context.evaluationCtx.leaveBooleanContext()

      const left = requireInstanceBuilder(this.baseAccept(node.left), sourceLocation)
      const right = requireInstanceBuilder(this.baseAccept(node.right), sourceLocation)
      return left.augmentedAssignment(right, AugmentedAssignmentBinaryOp[binaryOpKind], sourceLocation)
    } else if (binaryOpKind === ts.SyntaxKind.EqualsToken) {
      using _ = this.context.evaluationCtx.leaveBooleanContext()

      const left = requireInstanceBuilder(this.baseAccept(node.left), sourceLocation)
      const right = requireInstanceBuilder(this.baseAccept(node.right), sourceLocation)
      return this.handleAssignment(left, right, sourceLocation)
    } else if (isKeyOf(binaryOpKind, ComparisonOpSyntaxes)) {
      const left = requireInstanceBuilder(this.baseAccept(node.left), sourceLocation)
      const right = requireInstanceBuilder(this.baseAccept(node.right), sourceLocation)
      return left.compare(right, ComparisonOpSyntaxes[binaryOpKind], sourceLocation)
    } else if (isKeyOf(binaryOpKind, LogicalOpSyntaxes)) {
      const ptype = this.context.getPTypeForNode(node)
      if (ptype.equals(boolPType)) {
        const left = requireInstanceBuilder(this.baseAccept(node.left), sourceLocation)
        const right = requireInstanceBuilder(this.baseAccept(node.right), sourceLocation)

        return new BooleanExpressionBuilder(
          nodeFactory.booleanBinaryOperation({
            left: requireExpressionOfType(left, boolPType, sourceLocation),
            right: requireExpressionOfType(right, boolPType, sourceLocation),
            sourceLocation,
            wtype: boolPType.wtype,
            op: LogicalOpSyntaxes[binaryOpKind],
          }),
        )
      } else if (this.context.evaluationCtx.isBoolean) {
        const left = requireInstanceBuilder(this.baseAccept(node.left), sourceLocation)
        const right = requireInstanceBuilder(this.baseAccept(node.right), sourceLocation)
        return new BooleanExpressionBuilder(
          nodeFactory.booleanBinaryOperation({
            left: left.boolEval(sourceLocation),
            right: right.boolEval(sourceLocation),
            sourceLocation,
            wtype: boolPType.wtype,
            op: LogicalOpSyntaxes[binaryOpKind],
          }),
        )
      } else {
        const left = requireInstanceBuilder(this.baseAccept(node.left), sourceLocation)
        const right = requireInstanceBuilder(this.baseAccept(node.right), sourceLocation)
        const leftSingle = left.singleEvaluation()
        const isOr = binaryOpKind === ts.SyntaxKind.BarBarToken
        return this.createConditionalExpression({
          sourceLocation,
          condition: this.evaluateCondition(leftSingle),
          whenTrue: isOr ? leftSingle : right,
          whenFalse: isOr ? right : leftSingle,
          ptype: ptype,
        })
      }
    } else if (isKeyOf(binaryOpKind, AugmentedAssignmentLogicalOpSyntaxes)) {
      using _ = this.context.evaluationCtx.leaveBooleanContext()
      const left = requireInstanceBuilder(this.baseAccept(node.left), sourceLocation)
      const right = requireInstanceBuilder(this.baseAccept(node.right), sourceLocation)
      const expr = new BooleanExpressionBuilder(
        nodeFactory.booleanBinaryOperation({
          left: requireExpressionOfType(left, boolPType, sourceLocation),
          right: requireExpressionOfType(right, boolPType, sourceLocation),
          sourceLocation,
          wtype: boolPType.wtype,
          op: AugmentedAssignmentLogicalOpSyntaxes[binaryOpKind],
        }),
      )
      return this.handleAssignment(left, expr, sourceLocation)
    }
    throw new NotSupported(`Binary expression with op ${getSyntaxName(binaryOpKind)}`)
  }

  visitConditionalExpression(node: ts.ConditionalExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const condition = this.evaluateCondition(node.condition)
    const whenTrue = requireInstanceBuilder(this.baseAccept(node.whenTrue), sourceLocation)
    const whenFalse = requireInstanceBuilder(this.baseAccept(node.whenFalse), sourceLocation)
    const ptype = this.context.getPTypeForNode(node)
    return this.createConditionalExpression({
      condition,
      sourceLocation,
      whenFalse,
      whenTrue,
      ptype,
    })
  }

  createConditionalExpression({
    condition,
    ptype,
    whenFalse,
    whenTrue,
    sourceLocation,
  }: {
    ptype: PType
    condition: Expression
    whenTrue: InstanceBuilder
    whenFalse: InstanceBuilder
    sourceLocation: SourceLocation
  }): InstanceBuilder {
    // If the expression has a wtype, we can resolve it immediately - if not, we defer the resolution until we have more context
    // (eg. the type of the assignment target)
    if (ptype.wtype) {
      return typeRegistry.getInstanceEb(
        nodeFactory.conditionalExpression({
          sourceLocation: sourceLocation,
          falseExpr: requireExpressionOfType(whenFalse, ptype, sourceLocation),
          trueExpr: requireExpressionOfType(whenTrue, ptype, sourceLocation),
          condition: condition,
          wtype: ptype.wtypeOrThrow,
        }),
        ptype,
      )
    }
    return new ConditionalExpressionBuilder({ sourceLocation, condition, whenTrue, whenFalse, ptype })
  }

  visitTemplateExpression(node: ts.TemplateExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const target = new StringFunctionBuilder(sourceLocation)

    const head = this.textVisitor.accept(node.head)
    const spans = node.templateSpans.map(
      (s) => [requireInstanceBuilder(this.baseAccept(s.expression), sourceLocation), this.textVisitor.accept(s.literal)] as const,
    )
    return target.taggedTemplate(head, spans, sourceLocation)
  }

  visitYieldExpression(node: ts.YieldExpression): NodeBuilder {
    throw new TodoError('YieldExpression')
  }

  visitOmittedExpression(node: ts.OmittedExpression): NodeBuilder {
    return new OmittedExpressionBuilder(this.context.getSourceLocation(node))
  }

  visitExpressionWithTypeArguments(node: ts.ExpressionWithTypeArguments): NodeBuilder {
    throw new TodoError('ExpressionWithTypeArguments')
  }

  visitAsExpression(node: ts.AsExpression): NodeBuilder {
    // TODO: Is this robust enough??
    if (ts.isTypeReferenceNode(node.type) && ts.isIdentifier(node.type.typeName) && node.type.typeName.text === 'const') {
      // TODO: Do we need to do resolveAsPType here to re-resolve the target expression
      return this.baseAccept(node.expression)
    }
    throw new TodoError('AsExpression')
  }

  visitNonNullExpression(node: ts.NonNullExpression): NodeBuilder {
    throw new TodoError('NonNullExpression')
  }

  visitSatisfiesExpression(node: ts.SatisfiesExpression): NodeBuilder {
    return this.baseAccept(node.expression)
  }

  handleAssignmentStatement(target: InstanceBuilder, source: InstanceBuilder, sourceLocation: SourceLocation): Statement {
    const expr = this.handleAssignment(target, source, sourceLocation).resolve()
    if (expr instanceof awst.AssignmentExpression) {
      return nodeFactory.assignmentStatement({
        ...expr,
      })
    }
    return nodeFactory.expressionStatement({ expr })
  }

  handleAssignment(target: InstanceBuilder, source: InstanceBuilder, sourceLocation: SourceLocation): InstanceBuilder {
    if (source.ptype.equals(target.ptype)) {
      return instanceEb(
        nodeFactory.assignmentExpression({
          target: target.resolveLValue(),
          sourceLocation,
          value: source.resolve(),
        }),
        target.ptype,
      )
    } else {
      const assignmentType = this.buildAssignmentExpressionType(target.ptype, source.ptype)
      return instanceEb(
        nodeFactory.assignmentExpression({
          target: this.buildLValue(target, assignmentType, sourceLocation),
          sourceLocation,
          value: source.resolveToPType(assignmentType, sourceLocation).resolve(),
        }),
        assignmentType,
      )
    }
  }

  /**
   * Given a target and source type, produce a type that represents the result of an assignment expression.
   *
   * This will largely represent the sourceType verbatim with the exception of numeric literal types which need
   * to be narrowed using the targetType.
   *
   * Eg. a `number` on the rhs should be narrowed to whatever the lhs is for example uint64.
   * @param targetType
   * @param sourceType
   * @private
   */
  private buildAssignmentExpressionType(targetType: PType, sourceType: PType): PType {
    if (sourceType.equals(targetType)) {
      return targetType
    }
    if (
      sourceType instanceof NumberPType ||
      (sourceType instanceof UnionPType && sourceType.types.every((t) => t.equals(uint64PType) || t instanceof NumberPType))
    ) {
      return targetType
    }
    if (
      sourceType instanceof BigIntPType ||
      (sourceType instanceof UnionPType && sourceType.types.every((t) => t.equals(biguintPType) || t instanceof BigIntPType))
    ) {
      return targetType
    }
    if (sourceType instanceof TuplePType) {
      codeInvariant(targetType instanceof TuplePType, 'Target type should match assignment type')
      return new TuplePType({
        items: sourceType.items.map((item, index) => this.buildAssignmentExpressionType(targetType.items[index], item)),
        immutable: sourceType.immutable,
      })
    }
    if (sourceType instanceof ObjectPType) {
      codeInvariant(targetType instanceof ObjectPType, 'Target type should match assignment type')
      return new ObjectPType({
        properties: Object.fromEntries(
          sourceType
            .orderedProperties()
            .map(([prop, propType]): [string, PType] => [
              prop,
              prop in targetType.properties ? this.buildAssignmentExpressionType(targetType.getPropertyType(prop), propType) : propType,
            ]),
        ),
      })
    }
    return sourceType
  }

  private buildLValue(target: InstanceBuilder, assignmentType: PType, sourceLocation: SourceLocation): LValue {
    if (target instanceof ArrayLiteralExpressionBuilder) {
      if (assignmentType instanceof TuplePType) {
        const targetItems = target.resolveItems()

        const targets: LValue[] = []
        for (const [index, sourceItemType] of enumerate(assignmentType.items)) {
          const targetItem = targetItems[index]
          if (targetItem && !(targetItem instanceof OmittedExpressionBuilder)) {
            targets.push(targetItem.resolveToPType(sourceItemType, sourceLocation).resolveLValue())
          } else {
            targets.push(
              nodeFactory.varExpression({
                name: this.context.generateDiscardedVarName(),
                sourceLocation,
                wtype: sourceItemType.wtypeOrThrow,
              }),
            )
          }
        }
        return nodeFactory.tupleExpression({ items: targets, sourceLocation })
      }
    }
    if (target instanceof ObjectLiteralExpressionBuilder) {
      if (assignmentType instanceof ObjectPType) {
        const targets: LValue[] = []
        for (const [propName, propType] of assignmentType.orderedProperties()) {
          if (target.hasProperty(propName)) {
            targets.push(target.memberAccess(propName, sourceLocation).resolveLValue())
          } else {
            targets.push(
              nodeFactory.varExpression({
                name: this.context.generateDiscardedVarName(),
                sourceLocation,
                wtype: propType.wtypeOrThrow,
              }),
            )
          }
        }
        return nodeFactory.tupleExpression({ items: targets, sourceLocation })
      }
    }
    if (target.ptype.equals(assignmentType)) {
      return target.resolveLValue()
    }
    throw new CodeError(
      `The target of an assignment must have the same type as the source. Target: ${target.ptype}, Source: ${assignmentType}`,
      {
        sourceLocation,
      },
    )
  }
}
