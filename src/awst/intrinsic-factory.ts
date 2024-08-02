import type * as awst from './nodes'
import * as wtypes from './wtypes'
import { nodeFactory } from './node-factory'
import type { SourceLocation } from './source-location'
import type { DeliberateAny } from '../typescript-helpers'

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
    return nodeFactory.intrinsicCall({
      sourceLocation,
      stackArgs: [left, right],
      immediates: [],
      wtype: wtypes.bytesWType,
      opCode: 'concat',
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
} satisfies Record<string, (args: DeliberateAny) => awst.IntrinsicCall>
