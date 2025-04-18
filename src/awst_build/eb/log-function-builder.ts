import type { awst } from '../../awst'

import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { nodeFactory } from '../../awst/node-factory'
import type { Expression } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'
import { CodeError, InternalError, throwError } from '../../errors'
import type { PType } from '../ptypes'
import type { NodeBuilder } from './index'
import { FunctionBuilder } from './index'
import { requireInstanceBuilder } from './util'
import { VoidExpressionBuilder } from './void-expression-builder'

export class LogFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const argsExps = args.map((a) => requireInstanceBuilder(a))

    let logBytes: awst.Expression
    if (argsExps.length === 0) {
      throw new CodeError(`log expects at least 1 argument`, { sourceLocation })
    } else if (argsExps.length === 1) {
      logBytes = argsExps[0].toBytes(sourceLocation)
    } else {
      logBytes =
        argsExps.reduce(
          (a: Expression | undefined, b): Expression | undefined =>
            a === undefined
              ? b.toBytes(sourceLocation)
              : intrinsicFactory.bytesConcat({ left: a, right: b.toBytes(sourceLocation), sourceLocation }),
          undefined,
        ) ?? throwError(new InternalError('Should never get here given previous conditions', { sourceLocation }))
    }

    return new VoidExpressionBuilder(
      nodeFactory.intrinsicCall({
        sourceLocation: sourceLocation,
        immediates: [],
        stackArgs: [logBytes],
        opCode: 'log',
        wtype: wtypes.voidWType,
      }),
    )
  }
}
