import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { boolWType, bytesWType, uint64WType, WTuple } from '../../../awst/wtypes'
import type { PType } from '../../ptypes'
import { accountPType, applicationPType, assetPType, bytesPType, uint64PType } from '../../ptypes'
import { BooleanExpressionBuilder } from '../boolean-expression-builder'
import type { BuilderComparisonOp, InstanceBuilder, NodeBuilder } from '../index'
import { FunctionBuilder } from '../index'
import { requireExpressionOfType } from '../util'
import { parseFunctionArgs } from '../util/arg-parsing'
import { compareBytes } from '../util/compare-bytes'
import { ReferenceTypeExpressionBuilder } from './base'

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
      )
    }
  }
}
export class AccountExpressionBuilder extends ReferenceTypeExpressionBuilder {
  constructor(expr: Expression) {
    super(expr, {
      backingType: bytesPType,
      backingMember: 'bytes',
      fieldMapping: {
        balance: ['AcctBalance', uint64PType],
        minBalance: ['AcctMinBalance', uint64PType],
        authAddress: ['AcctAuthAddr', accountPType],
        totalNumUint: ['AcctTotalNumUint', uint64PType],
        totalNumByteSlice: ['AcctTotalNumByteSlice', uint64PType],
        totalExtraAppPages: ['AcctTotalExtraAppPages', uint64PType],
        totalAppsCreated: ['AcctTotalAppsCreated', uint64PType],
        totalAppsOptedIn: ['AcctTotalAppsOptedIn', uint64PType],
        totalAssetsCreated: ['AcctTotalAssetsCreated', uint64PType],
        totalAssets: ['AcctTotalAssets', uint64PType],
        totalBoxes: ['AcctTotalBoxes', uint64PType],
        totalBoxBytes: ['AcctTotalBoxBytes', uint64PType],
      },
      fieldOpCode: 'acct_params_get',
      ptype: accountPType,
      fieldBoolComment: 'account funded',
    })
  }

  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    return compareBytes(this._expr, requireExpressionOfType(other, accountPType), op, sourceLocation, this.typeDescription)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'isOptedIn':
        return new IsOptedInFunctionBuilder(this._expr, sourceLocation)
    }
    return super.memberAccess(name, sourceLocation)
  }

  toBytes(sourceLocation: SourceLocation): Expression {
    return nodeFactory.reinterpretCast({
      expr: this._expr,
      wtype: bytesWType,
      sourceLocation,
    })
  }
}

class IsOptedInFunctionBuilder extends FunctionBuilder {
  constructor(
    private expr: Expression,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [applicationOrAsset],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: 'isOptedIn',
      argSpec: (a) => [a.required(applicationPType, assetPType)],
    })

    if (applicationOrAsset.ptype.equals(assetPType)) {
      return new BooleanExpressionBuilder(
        nodeFactory.tupleItemExpression({
          base: nodeFactory.intrinsicCall({
            opCode: 'asset_holding_get',
            immediates: ['AssetBalance'],
            stackArgs: [this.expr, applicationOrAsset.resolve()],
            wtype: new WTuple({ types: [uint64WType, boolWType], immutable: true }),
            sourceLocation,
          }),
          index: 1n,
          sourceLocation,
        }),
      )
    } else {
      return new BooleanExpressionBuilder(
        nodeFactory.intrinsicCall({
          opCode: 'app_opted_in',
          stackArgs: [this.expr, applicationOrAsset.resolve()],
          sourceLocation,
          wtype: boolWType,
          immediates: [],
        }),
      )
    }
  }
}
