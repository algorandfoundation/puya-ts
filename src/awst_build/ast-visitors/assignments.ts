import { nodeFactory } from '../../awst/node-factory'
import type { Expression, LValue, Statement } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { codeInvariant, instanceOfAny } from '../../util'
import type { AwstBuildContext } from '../context/awst-build-context'
import type { InstanceBuilder } from '../eb'
import { ArrayLiteralExpressionBuilder } from '../eb/literal/array-literal-expression-builder'
import { ObjectLiteralExpressionBuilder } from '../eb/literal/object-literal-expression-builder'
import { OmittedExpressionBuilder } from '../eb/omitted-expression-builder'
import { StaticIterator } from '../eb/traits/static-iterator'
import { requireBuilderOfType, requireExpressionOfType, requireInstanceBuilder } from '../eb/util'
import type { PType } from '../ptypes'
import {
  ArrayLiteralPType,
  BigIntLiteralPType,
  bigIntPType,
  biguintPType,
  numberPType,
  NumericLiteralPType,
  ObjectLiteralPType,
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
  return nodeFactory.expressionStatement({ expr: handleAssignment(context, target, source, sourceLocation).resolve() })
}

export function handleAssignment(
  context: AwstBuildContext,
  target: InstanceBuilder,
  source: InstanceBuilder,
  sourceLocation: SourceLocation,
): InstanceBuilder {
  const narrowedSourceType = narrowSourceType(target.ptype, source.ptype, sourceLocation)

  return buildAssignmentExpression(context, target, source.resolveToPType(narrowedSourceType), sourceLocation)
}

function getAssignmentExpressionType(target: PType, source: PType): PType {
  if (source instanceof ArrayLiteralPType) {
    if (target instanceof ArrayLiteralPType) {
      return source.getMutableTupleType()
    } else {
      return source.getArrayType()
    }
  }
  return source
}

function buildAssignmentExpression(
  context: AwstBuildContext,
  target: InstanceBuilder,
  source: InstanceBuilder,
  sourceLocation: SourceLocation,
): InstanceBuilder {
  const expressionType = getAssignmentExpressionType(target.ptype, source.ptype)

  if (target instanceof ArrayLiteralExpressionBuilder) {
    // Destructured array
    const sourceSingle = source.singleEvaluation()
    const targets: LValue[] = []
    const sources: Expression[] = []

    for (const [index, item] of target[StaticIterator]().entries()) {
      if (item instanceof OmittedExpressionBuilder) continue
      const itemType = getIndexType(source.ptype, BigInt(index), sourceLocation)
      codeInvariant(itemType, `Cannot resolve type of item at index ${index}`, sourceLocation)

      targets.push(item.resolveLValue())
      sources.push(
        requireExpressionOfType(
          sourceSingle.indexAccess(
            instanceEb(nodeFactory.uInt64Constant({ value: BigInt(index), sourceLocation }), uint64PType),
            sourceLocation,
          ),
          itemType,
        ),
      )
    }

    const assignment = nodeFactory.assignmentExpression({
      target: nodeFactory.tupleExpression({ items: targets, sourceLocation: target.sourceLocation }),
      value: nodeFactory.tupleExpression({ items: sources, sourceLocation: source.sourceLocation }),
      sourceLocation,
    })
    return instanceEb(
      nodeFactory.commaExpression({
        expressions: [assignment, sourceSingle.resolveToPType(expressionType).resolve()],
        sourceLocation,
      }),
      expressionType,
    )
  } else if (target instanceof ObjectLiteralExpressionBuilder) {
    // Destructured object
    const sourceSingle = source.singleEvaluation()
    const assignments: Expression[] = []

    for (const [propName] of target.ptype.orderedProperties()) {
      const sourceProperty = requireInstanceBuilder(sourceSingle.memberAccess(propName, sourceLocation))
      const propertyAssignmentType = getIndexType(source.ptype, propName, sourceLocation)
      codeInvariant(propertyAssignmentType, `${propName} does not exist on ${source.ptype}`, sourceLocation)
      assignments.push(
        buildAssignmentExpression(
          context,
          requireInstanceBuilder(target.memberAccess(propName, sourceLocation)),
          requireBuilderOfType(sourceProperty, propertyAssignmentType),
          sourceLocation,
        ).resolve(),
      )
    }
    return instanceEb(
      nodeFactory.commaExpression({
        expressions: [...assignments, sourceSingle.resolveToPType(expressionType).resolve()],
        sourceLocation,
      }),
      expressionType,
    )
  } else if (target.ptype.equals(source.ptype)) {
    return instanceEb(
      nodeFactory.assignmentExpression({
        target: target.resolveLValue(),
        sourceLocation,
        value: source.resolve(),
      }),
      source.ptype,
    )
  } else {
    const sourceSingle = source.singleEvaluation()

    return instanceEb(
      nodeFactory.commaExpression({
        expressions: [
          nodeFactory.assignmentExpression({
            target: target.resolveLValue(),
            sourceLocation,
            value: sourceSingle.resolveToPType(target.ptype).resolve(),
          }),
          sourceSingle.resolveToPType(expressionType).resolve(),
        ],
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
