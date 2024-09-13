import type { SourceLocation } from '../../../awst/source-location'
import type { PType } from '../../ptypes'
import { accountPType } from '../../ptypes'
import { bytesPType } from '../../ptypes'
import type { BuilderComparisonOp, InstanceBuilder, NodeBuilder } from '../index'
import { InstanceExpressionBuilder } from '../index'
import { FunctionBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'
import { nodeFactory } from '../../../awst/node-factory'
import { compareBytes } from '../util/compare-bytes'
import { requireExpressionOfType } from '../util'
import { BytesExpressionBuilder } from '../bytes-expression-builder'
import { bytesWType } from '../../../awst/wtypes'

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
      argSpec: (a) => [a.optional(bytesPType)],
    })

    if (addressBytes) {
      return new AccountExpressionBuilder(
        nodeFactory.reinterpretCast({
          expr: addressBytes.resolve(),
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
  }
}
export class AccountExpressionBuilder extends InstanceExpressionBuilder<PType> {
  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    return compareBytes(this._expr, requireExpressionOfType(other, accountPType), op, sourceLocation, this.typeDescription)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'bytes':
        return new BytesExpressionBuilder(
          nodeFactory.reinterpretCast({
            expr: this._expr,
            wtype: bytesWType,
            sourceLocation,
          }),
        )
    }
    return super.memberAccess(name, sourceLocation)
  }
}
