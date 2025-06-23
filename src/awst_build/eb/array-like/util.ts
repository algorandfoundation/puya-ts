import { nodeFactory } from '../../../awst/node-factory'
import { invariant } from '../../../util'
import type { ArrayLiteralPType, ArrayPType, ReadonlyArrayPType, ReadonlyTuplePType } from '../../ptypes'
import { isArrayType, MutableTuplePType } from '../../ptypes'
import type { InstanceBuilder } from '../index'
import { isStaticallyIterable, StaticIterator } from '../traits/static-iterator'
import { requireExpressionOfType } from '../util'

export function newArray(ptype: ArrayPType | ReadonlyArrayPType, valueProvider: InstanceBuilder) {
  invariant(isStaticallyIterable(valueProvider), 'Array value provider must be statically iterable')
  return nodeFactory.newArray({
    values: valueProvider[StaticIterator]().map((v) => v.resolveToPType(ptype.elementType).resolve()),
    wtype: ptype.wtype,
    sourceLocation: valueProvider.sourceLocation,
  })
}

export function newTuple(ptype: MutableTuplePType | ReadonlyTuplePType | ArrayLiteralPType, valueProvider: InstanceBuilder) {
  invariant(isStaticallyIterable(valueProvider), 'Tuple value provider must be statically iterable')

  const tupleExpr = nodeFactory.tupleExpression({
    items: ptype.items.map((itemType, index) =>
      requireExpressionOfType(valueProvider.indexAccess(BigInt(index), valueProvider.sourceLocation), itemType),
    ),
    sourceLocation: valueProvider.sourceLocation,
  })

  if (ptype instanceof MutableTuplePType) {
    return nodeFactory.aRC4Encode({ value: tupleExpr, wtype: ptype.wtype, sourceLocation: valueProvider.sourceLocation })
  } else {
    return tupleExpr
  }
}

export function newArrayOrTuple(
  ptype: ArrayPType | ReadonlyArrayPType | MutableTuplePType | ReadonlyTuplePType | ArrayLiteralPType,
  valueProvider: InstanceBuilder,
) {
  if (isArrayType(ptype)) {
    return newArray(ptype, valueProvider)
  } else {
    return newTuple(ptype, valueProvider)
  }
}
