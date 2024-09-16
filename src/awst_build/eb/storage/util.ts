import type { InstanceBuilder } from '../index'
import type { WType } from '../../../awst/wtypes'
import type { Expression } from '../../../awst/nodes'
import { BytesConstant } from '../../../awst/nodes'
import { nodeFactory } from '../../../awst/node-factory'

export function extractKey(key: InstanceBuilder, keyWType: WType): Expression
export function extractKey(key: InstanceBuilder | undefined, keyWType: WType): Expression | undefined
export function extractKey(key: InstanceBuilder | undefined, keyWType: WType): Expression | undefined {
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
