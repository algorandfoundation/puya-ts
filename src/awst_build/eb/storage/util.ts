import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import { BytesConstant } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import type { wtypes } from '../../../awst/wtypes'
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
