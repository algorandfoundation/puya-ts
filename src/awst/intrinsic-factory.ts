import type { DeliberateAny } from '../typescript-helpers'
import { bigIntToUint8Array } from '../util'
import { nodeFactory } from './node-factory'
import type { Expression } from './nodes'
import * as awst from './nodes'
import { BytesEncoding } from './nodes'
import type { SourceLocation } from './source-location'
import { wtypes } from './wtypes'

export const intrinsicFactory = {
  bytesConcat({
    left,
    right,
    sourceLocation,
  }: {
    left: awst.Expression
    right: awst.Expression
    sourceLocation: SourceLocation
  }): awst.IntrinsicCall {
    // invariant(left.wtype.equals(right.wtype), 'left and right operand wtypes must match')
    return nodeFactory.intrinsicCall({
      sourceLocation,
      stackArgs: [left, right],
      immediates: [],
      wtype: left.wtype,
      opCode: 'concat',
    })
  },
  err({ sourceLocation, comment }: { sourceLocation: SourceLocation; comment: string | null }) {
    return nodeFactory.assertExpression({
      condition: null,
      sourceLocation,
      wtype: wtypes.voidWType,
      errorMessage: comment,
    })
  },
  assert({ sourceLocation, comment, condition }: { sourceLocation: SourceLocation; comment: string | null; condition: Expression }) {
    return nodeFactory.assertExpression({
      sourceLocation,
      condition,
      wtype: wtypes.voidWType,
      errorMessage: comment,
    })
  },
  bytesLen({ value, sourceLocation }: { value: awst.Expression; sourceLocation: SourceLocation }) {
    return nodeFactory.intrinsicCall({
      opCode: 'len',
      stackArgs: [value],
      sourceLocation: sourceLocation,
      immediates: [],
      wtype: wtypes.uint64WType,
    })
  },
  bitLen({ value, sourceLocation }: { value: awst.Expression; sourceLocation: SourceLocation }) {
    return nodeFactory.intrinsicCall({
      opCode: 'bitlen',
      stackArgs: [value],
      sourceLocation: sourceLocation,
      immediates: [],
      wtype: wtypes.uint64WType,
    })
  },
  itob({ value, sourceLocation }: { value: awst.Expression; sourceLocation: SourceLocation }): awst.Expression {
    if (value instanceof awst.IntegerConstant) {
      return nodeFactory.bytesConstant({
        sourceLocation,
        value: bigIntToUint8Array(value.value, value.wtype.equals(wtypes.uint64WType) ? 8 : 'dynamic'),
        encoding: BytesEncoding.base16,
      })
    }
    return nodeFactory.intrinsicCall({
      sourceLocation,
      stackArgs: [value],
      immediates: [],
      wtype: wtypes.bytesWType,
      opCode: 'itob',
    })
  },
  btoi({ value, sourceLocation }: { value: awst.Expression; sourceLocation: SourceLocation }): awst.IntrinsicCall {
    return nodeFactory.intrinsicCall({
      sourceLocation,
      stackArgs: [value],
      immediates: [],
      wtype: wtypes.uint64WType,
      opCode: 'btoi',
    })
  },
} satisfies Record<string, (args: DeliberateAny) => awst.Expression>
