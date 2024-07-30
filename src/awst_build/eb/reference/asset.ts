import { assetPType, PType, uint64PType } from '../../ptypes'
import { FunctionBuilder, InstanceBuilder, InstanceExpressionBuilder } from '../index'
import { SourceLocation } from '../../../awst/source-location'
import { requireExpressionsOfType } from '../util'
import { nodeFactory } from '../../../awst/node-factory'
import { Expression } from '../../../awst/nodes'

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

export class AssetExpressionBuilder extends InstanceExpressionBuilder {
  constructor(expr: Expression) {
    super(expr)
  }

  get ptype(): PType {
    return assetPType
  }
}
