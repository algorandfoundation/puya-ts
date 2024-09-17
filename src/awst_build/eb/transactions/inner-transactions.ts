import type { InstanceBuilder, NodeBuilder } from '../index'
import { InstanceExpressionBuilder } from '../index'
import { FunctionBuilder } from '../index'
import type { SourceLocation } from '../../../awst/source-location'
import type { PType } from '../../ptypes'
import { InnerTransactionPType } from '../../ptypes'
import { TransactionFunctionType } from '../../ptypes'
import { invariant } from '../../../util'
import type { Expression } from '../../../awst/nodes'

export class InnerTransactionFactoryFunctionBuilder extends FunctionBuilder {
  readonly ptype: TransactionFunctionType

  constructor(sourceLocation: SourceLocation, ptype: PType) {
    super(sourceLocation)
    invariant(ptype instanceof TransactionFunctionType, 'ptype must be TransactionFunctionType')
    this.ptype = ptype
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    throw new Error('')
  }
}

export class InnerTransactionExpressionBuilder extends InstanceExpressionBuilder<InnerTransactionPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof InnerTransactionPType, 'ptype must be InnerTransactionPType')
    super(expr, ptype)
  }
}
