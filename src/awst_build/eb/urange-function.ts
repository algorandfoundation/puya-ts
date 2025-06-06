import type { awst } from '../../awst'
import { nodeFactory } from '../../awst/node-factory'
import type { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'
import type { PType } from '../ptypes'
import { IterableIteratorGeneric, uint64PType } from '../ptypes'
import type { NodeBuilder } from './index'
import { FunctionBuilder } from './index'
import { IterableIteratorExpressionBuilder } from './iterable-iterator-expression-builder'
import { parseFunctionArgs } from './util/arg-parsing'

export class UrangeFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const { args: uArgs } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: 'urange',
      argSpec: (a) => [a.required(uint64PType), ...args.slice(1, 3).map((_) => a.required(uint64PType))],
    })
    let expr: awst.Range
    if (uArgs.length === 1) {
      expr = nodeFactory.range({
        start: nodeFactory.uInt64Constant({ value: 0n, sourceLocation }),
        stop: uArgs[0].resolve(),
        step: nodeFactory.uInt64Constant({ value: 1n, sourceLocation }),
        sourceLocation,
        wtype: wtypes.uint64RangeWType,
      })
    } else if (uArgs.length === 2) {
      expr = nodeFactory.range({
        start: uArgs[0].resolve(),
        stop: uArgs[1].resolve(),
        step: nodeFactory.uInt64Constant({ value: 1n, sourceLocation }),
        sourceLocation,
        wtype: wtypes.uint64RangeWType,
      })
    } else {
      expr = nodeFactory.range({
        start: uArgs[0].resolve(),
        stop: uArgs[1].resolve(),
        step: uArgs[2].resolve(),
        sourceLocation,
        wtype: wtypes.uint64RangeWType,
      })
    }
    return new IterableIteratorExpressionBuilder(expr, IterableIteratorGeneric.parameterise([uint64PType]))
  }
}
