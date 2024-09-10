import { InstanceExpressionBuilder } from '../index'
import type { PType } from '../../ptypes'
import { GroupTransactionPType } from '../../ptypes'
import type { Expression } from '../../../awst/nodes'
import { invariant } from '../../../util'

export class GroupTransactionExpressionBuilder extends InstanceExpressionBuilder<GroupTransactionPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof GroupTransactionPType, 'ptype must be GroupTransactionPType')
    super(expr, ptype)
  }
}
