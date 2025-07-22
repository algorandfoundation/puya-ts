import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { wtypes } from '../../../awst/wtypes'
import type { PType } from '../../ptypes'
import { accountPType, assetPType, boolPType, bytesPType, uint64PType } from '../../ptypes'
import { instanceEb } from '../../type-registry'
import type { NodeBuilder } from '../index'
import { FunctionBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'
import type { FieldMapping } from './base'
import { Uint64BackedReferenceTypeExpressionBuilder } from './base'

export class AssetFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [assetId],
    } = parseFunctionArgs({
      argSpec: (a) => [a.optional(uint64PType)],
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: 'Asset function',
      callLocation: sourceLocation,
    })

    return new AssetExpressionBuilder(
      nodeFactory.reinterpretCast({
        expr: assetId?.resolve() ?? nodeFactory.uInt64Constant({ value: 0n, sourceLocation }),
        sourceLocation,
        wtype: assetPType.wtypeOrThrow,
      }),
    )
  }
}

class AssetHoldingExpressionBuilder extends FunctionBuilder {
  static fieldMapping = {
    balance: ['AssetBalance', uint64PType],
    frozen: ['AssetFrozen', boolPType],
  } satisfies FieldMapping
  constructor(
    private asset: Expression,
    private holdingField: keyof typeof AssetHoldingExpressionBuilder.fieldMapping,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [holder],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      funcName: this.holdingField,
      argSpec: (a) => [a.required(accountPType)],
    })
    const [immediate, resultType] = AssetHoldingExpressionBuilder.fieldMapping[this.holdingField]
    const op = nodeFactory.intrinsicCall({
      opCode: 'asset_holding_get',
      immediates: [immediate],
      stackArgs: [holder.resolve(), this.asset],
      wtype: new wtypes.WTuple({ types: [resultType.wtypeOrThrow, wtypes.boolWType] }),
      sourceLocation,
    })
    return instanceEb(nodeFactory.checkedMaybe({ expr: op, comment: `account opted into asset` }), resultType)
  }
}
export class AssetExpressionBuilder extends Uint64BackedReferenceTypeExpressionBuilder {
  constructor(expr: Expression) {
    super(expr, {
      ptype: assetPType,
      backingMember: 'id',
      fieldOpCode: 'asset_params_get',
      fieldMapping: {
        total: ['AssetTotal', uint64PType],
        decimals: ['AssetDecimals', uint64PType],
        defaultFrozen: ['AssetDefaultFrozen', boolPType],
        unitName: ['AssetUnitName', bytesPType],
        name: ['AssetName', bytesPType],
        url: ['AssetURL', bytesPType],
        metadataHash: ['AssetMetadataHash', bytesPType],
        manager: ['AssetManager', accountPType],
        reserve: ['AssetReserve', accountPType],
        freeze: ['AssetFreeze', accountPType],
        clawback: ['AssetClawback', accountPType],
        creator: ['AssetCreator', accountPType],
      },
      fieldBoolComment: 'asset exists',
    })
  }
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    if (name in AssetHoldingExpressionBuilder.fieldMapping) {
      return new AssetHoldingExpressionBuilder(
        this.resolve(),
        name as keyof typeof AssetHoldingExpressionBuilder.fieldMapping,
        sourceLocation,
      )
    }
    return super.memberAccess(name, sourceLocation)
  }
}
