import type { InstanceBuilder, NodeBuilder } from './index'
import { FunctionBuilder } from './index'
import type { PType } from '../ptypes'
import { opUpFeeSourceType } from '../ptypes'
import { ensureBudgetFunction, stringPType, uint64PType } from '../ptypes'
import type { SourceLocation } from '../../awst/source-location'
import { parseFunctionArgs } from './util/arg-parsing'
import { VoidExpressionBuilder } from './void-expression-builder'
import { nodeFactory } from '../../awst/node-factory'
import { PuyaLibFunction } from '../../awst/nodes'
import { voidWType } from '../../awst/wtypes'
import { requireExpressionOfType } from './util'

export class EnsureBudgetFunctionBuilder extends FunctionBuilder {
  readonly ptype = ensureBudgetFunction
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [budget, feeSource],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      funcName: this.ptype.name,
      genericTypeArgs: 0,
      argSpec: (a) => [a.required(uint64PType), a.optional(uint64PType)],
    })

    return new VoidExpressionBuilder(
      nodeFactory.puyaLibCall({
        func: PuyaLibFunction.ensureBudget,
        args: [
          nodeFactory.callArg({
            name: null,
            value: budget.resolve(),
          }),
          nodeFactory.callArg({
            name: null,
            value: feeSource ? requireExpressionOfType(feeSource, uint64PType) : nodeFactory.uInt64Constant({ value: 0n, sourceLocation }),
          }),
        ],
        sourceLocation,
        wtype: voidWType,
      }),
    )
  }
}
