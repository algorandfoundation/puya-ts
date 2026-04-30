import { expect } from 'vitest'

export function testInvariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    expect.fail(message)
  }
}

export function joinUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
  const length = arrays.reduce((acc, cur) => acc + cur.length, 0)
  const result = new Uint8Array(length)
  let offset = 0
  for (const a of arrays) {
    result.set(a, offset)
    offset += a.length
  }
  return result
}
