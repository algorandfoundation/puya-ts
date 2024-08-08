import type { SourceLocation } from '../../../awst/source-location'
import type { PType } from '../../ptypes'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { InstanceExpressionBuilder } from '../index'
import { FunctionBuilder } from '../index'

export class AccountFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    throw new Error('Method not implemented.')
  }
}
export class AccountExpressionBuilder extends InstanceExpressionBuilder<PType> {}
