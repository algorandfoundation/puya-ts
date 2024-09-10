import type { SourceLocation } from '../../../awst/source-location'
import type { PType } from '../../ptypes'
import { accountPType } from '../../ptypes'
import { bytesPType } from '../../ptypes'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { InstanceExpressionBuilder } from '../index'
import { FunctionBuilder } from '../index'
import { CodeError } from '../../../errors'
import { parseFunctionArgs } from '../util/arg-parsing'
import { nodeFactory } from '../../../awst/node-factory'

export class AccountFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [addressBytes],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      funcName: 'Account function',
      genericTypeArgs: 0,
      argMap: [[bytesPType, undefined]],
    })

    if (addressBytes) {
      return new AccountExpressionBuilder(
        nodeFactory.reinterpretCast({
          expr: addressBytes,
          wtype: accountPType.wtype,
          sourceLocation,
        }),
        accountPType,
      )
    } else {
      return new AccountExpressionBuilder(
        nodeFactory.intrinsicCall({
          opCode: 'global',
          immediates: ['ZeroAddress'],
          stackArgs: [],
          sourceLocation,
          wtype: accountPType.wtype,
        }),
        accountPType,
      )
    }
    throw new CodeError('Method not implemented.')
  }
}
export class AccountExpressionBuilder extends InstanceExpressionBuilder<PType> {}
