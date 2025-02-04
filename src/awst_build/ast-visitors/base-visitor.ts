import ts from 'typescript'
import { nodeFactory } from '../../awst/node-factory'
import type { Expression, LValue, MethodDocumentation, Statement } from '../../awst/nodes'
import { SourceLocation } from '../../awst/source-location'
import { CodeError, InternalError, NotSupported } from '../../errors'
import { logger } from '../../logger'
import { codeInvariant, enumerate, invariant, sortBy } from '../../util'
import type { Expressions } from '../../visitor/syntax-names'
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
} from '../../visitor/syntax-names'
import type { Visitor } from '../../visitor/visitor'
import { accept } from '../../visitor/visitor'
import type { AwstBuildContext } from '../context/awst-build-context'
import { InstanceBuilder, NodeBuilder } from '../eb'
import { BooleanExpressionBuilder } from '../eb/boolean-expression-builder'
import { ArrayLiteralExpressionBuilder } from '../eb/literal/array-literal-expression-builder'
import { BigIntLiteralExpressionBuilder } from '../eb/literal/big-int-literal-expression-builder'
import { ConditionalExpressionBuilder } from '../eb/literal/conditional-expression-builder'
import type { ObjectLiteralParts } from '../eb/literal/object-literal-expression-builder'
import { ObjectLiteralExpressionBuilder } from '../eb/literal/object-literal-expression-builder'
import { NamespaceBuilder } from '../eb/namespace-builder'
import { OmittedExpressionBuilder } from '../eb/omitted-expression-builder'
import { StringExpressionBuilder, StringFunctionBuilder } from '../eb/string-expression-builder'
import { requireExpressionOfType, requireInstanceBuilder } from '../eb/util'
import { concatArrays } from '../eb/util/array/concat'
import type { PType } from '../ptypes'
import {
  ArrayLiteralPType,
  ArrayPType,
  BigIntLiteralPType,
  bigIntPType,
  biguintPType,
  boolPType,
  numberPType,
  NumericLiteralPType,
  ObjectPType,
  TransientType,
  TuplePType,
  uint64PType,
  UnionPType,
} from '../ptypes'
import { instanceEb, typeRegistry } from '../type-registry'
import { TextVisitor } from './text-visitor'

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
    const ptype = this.context.getPTypeForNode(node)
    invariant(ptype instanceof TransientType, 'Literals should resolve to transient PTypes')
    return new BigIntLiteralExpressionBuilder(literalValue, ptype, this.sourceLocation(node))
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
    const sourceLocation = this.sourceLocation(node)
    codeInvariant(
      !node.text.includes('.'),
      'Literals with decimal points are not supported. Use a string literal to capture decimal values',
      sourceLocation,
    )
    const literalValue = BigInt(node.text)
    if (literalValue > Number.MAX_SAFE_INTEGER || literalValue < Number.MIN_SAFE_INTEGER) {
      logger.error(
        sourceLocation,
        `This number will lose precision at runtime. Use the Uint64 constructor with a bigint or string literal for very large integers.`,
      )
    }
    const ptype = this.context.getPTypeForNode(node)
    invariant(ptype instanceof TransientType, 'Literals should resolve to transient PTypes')
    return new BigIntLiteralExpressionBuilder(literalValue, ptype, this.sourceLocation(node))
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
    // Private identifiers will be wrapped in a property access expression which makes use of the TextVisitor
    throw InternalError.shouldBeUnreachable()
  }

  visitSuperKeyword(node: ts.SuperExpression): NodeBuilder {
    this.throwNotSupported(node, `'super' keyword outside of a contract type`)
  }

  visitThisKeyword(node: ts.ThisExpression): NodeBuilder {
    this.throwNotSupported(node, `'this' keyword outside of a contract type`)
  }

  visitFunctionExpression(node: ts.FunctionExpression): NodeBuilder {
    this.throwNotSupported(node, 'function expressions. Use a named function instead eg. `function myFunction(...) {...}`')
  }

  visitClassExpression(node: ts.ClassExpression): NodeBuilder {
    this.throwNotSupported(node, 'class expressions')
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
                [this.textVisitor.accept(p.name)]: requireInstanceBuilder(this.baseAccept(p.initializer)),
              },
            },
          ]
        case ts.SyntaxKind.ShorthandPropertyAssignment:
          codeInvariant(!p.objectAssignmentInitializer, 'Object assignment initializer not supported', propertySourceLocation)
          this.logNotSupported(p.equalsToken, 'The equals token is not valid here')
          return [
            {
              type: 'properties',
              properties: { [this.textVisitor.accept(p.name)]: requireInstanceBuilder(this.baseAccept(p.name)) },
            },
          ]
        case ts.SyntaxKind.SpreadAssignment:
          return [
            {
              type: 'spread-object',
              obj: requireInstanceBuilder(this.baseAccept(p.expression)),
            },
          ]
        default:
          logger.error(propertySourceLocation, `Unsupported object literal property kind ${getNodeName(p)}`)
          return []
      }
    })
    const ptype = this.context.getPTypeForNode(node)
    invariant(ptype instanceof ObjectPType, 'Object literal ptype should resolve to ObjectPType')
    return new ObjectLiteralExpressionBuilder(sourceLocation, ptype, parts)
  }

  visitArrayLiteralExpression(node: ts.ArrayLiteralExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)

    const toConcat: Array<InstanceBuilder[] | InstanceBuilder> = []
    let itemBuffer: InstanceBuilder[] = []
    for (const element of node.elements) {
      if (ts.isSpreadElement(element)) {
        const spreadExpr = requireInstanceBuilder(this.baseAccept(element.expression))
        if (itemBuffer.length !== 0) {
          toConcat.push(itemBuffer)
          itemBuffer = []
        }
        toConcat.push(spreadExpr)
      } else {
        itemBuffer.push(requireInstanceBuilder(this.baseAccept(element)))
      }
    }
    if (itemBuffer.length !== 0) {
      toConcat.push(itemBuffer)
    }

    return toConcat
      .map((i) =>
        Array.isArray(i) ? new ArrayLiteralExpressionBuilder(SourceLocation.fromLocations(...i.map((li) => li.sourceLocation)), i) : i,
      )
      .reduce((acc, cur) => concatArrays(acc, cur, sourceLocation))
  }

  visitSpreadElement(node: ts.SpreadElement): NodeBuilder {
    this.throwNotSupported(node, 'Spread element should be handled by array literal visitor')
  }

  visitPropertyAccessExpression(node: ts.PropertyAccessExpression): NodeBuilder {
    this.logNotSupported(node.questionDotToken, 'The optional chaining (?.) operator is not supported')
    const target = this.baseAccept(node.expression)
    if (target instanceof NamespaceBuilder) {
      codeInvariant(!ts.isPrivateIdentifier(node.name), 'Private identifiers are not supported here', this.sourceLocation(node.name))
      return this.context.getBuilderForNode(node.name)
    }
    const property = this.textVisitor.accept(node.name)
    return target.memberAccess(property, this.sourceLocation(node.name))
  }

  visitElementAccessExpression(node: ts.ElementAccessExpression): NodeBuilder {
    this.logNotSupported(node.questionDotToken, 'The optional chaining (?.) operator is not supported')

    const sourceLocation = this.sourceLocation(node)
    const target = this.baseAccept(node.expression)
    const argument = this.baseAccept(node.argumentExpression)
    return target.indexAccess(requireInstanceBuilder(argument), sourceLocation)
  }

  visitCallExpression(node: ts.CallExpression): NodeBuilder {
    this.logNotSupported(node.questionDotToken, 'The optional chaining (?.) operator is not supported')
    const sourceLocation = this.sourceLocation(node)
    const eb = this.baseAccept(node.expression)
    const args = node.arguments.map((a) => this.baseAccept(a))
    const typeArgs = this.context.getTypeParameters(node)
    return eb.call(args, typeArgs, sourceLocation)
  }

  visitNewExpression(node: ts.NewExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const eb = this.baseAccept(node.expression)
    const args = node.arguments?.map((a) => this.baseAccept(a)) ?? []
    const typeArgs = this.context.getTypeParameters(node)
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
        (s) => [requireInstanceBuilder(this.baseAccept(s.expression)), this.textVisitor.accept(s.literal)] as const,
      )
      return target.taggedTemplate(head, spans, sourceLocation)
    }
  }

  visitTypeAssertionExpression(node: ts.TypeAssertion): NodeBuilder {
    // Unsure what code this node represents - it may have been superseded by the AsExpression
    this.throwNotSupported(node, 'Type assertions')
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
    this.throwNotSupported(node, 'typeof expressions are only supported in type expressions')
  }

  visitVoidExpression(node: ts.VoidExpression): NodeBuilder {
    this.throwNotSupported(node, 'void expression')
  }

  visitAwaitExpression(node: ts.AwaitExpression): NodeBuilder {
    this.throwNotSupported(node, 'await keyword')
  }

  visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const target = requireInstanceBuilder(this.baseAccept(node.operand))
    if (node.operator === ts.SyntaxKind.ExclamationToken) {
      return new BooleanExpressionBuilder(target.boolEval(sourceLocation, true))
    }
    const op = UnaryExpressionUnaryOps[node.operator]
    return target.prefixUnaryOp(op, sourceLocation)
  }

  visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const target = requireInstanceBuilder(this.baseAccept(node.operand))
    const op = UnaryExpressionUnaryOps[node.operator]
    return target.postfixUnaryOp(op, sourceLocation)
  }

  evaluateCondition(nodeOrBuilder: ts.Expression | NodeBuilder, negate = false): Expression {
    using _ = this.context.evaluationCtx.enterBooleanContext()
    if (nodeOrBuilder instanceof NodeBuilder) {
      return requireInstanceBuilder(nodeOrBuilder).boolEval(nodeOrBuilder.sourceLocation, negate)
    } else {
      const sourceLocation = this.sourceLocation(nodeOrBuilder)
      return requireInstanceBuilder(this.baseAccept(nodeOrBuilder)).boolEval(sourceLocation, negate)
    }
  }

  visitBinaryExpression(node: ts.BinaryExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const binaryOpKind = node.operatorToken.kind
    if (isKeyOf(binaryOpKind, BinaryOpSyntaxes)) {
      const left = requireInstanceBuilder(this.baseAccept(node.left))
      const right = requireInstanceBuilder(this.baseAccept(node.right))
      return left.binaryOp(right, BinaryOpSyntaxes[binaryOpKind], sourceLocation)
    } else if (isKeyOf(binaryOpKind, AugmentedAssignmentBinaryOp)) {
      using _ = this.context.evaluationCtx.leaveBooleanContext()

      const left = requireInstanceBuilder(this.baseAccept(node.left))
      const right = requireInstanceBuilder(this.baseAccept(node.right))
      return left.augmentedAssignment(right, AugmentedAssignmentBinaryOp[binaryOpKind], sourceLocation)
    } else if (binaryOpKind === ts.SyntaxKind.EqualsToken) {
      using _ = this.context.evaluationCtx.leaveBooleanContext()

      const left = requireInstanceBuilder(this.baseAccept(node.left))
      const right = requireInstanceBuilder(this.baseAccept(node.right))
      return this.handleAssignment(left, right, sourceLocation)
    } else if (isKeyOf(binaryOpKind, ComparisonOpSyntaxes)) {
      const left = requireInstanceBuilder(this.baseAccept(node.left))
      const right = requireInstanceBuilder(this.baseAccept(node.right))
      return left.compare(right, ComparisonOpSyntaxes[binaryOpKind], sourceLocation)
    } else if (isKeyOf(binaryOpKind, LogicalOpSyntaxes)) {
      const ptype = this.context.getPTypeForNode(node)
      if (ptype.equals(boolPType)) {
        const left = requireInstanceBuilder(this.baseAccept(node.left))
        const right = requireInstanceBuilder(this.baseAccept(node.right))

        return new BooleanExpressionBuilder(
          nodeFactory.booleanBinaryOperation({
            left: requireExpressionOfType(left, boolPType),
            right: requireExpressionOfType(right, boolPType),
            sourceLocation,
            op: LogicalOpSyntaxes[binaryOpKind],
          }),
        )
      } else if (this.context.evaluationCtx.isBoolean) {
        const left = requireInstanceBuilder(this.baseAccept(node.left))
        const right = requireInstanceBuilder(this.baseAccept(node.right))
        return new BooleanExpressionBuilder(
          nodeFactory.booleanBinaryOperation({
            left: left.boolEval(sourceLocation),
            right: right.boolEval(sourceLocation),
            sourceLocation,
            op: LogicalOpSyntaxes[binaryOpKind],
          }),
        )
      } else {
        const left = requireInstanceBuilder(this.baseAccept(node.left))
        const right = requireInstanceBuilder(this.baseAccept(node.right))
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
      const left = requireInstanceBuilder(this.baseAccept(node.left))
      const right = requireInstanceBuilder(this.baseAccept(node.right))
      const expr = new BooleanExpressionBuilder(
        nodeFactory.booleanBinaryOperation({
          left: requireExpressionOfType(left, boolPType),
          right: requireExpressionOfType(right, boolPType),
          sourceLocation,
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
    const whenTrue = requireInstanceBuilder(this.baseAccept(node.whenTrue))
    const whenFalse = requireInstanceBuilder(this.baseAccept(node.whenFalse))
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
    if (!(ptype instanceof TransientType) && ptype.wtype) {
      return typeRegistry.getInstanceEb(
        nodeFactory.conditionalExpression({
          sourceLocation: sourceLocation,
          falseExpr: requireExpressionOfType(whenFalse, ptype),
          trueExpr: requireExpressionOfType(whenTrue, ptype),
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
      (s) => [requireInstanceBuilder(this.baseAccept(s.expression)), this.textVisitor.accept(s.literal)] as const,
    )
    return target.taggedTemplate(head, spans, sourceLocation)
  }

  visitYieldExpression(node: ts.YieldExpression): NodeBuilder {
    this.throwNotSupported(node, 'yield expressions')
  }

  visitOmittedExpression(node: ts.OmittedExpression): NodeBuilder {
    return new OmittedExpressionBuilder(this.context.getSourceLocation(node))
  }

  visitExpressionWithTypeArguments(node: ts.ExpressionWithTypeArguments): NodeBuilder {
    // Should be fine to ignore the type parameters as these can be inferred by the type checker
    return this.baseAccept(node.expression)
  }

  visitAsExpression(node: ts.AsExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const outerType = this.context.getPTypeForNode(node)

    if (outerType instanceof TransientType) {
      throw new CodeError(outerType.typeMessage, { sourceLocation })
    }

    const innerExpr = this.baseAccept(node.expression)
    codeInvariant(
      innerExpr instanceof InstanceBuilder,
      `${innerExpr.typeDescription} is not a valid target for an as expression'`,
      sourceLocation,
    )

    codeInvariant(
      innerExpr.resolvableToPType(outerType),
      `${innerExpr.typeDescription} cannot be resolved to type ${outerType}`,
      sourceLocation,
    )

    return innerExpr.resolveToPType(outerType)
  }

  visitNonNullExpression(node: ts.NonNullExpression): NodeBuilder {
    this.throwNotSupported(node, 'non null assertions')
  }

  visitSatisfiesExpression(node: ts.SatisfiesExpression): NodeBuilder {
    return this.baseAccept(node.expression)
  }

  handleAssignmentStatement(target: InstanceBuilder, source: InstanceBuilder, sourceLocation: SourceLocation): Statement {
    return nodeFactory.expressionStatement({ expr: this.handleAssignment(target, source, sourceLocation).resolve() })
  }

  handleAssignment(target: InstanceBuilder, source: InstanceBuilder, sourceLocation: SourceLocation): InstanceBuilder {
    const assignmentType = this.buildAssignmentExpressionType(target.ptype, source.ptype, sourceLocation)
    return instanceEb(
      nodeFactory.assignmentExpression({
        target: this.buildLValue(target, assignmentType, sourceLocation),
        sourceLocation,
        value: source.resolveToPType(assignmentType).resolve(),
      }),
      assignmentType,
    )
  }

  /**
   * Given a target and source type, produce a type that represents the result of an assignment expression.
   *
   * This will largely represent the sourceType verbatim with the exception of numeric literal types which need
   * to be narrowed using the targetType.
   *
   * Eg. a `number` on the rhs should be narrowed to whatever the lhs is for example uint64.
   * @param targetType The type of the assignment target
   * @param sourceType The type of the assignment source
   * @param sourceLocation
   * @private
   */
  private buildAssignmentExpressionType(targetType: PType, sourceType: PType, sourceLocation: SourceLocation): PType {
    if (targetType instanceof ArrayLiteralPType)
      // Puya does not support assigning to array targets, but we can treat array literals as tuples
      return this.buildAssignmentExpressionType(targetType.getTupleType(), sourceType, sourceLocation)

    const errorMessage = `Value of type ${sourceType.name} cannot be assigned to target of type ${targetType.name}`
    if (sourceType.equals(targetType)) {
      return targetType
    }
    if (
      sourceType instanceof NumericLiteralPType ||
      sourceType.equals(numberPType) ||
      (sourceType instanceof UnionPType &&
        sourceType.types.every((t) => t.equals(uint64PType) || t instanceof NumericLiteralPType || sourceType.equals(numberPType)))
    ) {
      // Narrow `uint64 | number` or `number` to target type
      return targetType
    }
    if (
      sourceType.equals(bigIntPType) ||
      sourceType instanceof BigIntLiteralPType ||
      (sourceType instanceof UnionPType &&
        sourceType.types.every((t) => t.equals(biguintPType) || t instanceof BigIntLiteralPType || t.equals(bigIntPType)))
    ) {
      // Narrow `biguint | bigint` or `bigint` to target type
      return targetType
    }
    if (sourceType instanceof ArrayLiteralPType) {
      if (targetType instanceof TuplePType) {
        // Narrow array literal types to tuple item types
        codeInvariant(targetType.items.length <= sourceType.items.length, errorMessage, sourceLocation)
        return new TuplePType({
          items: sourceType.items.map((item, index) =>
            index < targetType.items.length ? this.buildAssignmentExpressionType(targetType.items[index], item, sourceLocation) : item,
          ),
        })
      } else if (targetType instanceof ArrayPType) {
        // Narrow array literal types to array type
        codeInvariant(
          sourceType.items.every((i) =>
            this.buildAssignmentExpressionType(targetType.elementType, i, sourceLocation).equals(targetType.elementType),
          ),
          errorMessage,
          sourceLocation,
        )
        return targetType
      }
    }
    if (sourceType instanceof ObjectPType) {
      // Recursively narrow object properties
      codeInvariant(targetType instanceof ObjectPType, errorMessage)
      const targetPropertyOrder = targetType
        .orderedProperties()
        .reduce((acc, [prop], index) => acc.set(prop, index), new Map<string, number>())
      return new ObjectPType({
        name: targetType.name,
        module: targetType.module,
        description: targetType.description,
        properties: Object.fromEntries(
          sourceType
            .orderedProperties()
            .map(([prop, propType]): [string, PType] => [
              prop,
              prop in targetType.properties
                ? this.buildAssignmentExpressionType(targetType.getPropertyType(prop), propType, sourceLocation)
                : propType,
            ])
            .toSorted(sortBy(([prop]) => targetPropertyOrder.get(prop) ?? Number.MAX_SAFE_INTEGER)),
        ),
      })
    }
    return sourceType
  }

  buildLValue(target: InstanceBuilder, assignmentType: PType, sourceLocation: SourceLocation): LValue {
    if (target instanceof ArrayLiteralExpressionBuilder) {
      if (assignmentType instanceof TuplePType) {
        const targetItems = target.getItemBuilders()

        const targets: LValue[] = []
        for (const [index, sourceItemType] of enumerate(assignmentType.items)) {
          const targetItem = targetItems[index]
          if (targetItem && !(targetItem instanceof OmittedExpressionBuilder)) {
            targets.push(this.buildLValue(targetItem, sourceItemType, sourceLocation))
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
            targets.push(this.buildLValue(target.memberAccess(propName, sourceLocation), propType, sourceLocation))
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
        return nodeFactory.tupleExpression({ items: targets, sourceLocation, wtype: assignmentType.wtype })
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

  protected parseMemberModifiers(node: { modifiers?: readonly ts.ModifierLike[] }) {
    let isPublic = true
    let isStatic = false
    if (node.modifiers)
      for (const m of node.modifiers) {
        switch (m.kind) {
          case ts.SyntaxKind.StaticKeyword:
            isStatic = true
            continue
          case ts.SyntaxKind.PublicKeyword:
            isPublic = true
            continue
          case ts.SyntaxKind.ProtectedKeyword:
            isPublic = false
            continue
          case ts.SyntaxKind.PrivateKeyword:
            isPublic = false
            continue
          case ts.SyntaxKind.AbstractKeyword:
            continue
          case ts.SyntaxKind.AccessorKeyword:
            logger.error(this.sourceLocation(m), 'properties are not supported')
            continue
          case ts.SyntaxKind.AsyncKeyword:
            logger.error(this.sourceLocation(m), 'async keyword is not supported')
            continue
          case ts.SyntaxKind.DeclareKeyword:
            logger.error(this.sourceLocation(m), 'declare keyword is not supported')
            continue
          case ts.SyntaxKind.ExportKeyword:
          case ts.SyntaxKind.ConstKeyword:
          case ts.SyntaxKind.DefaultKeyword:
          case ts.SyntaxKind.ReadonlyKeyword:
          case ts.SyntaxKind.OverrideKeyword:
          case ts.SyntaxKind.InKeyword:
          case ts.SyntaxKind.OutKeyword:
          case ts.SyntaxKind.Decorator:
            // Ignore for now
            continue
        }
      }
    return {
      isStatic,
      isPublic,
    }
  }

  protected getNodeDescription(node: ts.Node): string | null {
    const docs = ts.getJSDocCommentsAndTags(node)
    for (const doc of docs) {
      if (ts.isJSDoc(doc)) {
        return ts.getTextOfJSDocComment(doc.comment) ?? null
      }
    }
    return null
  }

  protected getMethodDocumentation(node: ts.FunctionDeclaration | ts.MethodDeclaration | ts.ConstructorDeclaration): MethodDocumentation {
    const docs = Array.from(ts.getJSDocCommentsAndTags(node))
    let description: string | null = null
    const args = new Map<string, string>()
    let returns: string | null = null
    for (const doc of docs) {
      if (ts.isJSDoc(doc)) {
        description = ts.getTextOfJSDocComment(doc.comment) ?? null
        if (doc.tags) docs.push(...doc.tags)
      } else if (ts.isJSDocParameterTag(doc)) {
        const paramName = this.textVisitor.accept(doc.name)
        const paramComment = ts.getTextOfJSDocComment(doc.comment)

        args.set(paramName, paramComment ?? '')
      } else if (ts.isJSDocReturnTag(doc)) {
        returns = ts.getTextOfJSDocComment(doc.comment) ?? null
      }
    }
    return nodeFactory.methodDocumentation({
      description,
      args,
      returns,
    })
  }
}
