import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import { BytesConstant } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import type { wtypes } from '../../../awst/wtypes'
import { CodeError } from '../../../errors'
import type { PType } from '../../ptypes'
import { ImmutableObjectPType, MutableObjectPType, TransientType, UnsupportedType } from '../../ptypes'
import type { InstanceBuilder } from '../index'

export function extractKey(key: InstanceBuilder, keyWType: wtypes.WType, sourceLocation: SourceLocation): Expression
export function extractKey(key: InstanceBuilder | undefined, keyWType: wtypes.WType, sourceLocation: SourceLocation): Expression | undefined
export function extractKey(
  key: InstanceBuilder | undefined,
  keyWType: wtypes.WType,
  sourceLocation: SourceLocation,
): Expression | undefined {
  if (!key) return undefined

  const keyBytes = key.toBytes(key.sourceLocation).resolve()
  if (keyBytes instanceof BytesConstant) {
    return nodeFactory.bytesConstant({
      ...keyBytes,
      wtype: keyWType,
      sourceLocation,
    })
  } else {
    return nodeFactory.reinterpretCast({
      expr: keyBytes,
      wtype: keyWType,
      sourceLocation,
    })
  }
}

export function assertCanBeUsedForStorage(ptype: PType, sourceLocation?: SourceLocation) {
  if (ptype instanceof UnsupportedType || ptype instanceof TransientType) {
    throw new CodeError(`Type ${ptype} cannot be used for storage`, { sourceLocation })
  }
  if ((ptype instanceof MutableObjectPType || ptype instanceof ImmutableObjectPType) && !ptype.abiSafe) {
    const ptypeName = ptype.alias?.fullName || ptype.toString()
    throw new CodeError(`Type ${ptypeName} cannot be used for storage`, { sourceLocation })
  }
}
