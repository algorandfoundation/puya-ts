import type { PType } from '../../ptypes'
import { assetPType, uint64PType } from '../../ptypes'
import type { InstanceBuilder } from '../index'
import { FunctionBuilder, InstanceExpressionBuilder } from '../index'
import type { SourceLocation } from '../../../awst/source-location'
import { requireExpressionsOfType } from '../util'
import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { InstanceType } from '../../ptypes'

export class AssetFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const [id] = requireExpressionsOfType(args, [uint64PType], sourceLocation)

    return new AssetExpressionBuilder(
      nodeFactory.reinterpretCast({
        expr: id,
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
