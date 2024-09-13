import type { InstanceBuilder } from './index'
import { FunctionBuilder } from './index'
import type { SourceLocation } from '../../awst/source-location'
import { VoidExpressionBuilder } from './void-expression-builder'
import { nodeFactory } from '../../awst/node-factory'
import type { awst } from '../../awst'
import { wtypes } from '../../awst'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { CodeError, InternalError, throwError } from '../../errors'
import { requireInstanceBuilder } from './util'
import type { Expression } from '../../awst/nodes'
import type { PType } from '../ptypes'

export class LogFunctionBuilder extends FunctionBuilder {
  call(args: Array<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
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
