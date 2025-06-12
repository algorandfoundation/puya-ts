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
  MutableTuplePType,
  numberPType,
  NumericLiteralPType,
  ObjectPType,
  ReadonlyArrayPType,
  ReadonlyTuplePType,
  uint64PType,
  UnionPType,
} from '../ptypes'
import { ARC4StructType } from '../ptypes/arc4-types'
import { MutableObjectType } from '../ptypes/mutable-object'
import { getIndexType, getPropertyType } from '../ptypes/visitors/index-type-visitor'
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
  const assignmentType = buildAssignmentExpressionType(target.ptype, source.ptype, sourceLocation)

  return buildAssignmentExpression(context, target, source.resolveToPType(assignmentType), assignmentType, sourceLocation)
}

function buildAssignmentExpression(
  context: AwstBuildContext,
  target: InstanceBuilder,
  source: InstanceBuilder,
  assignmentType: PType,
  sourceLocation: SourceLocation,
): InstanceBuilder {
  if (target instanceof ArrayLiteralExpressionBuilder && !(assignmentType instanceof ReadonlyTuplePType)) {
    // Destructured array
    const sourceSingle = source.singleEvaluation()
    const assignments: Expression[] = []
    for (const [index, item] of target[StaticIterator]().entries()) {
      if (item instanceof OmittedExpressionBuilder) continue
      const itemType = getIndexType(assignmentType, BigInt(index), sourceLocation)
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
          itemType,
          sourceLocation,
        ).resolve(),
      )
    }
    return instanceEb(
      nodeFactory.commaExpression({
        expressions: [...assignments, sourceSingle.resolve()],
        sourceLocation,
        wtype: assignmentType.wtypeOrThrow,
      }),
      assignmentType,
    )
  } else if (target instanceof ObjectLiteralExpressionBuilder && isObjectWhichCantBeDestructuredAsTuple(assignmentType)) {
    // Destructured object
    const sourceSingle = source.singleEvaluation()
    const assignments: Expression[] = []

    for (const [propName] of target.ptype.orderedProperties()) {
      const sourceProperty = requireInstanceBuilder(sourceSingle.memberAccess(propName, sourceLocation))
      const propertyAssignmentType = getIndexType(assignmentType, propName, sourceLocation)
      codeInvariant(propertyAssignmentType, `${propName} does not exist on ${assignmentType}`, sourceLocation)
      assignments.push(
        buildAssignmentExpression(
          context,
          requireInstanceBuilder(target.memberAccess(propName, sourceLocation)),
          requireBuilderOfType(sourceProperty, propertyAssignmentType),
          propertyAssignmentType,
          sourceLocation,
        ).resolve(),
      )
    }
    return instanceEb(
      nodeFactory.commaExpression({
        expressions: [...assignments, sourceSingle.resolve()],
        sourceLocation,
        wtype: assignmentType.wtypeOrThrow,
      }),
      assignmentType,
    )
  }
  return instanceEb(
    nodeFactory.assignmentExpression({
      target: buildLValue(context, target, assignmentType, sourceLocation),
      sourceLocation,
      value: source.resolve(),
    }),
    assignmentType,
  )
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
    if (assignmentType instanceof ObjectPType) {
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
  if (instanceOfAny(ptype, ARC4StructType, MutableObjectType)) {
    return true
  }
  if (ptype instanceof ObjectPType)
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
function buildAssignmentExpressionType(targetType: PType, sourceType: PType, sourceLocation: SourceLocation): PType {
  if (sourceType.equals(targetType) && !(sourceType instanceof ArrayLiteralPType)) {
    return targetType
  }
  const errorMessage = `Value of type ${sourceType.name} cannot be assigned to target of type ${targetType.name}`

  if (sourceType instanceof ArrayLiteralPType) {
    if (instanceOfAny(targetType, ArrayPType, ReadonlyArrayPType)) {
      return targetType
    }
    if (targetType instanceof ReadonlyTuplePType) {
      return new ReadonlyTuplePType({
        items: sourceType.items.map((item, index) => buildAssignmentExpressionType(targetType.items[index] ?? item, item, sourceLocation)),
      })
    }
    if (targetType instanceof MutableTuplePType) {
      return new MutableTuplePType({
        items: sourceType.items.map((item, index) => buildAssignmentExpressionType(targetType.items[index] ?? item, item, sourceLocation)),
      })
    }
    if (targetType instanceof ArrayLiteralPType) {
      return new MutableTuplePType({
        items: sourceType.items.map((item, index) => buildAssignmentExpressionType(targetType.items[index] ?? item, item, sourceLocation)),
      })
    }
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

  if (sourceType instanceof ObjectPType) {
    // Recursively narrow object properties
    codeInvariant(targetType instanceof ObjectPType, errorMessage)
    const targetPropertyOrder = targetType
      .orderedProperties()
      .reduce((acc, [prop], index) => acc.set(prop, index), new Map<string, number>())
    return new ObjectPType({
      alias: targetType.alias,
      description: targetType.description,
      properties: Object.fromEntries(
        sourceType
          .orderedProperties()
          .map(([prop, propType]): [string, PType] => [
            prop,
            prop in targetType.properties
              ? buildAssignmentExpressionType(getPropertyType(targetType, prop, sourceLocation), propType, sourceLocation)
              : propType,
          ])
          .toSorted(sortBy(([prop]) => targetPropertyOrder.get(prop) ?? Number.MAX_SAFE_INTEGER)),
      ),
    })
  }
  if (sourceType instanceof ArrayPType && targetType instanceof ReadonlyArrayPType) {
    return new ReadonlyArrayPType({
      elementType: buildAssignmentExpressionType(targetType.elementType, sourceType.elementType, sourceLocation),
    })
  }
  return sourceType
}
