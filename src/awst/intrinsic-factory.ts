import type * as awst from './nodes'
import * as wtypes from './wtypes'
import { nodeFactory } from './node-factory'
import type { SourceLocation } from './source-location'
import type { DeliberateAny } from '../typescript-helpers'
import type { Expression } from './nodes'
import { invariant } from '../util'

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
    invariant(left.wtype.equals(right.wtype), 'left and right operand wtypes must match')
    return nodeFactory.intrinsicCall({
      sourceLocation,
      stackArgs: [left, right],
      immediates: [],
      wtype: left.wtype,
      opCode: 'concat',
    })
  },
  err({ sourceLocation, comment }: { sourceLocation: SourceLocation; comment: string | null }) {
    return nodeFactory.intrinsicCall({
      opCode: 'err',
      sourceLocation,
      stackArgs: [],
      immediates: [],
      wtype: wtypes.voidWType,
      comment,
    })
  },
  assert({ sourceLocation, comment, condition }: { sourceLocation: SourceLocation; comment: string | null; condition: Expression }) {
    return nodeFactory.intrinsicCall({
      opCode: 'assert',
      sourceLocation,
      stackArgs: [condition],
      immediates: [],
      wtype: wtypes.voidWType,
      comment,
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
  itob({ value, sourceLocation }: { value: awst.Expression; sourceLocation: SourceLocation }): awst.IntrinsicCall {
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
} satisfies Record<string, (args: DeliberateAny) => awst.IntrinsicCall>
