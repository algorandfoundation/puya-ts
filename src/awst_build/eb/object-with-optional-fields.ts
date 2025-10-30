import type { Expression } from '../../awst/nodes'
import { invariant } from '../../util'
import { ObjectWithOptionalFieldsType, type PType } from '../ptypes'
import { InstanceExpressionBuilder } from './index'

export class ObjectWithOptionalFieldsExpressionBuilder extends InstanceExpressionBuilder<ObjectWithOptionalFieldsType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(
      ptype instanceof ObjectWithOptionalFieldsType,
      `ObjectWithOptionalFieldsExpressionBuilder must be instantiated with ptype of ObjectWithOptionalFieldsType`,
    )
    super(expr, ptype)
  }
}
