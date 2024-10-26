import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import { BytesConstant } from '../../../awst/nodes'
import type { wtypes } from '../../../awst/wtypes'
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
