import type { PType } from '../../ptypes'
import { assetPType, uint64PType } from '../../ptypes'
import type { InstanceBuilder } from '../index'
import { FunctionBuilder, InstanceExpressionBuilder } from '../index'
import type { SourceLocation } from '../../../awst/source-location'
import { requireExpressionsOfType } from '../util'
import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { InstanceType } from '../../ptypes'
import { parseFunctionArgs } from '../util/arg-parsing'

export class AssetFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const {
      args: [assetId],
    } = parseFunctionArgs({
      argMap: [[uint64PType, undefined]],
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: 'Asset function',
      callLocation: sourceLocation,
    })

    return new AssetExpressionBuilder(
      nodeFactory.reinterpretCast({
        expr: assetId ?? nodeFactory.uInt64Constant({ value: 0n, sourceLocation }),
        sourceLocation,
        wtype: assetPType.wtypeOrThrow,
      }),
    )
  }
}

export class AssetExpressionBuilder extends InstanceExpressionBuilder<InstanceType> {
  constructor(expr: Expression) {
    super(expr, assetPType)
  }
}
