import { nodeFactory } from '../../awst/node-factory'
import { PuyaLibFunction } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'
import type { PType } from '../ptypes'
import { ensureBudgetFunction, opUpFeeSourceType, uint64PType } from '../ptypes'
import type { NodeBuilder } from './index'
import { FunctionBuilder } from './index'
import { requireExpressionOfType } from './util'
import { parseFunctionArgs } from './util/arg-parsing'
import { VoidExpressionBuilder } from './void-expression-builder'

export class EnsureBudgetFunctionBuilder extends FunctionBuilder {
  readonly ptype = ensureBudgetFunction

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [budget, feeSource],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      funcName: this.ptype.name,
      genericTypeArgs: 0,
      argSpec: (a) => [a.required(uint64PType), a.optional(opUpFeeSourceType.memberType)],
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
            value: feeSource
              ? requireExpressionOfType(feeSource, opUpFeeSourceType.memberType)
              : nodeFactory.uInt64Constant({ value: 0n, sourceLocation }),
          }),
        ],
        sourceLocation,
        wtype: wtypes.voidWType,
      }),
    )
  }
}
