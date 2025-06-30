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
      ptype
        .orderedProperties()
        .map(([p, propPType]) => [p, requireExpressionOfType(valueProvider.memberAccess(p, valueProvider.sourceLocation), propPType)]),
    ),
  })
}

export function createNamedTuple(ptype: ImmutableObjectPType | ObjectLiteralPType, valueProvider: InstanceBuilder) {
  return nodeFactory.tupleExpression({
    sourceLocation: valueProvider.sourceLocation,
    items: ptype
      .orderedProperties()
      .map(([prop, propType]) => requireExpressionOfType(valueProvider.memberAccess(prop, valueProvider.sourceLocation), propType)),
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
