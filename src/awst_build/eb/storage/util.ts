import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import { BytesConstant } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import type { wtypes } from '../../../awst/wtypes'
import { CodeError } from '../../../errors'
import { isArc4EncodableType, ptypeToArc4EncodedType } from '../../arc4-util'
import type { PType } from '../../ptypes'
import { TuplePType } from '../../ptypes'
import type { InstanceBuilder } from '../index'

export function extractKey(key: InstanceBuilder, keyWType: wtypes.WType): Expression
export function extractKey(key: InstanceBuilder | undefined, keyWType: wtypes.WType): Expression | undefined
export function extractKey(key: InstanceBuilder | undefined, keyWType: wtypes.WType): Expression | undefined {
  if (!key) return undefined

  const keyBytes = key.toBytes(key.sourceLocation)
  if (keyBytes instanceof BytesConstant) {
    return nodeFactory.bytesConstant({
      ...keyBytes,
      wtype: keyWType,
    })
  } else {
    return nodeFactory.reinterpretCast({
      expr: keyBytes,
      wtype: keyWType,
      sourceLocation: key.sourceLocation,
    })
  }
}

export function getStorageWType(contentType: PType, sourceLocation: SourceLocation): wtypes.WType {
  if (contentType instanceof TuplePType) {
    if (!isArc4EncodableType(contentType)) {
      throw new CodeError(`${contentType.fullName} is not a valid type for storage`, { sourceLocation })
    }
    return ptypeToArc4EncodedType(contentType, sourceLocation).wtype
  }
  if (!contentType.wtype || !contentType.wtype.scalarType) {
    throw new CodeError(`${contentType.fullName} is not a valid type for storage`, { sourceLocation })
  }
  return contentType.wtype
}
