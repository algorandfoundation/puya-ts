import { nodeFactory } from '../../awst/node-factory'
import type { Expression, LValue, Statement } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError } from '../../errors'
import { codeInvariant, instanceOfAny, sortBy } from '../../util'
import type { AwstBuildContext } from '../context/awst-build-context'
import type { InstanceBuilder } from '../eb'
import { ArrayLiteralExpressionBuilder } from '../eb/literal/array-literal-expression-builder'
import { ObjectLiteralExpressionBuilder } from '../eb/literal/object-literal-expression-builder'
import { OmittedExpressionBuilder } from '../eb/omitted-expression-builder'
import { StaticIterator } from '../eb/traits/static-iterator'
import { requireBuilderOfType, requireInstanceBuilder } from '../eb/util'
import type { PType } from '../ptypes'
import {
  ArrayLiteralPType,
  ArrayPType,
  BigIntLiteralPType,
  bigIntPType,
  biguintPType,
  ImmutableObjectPType,
  MutableObjectPType,
  MutableTuplePType,
  numberPType,
  NumericLiteralPType,
  ObjectLiteralPType,
  ReadonlyArrayPType,
  ReadonlyTuplePType,
  uint64PType,
  UnionPType,
} from '../ptypes'
import { ARC4StructType } from '../ptypes/arc4-types'
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

function buildAssignmentExpression(
  context: AwstBuildContext,
  target: InstanceBuilder,
  source: InstanceBuilder,
  sourceLocation: SourceLocation,
): InstanceBuilder {
  if (target instanceof ArrayLiteralExpressionBuilder && !(source.ptype instanceof ReadonlyTuplePType)) {
    // Destructured array
    const sourceSingle = source.singleEvaluation()
    const assignments: Expression[] = []
    for (const [index, item] of target[StaticIterator]().entries()) {
      if (item instanceof OmittedExpressionBuilder) continue
      const itemType = getIndexType(source.ptype, BigInt(index), sourceLocation)
      codeInvariant(itemType, `Cannot resolve type of item at index ${index}`, sourceLocation)
      assignments.push(
        buildAssignmentExpression(
          context,
          item,
          requireBuilderOfType(
            sourceSingle.indexAccess(
              instanceEb(nodeFactory.uInt64Constant({ value: BigInt(index), sourceLocation }), uint64PType),
              sourceLocation,
            ),
            itemType,
          ),
          sourceLocation,
        ).resolve(),
      )
    }
    return instanceEb(
      nodeFactory.commaExpression({
        expressions: [...assignments, sourceSingle.resolve()],
        sourceLocation,
      }),
      source.ptype,
    )
  } else if (target instanceof ObjectLiteralExpressionBuilder && isObjectWhichCantBeDestructuredAsTuple(source.ptype)) {
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
        expressions: [...assignments, sourceSingle.resolve()],
        sourceLocation,
      }),
      source.ptype,
    )
  } else if (target.ptype.equals(source.ptype)) {
    return instanceEb(
      nodeFactory.assignmentExpression({
        target: buildLValue(context, target, source.ptype, sourceLocation),
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
            target: buildLValue(context, target, source.ptype, sourceLocation),
            sourceLocation,
            value: sourceSingle.resolve(),
          }),
          sourceSingle.resolve(),
        ],
        sourceLocation,
      }),
      sourceSingle.ptype,
    )
  }
}

function buildLValue(context: AwstBuildContext, target: InstanceBuilder, assignmentType: PType, sourceLocation: SourceLocation): LValue {
  if (target instanceof ArrayLiteralExpressionBuilder) {
    if (assignmentType instanceof ReadonlyTuplePType || assignmentType instanceof MutableTuplePType) {
      const targetItems = target[StaticIterator]()

      const targets: LValue[] = []
      for (const [index, sourceItemType] of assignmentType.items.entries()) {
        const targetItem = targetItems[index]
        if (targetItem && !(targetItem instanceof OmittedExpressionBuilder)) {
          targets.push(buildLValue(context, targetItem, sourceItemType, sourceLocation))
        } else {
          targets.push(
            nodeFactory.varExpression({
              name: context.generateVarName('discard'),
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
    if (assignmentType instanceof ImmutableObjectPType) {
      const targets: LValue[] = []
      for (const [propName, propType] of assignmentType.orderedProperties()) {
        if (target.hasProperty(propName)) {
          targets.push(
            buildLValue(context, requireInstanceBuilder(target.memberAccess(propName, sourceLocation)), propType, sourceLocation),
          )
        } else {
          targets.push(
            nodeFactory.varExpression({
              name: context.generateVarName('discard'),
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

function isObjectWhichCantBeDestructuredAsTuple(ptype: PType): boolean {
  if (instanceOfAny(ptype, ARC4StructType, MutableObjectPType)) {
    return true
  }
  if (ptype instanceof ImmutableObjectPType)
    return ptype.orderedProperties().some(([_, propType]) => isObjectWhichCantBeDestructuredAsTuple(propType))
  return false
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
  if (sourceType.equals(targetType) && !instanceOfAny(targetType, ArrayLiteralPType)) {
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
    if (instanceOfAny(targetType, ArrayPType, ReadonlyArrayPType)) {
      return targetType
    }
    if (targetType instanceof ReadonlyTuplePType) {
      return new ReadonlyTuplePType({
        items: sourceType.items.map((item, index) => narrowSourceType(targetType.items[index] ?? item, item, sourceLocation)),
      })
    }
    if (targetType instanceof MutableTuplePType) {
      return new MutableTuplePType({
        items: sourceType.items.map((item, index) => narrowSourceType(targetType.items[index] ?? item, item, sourceLocation)),
      })
    }
    return new MutableTuplePType({
      items: sourceType.items.map((itemType, itemIndex) =>
        narrowSourceType(getIndexType(targetType, BigInt(itemIndex), sourceLocation), itemType, sourceLocation),
      ),
    })
  }
  if (sourceType instanceof ObjectLiteralPType) {
    // Recursively narrow object properties
    codeInvariant(
      instanceOfAny(targetType, MutableObjectPType, ImmutableObjectPType, ObjectLiteralPType),
      'Object literal assignment target should be another object type',
      sourceLocation,
    )
    const targetProps = Object.keys(targetType.properties)

    const properties = Object.fromEntries(
      sourceType
        .orderedProperties()
        .map(([prop, propType]): [string, PType] => [
          prop,
          narrowSourceType(getIndexType(targetType, prop, sourceLocation), propType, sourceLocation),
        ])
        .toSorted(
          sortBy(([prop]) => {
            // Order properties to match target type with 'extra' properties at the end
            const order = targetProps.indexOf(prop)
            return order === -1 ? Number.MAX_SAFE_INTEGER : order
          }),
        ),
    )
    if (targetType instanceof MutableObjectPType) {
      return new MutableObjectPType({ properties, alias: targetType.alias })
    }
    if (targetType instanceof ImmutableObjectPType) {
      return new ImmutableObjectPType({ properties, alias: targetType.alias })
    }
    return new MutableObjectPType({
      properties,
    })
  }
  return sourceType
}
