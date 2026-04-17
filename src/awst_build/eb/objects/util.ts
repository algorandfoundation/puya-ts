import { nodeFactory } from '../../../awst/node-factory'
import type { NewStruct, TupleExpression } from '../../../awst/nodes'
import type { ImmutableObjectPType, ObjectLiteralPType } from '../../ptypes'
import { MutableObjectPType } from '../../ptypes'
import type { InstanceBuilder } from '../index'
import { requireExpressionOfType } from '../util'

export function createStruct(ptype: MutableObjectPType, valueProvider: InstanceBuilder) {
  return nodeFactory.newStruct({
    wtype: ptype.wtype,
    sourceLocation: valueProvider.sourceLocation,
    values: new Map(
      ptype.properties.map(({ name, ptype }) => [
        name,
        requireExpressionOfType(valueProvider.memberAccess(name, valueProvider.sourceLocation), ptype),
      ]),
    ),
  })
}

export function createNamedTuple(ptype: ImmutableObjectPType | ObjectLiteralPType, valueProvider: InstanceBuilder) {
  return nodeFactory.tupleExpression({
    sourceLocation: valueProvider.sourceLocation,
    items: ptype.properties.map(({ name, ptype }) =>
      requireExpressionOfType(valueProvider.memberAccess(name, valueProvider.sourceLocation), ptype),
    ),
    wtype: ptype.wtype,
  })
}

export function createObject(
  ptype: ImmutableObjectPType | ObjectLiteralPType | MutableObjectPType,
  valueProvider: InstanceBuilder,
): TupleExpression | NewStruct {
  if (ptype instanceof MutableObjectPType) {
    return createStruct(ptype, valueProvider)
  } else {
    return createNamedTuple(ptype, valueProvider)
  }
}
