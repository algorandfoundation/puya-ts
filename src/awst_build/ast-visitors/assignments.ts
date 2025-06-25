import { nodeFactory } from '../../awst/node-factory'
import type { Expression, LValue, Statement } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { codeInvariant, instanceOfAny, invariant } from '../../util'
import type { AwstBuildContext } from '../context/awst-build-context'
import type { InstanceBuilder } from '../eb'
import { ArrayLiteralExpressionBuilder } from '../eb/literal/array-literal-expression-builder'
import { ObjectLiteralExpressionBuilder } from '../eb/literal/object-literal-expression-builder'
import { OmittedExpressionBuilder } from '../eb/omitted-expression-builder'
import { StaticIterator } from '../eb/traits/static-iterator'
import { requireInstanceBuilder } from '../eb/util'
import type { PType } from '../ptypes'
import {
  ArrayLiteralPType,
  BigIntLiteralPType,
  bigIntPType,
  biguintPType,
  InnerTransactionPType,
  isTupleLike,
  ItxnParamsPType,
  MutableTuplePType,
  numberPType,
  NumericLiteralPType,
  ObjectLiteralPType,
  ReadonlyTuplePType,
  Uint64EnumMemberLiteralType,
  Uint64EnumMemberType,
  uint64PType,
  UnionPType,
} from '../ptypes'
import { getIndexType } from '../ptypes/visitors/index-type-visitor'
import { instanceEb } from '../type-registry'

export function handleAssignmentStatement(
  context: AwstBuildContext,
  target: InstanceBuilder,
  source: InstanceBuilder,
  sourceLocation: SourceLocation,
): Statement {
  return nodeFactory.expressionStatement({ expr: handleAssignment(context, target, source, sourceLocation, true).resolve() })
}

export function handleAssignment(
  context: AwstBuildContext,
  target: InstanceBuilder,
  source: InstanceBuilder,
  sourceLocation: SourceLocation,
  isStatement: boolean,
): InstanceBuilder {
  if (isSpecialItxnType(source)) {
    codeInvariant(isStatement, 'inner transaction results can not be used in assignment expressions')
    return handleItxnAssignment(context, target, source, sourceLocation)
  }
  const narrowedSourceType = narrowSourceType(target.ptype, source.ptype, sourceLocation)
  return buildAssignmentExpression(target, source.resolveToPType(narrowedSourceType), sourceLocation, isStatement)
}

/**
 * Return the 'type' of the entire assignment expression. This is almost always the source type, with the
 * exception of array literals which are influenced by the assignment target.
 * @param target
 * @param source
 */
function getAssignmentExpressionType(target: PType, source: PType): PType {
  if (source instanceof ArrayLiteralPType) {
    if (instanceOfAny(target, ArrayLiteralPType, MutableTuplePType, ReadonlyTuplePType)) {
      return source.getMutableTupleType()
    } else {
      return source.getArrayType()
    }
  }
  if (source instanceof ObjectLiteralPType) {
    return source.getMutable()
  }
  return source
}

function buildAssignmentValues(
  target: InstanceBuilder,
  source: InstanceBuilder,
  sourceLocation: SourceLocation,
): { target: LValue; source: Expression } {
  if (target instanceof ArrayLiteralExpressionBuilder) {
    // Destructured array
    const targets: LValue[] = []
    const sources: Expression[] = []

    for (const [index, item] of target[StaticIterator]().entries()) {
      if (item instanceof OmittedExpressionBuilder) continue
      const values = buildAssignmentValues(item, requireInstanceBuilder(source.indexAccess(BigInt(index), sourceLocation)), sourceLocation)
      targets.push(values.target)
      sources.push(values.source)
    }

    return {
      target: nodeFactory.tupleExpression({ items: targets, sourceLocation: target.sourceLocation }),
      source: nodeFactory.tupleExpression({ items: sources, sourceLocation: source.sourceLocation }),
    }
  } else if (target instanceof ObjectLiteralExpressionBuilder) {
    // // Destructured object
    const targets: LValue[] = []
    const sources: Expression[] = []
    for (const [propName] of target.ptype.orderedProperties()) {
      const values = buildAssignmentValues(
        requireInstanceBuilder(target.memberAccess(propName, sourceLocation)),
        requireInstanceBuilder(source.memberAccess(propName, sourceLocation)),
        sourceLocation,
      )
      targets.push(values.target)
      sources.push(values.source)
    }
    return {
      target: nodeFactory.tupleExpression({ items: targets, sourceLocation: target.sourceLocation }),
      source: nodeFactory.tupleExpression({ items: sources, sourceLocation: source.sourceLocation }),
    }
  } else {
    return {
      target: target.resolveLValue(),
      source: source.resolveToPType(target.ptype).resolve(),
    }
  }
}

function buildAssignmentExpression(
  target: InstanceBuilder,
  source: InstanceBuilder,
  sourceLocation: SourceLocation,
  isStatement: boolean,
): InstanceBuilder {
  const expressionType = getAssignmentExpressionType(target.ptype, source.ptype)
  //  Skip single eval for non-destructuring assignments
  const sourceSingle = isDestructuringAssignment(target) ? source.singleEvaluation() : source
  const assignmentValues = buildAssignmentValues(target, sourceSingle, sourceLocation)
  const assignment = nodeFactory.assignmentExpression({
    target: assignmentValues.target,
    value: assignmentValues.source,
    sourceLocation,
  })

  if (target.ptype.equals(expressionType) || isStatement) {
    return instanceEb(assignment, expressionType)
  } else {
    return instanceEb(
      nodeFactory.commaExpression({
        expressions: [assignment, sourceSingle.resolveToPType(expressionType).resolve()],
        sourceLocation,
      }),
      expressionType,
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
 * @param targetType The type of the assignment target
 * @param sourceType The type of the assignment source
 * @param sourceLocation
 * @private
 */
function narrowSourceType(targetType: PType | undefined, sourceType: PType, sourceLocation: SourceLocation): PType {
  if (!targetType) return sourceType
  if (sourceType.equals(targetType) && !instanceOfAny(targetType, ArrayLiteralPType, ObjectLiteralPType)) {
    return targetType
  }
  if (
    sourceType instanceof NumericLiteralPType ||
    sourceType.equals(numberPType) ||
    (sourceType instanceof UnionPType &&
      sourceType.types.every((t) => t.equals(uint64PType) || t instanceof NumericLiteralPType || t.equals(numberPType)))
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
  if (
    targetType instanceof Uint64EnumMemberLiteralType &&
    sourceType instanceof Uint64EnumMemberType &&
    sourceType.enumType.equals(targetType.enumType)
  ) {
    return targetType
  }

  if (sourceType instanceof ArrayLiteralPType) {
    return new ArrayLiteralPType({
      items: sourceType.items.map((itemType, itemIndex) =>
        narrowSourceType(getIndexType(targetType, BigInt(itemIndex), sourceLocation), itemType, sourceLocation),
      ),
    })
  }
  if (sourceType instanceof ObjectLiteralPType) {
    return new ObjectLiteralPType({
      properties: Object.fromEntries(
        sourceType
          .orderedProperties()
          .map(([prop, propType]): [string, PType] => [
            prop,
            narrowSourceType(getIndexType(targetType, prop, sourceLocation), propType, sourceLocation),
          ]),
      ),
    })
  }
  return sourceType
}

function isDestructuringAssignment(target: InstanceBuilder) {
  return target instanceof ArrayLiteralExpressionBuilder || target instanceof ObjectLiteralExpressionBuilder
}

function isSpecialItxnType(source: InstanceBuilder) {
  const checkType = (t: PType) => instanceOfAny(t, InnerTransactionPType, ItxnParamsPType)

  return checkType(source.ptype) || (isTupleLike(source.ptype) && source.ptype.items.some(checkType))
}

function handleItxnAssignment(
  context: AwstBuildContext,
  target: InstanceBuilder,
  source: InstanceBuilder,
  sourceLocation: SourceLocation,
): InstanceBuilder {
  let targetExpression: LValue
  if (target instanceof ArrayLiteralExpressionBuilder) {
    // Destructured array
    const targets: LValue[] = []

    for (const [index, item] of target[StaticIterator]().entries()) {
      if (item instanceof OmittedExpressionBuilder) {
        const sourceType = getIndexType(source.ptype, BigInt(index), item.sourceLocation)
        invariant(sourceType, 'RHS must have a type', item.sourceLocation)
        targets.push(
          nodeFactory.varExpression({
            name: context.generateVarName('discard'),
            wtype: sourceType.wtypeOrThrow,
            sourceLocation: target.sourceLocation,
            // TODO: This should be item.sourceLocation but it actually represents a zero length sequence which fails puya validation
            //sourceLocation: item.sourceLocation,
          }),
        )
      } else {
        targets.push(item.resolveLValue())
      }
    }
    targetExpression = nodeFactory.tupleExpression({ items: targets, sourceLocation: target.sourceLocation })
  } else {
    targetExpression = target.resolveLValue()
  }

  return instanceEb(
    nodeFactory.assignmentExpression({
      target: targetExpression,
      value: source.resolve(),
      sourceLocation,
    }),
    source.ptype,
  )
}
