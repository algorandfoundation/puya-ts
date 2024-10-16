import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import type { WType } from '../../../awst/wtypes'
import type { PType } from '../../ptypes'
import { numberPType, uint64PType } from '../../ptypes'
import { instanceEb } from '../../type-registry'
import type { NodeBuilder } from '../index'
import { FunctionBuilder, type InstanceBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'
import { getBigIntOrUint64Expr } from '../util/get-bigint-or-uint64-expr'

export class SliceFunctionBuilder extends FunctionBuilder {
  constructor(
    private base: Expression,
    private resultPType: PType & { wtype: WType },
  ) {
    super(base.sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [start, stop],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: 'slice',
      argSpec: (a) => [a.optional(uint64PType, numberPType), a.optional(uint64PType, numberPType)],
    })
    return instanceEb(
      nodeFactory.intersectionSliceExpression({
        base: this.base,
        sourceLocation: sourceLocation,
        beginIndex: start ? getBigIntOrUint64Expr(start) : null,
        endIndex: stop ? getBigIntOrUint64Expr(stop) : null,
        wtype: this.resultPType.wtype,
      }),
      this.resultPType,
    )
  }
}
