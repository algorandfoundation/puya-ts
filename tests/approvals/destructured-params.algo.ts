import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Bytes, log, Uint64 } from '@algorandfoundation/algorand-typescript'

function test({ a, b, c }: { a: uint64; b: bytes; c: boolean }): void {
  log(a, b, c)
}

function init() {
  test({ a: 1, b: Bytes(''), c: false })
  const temp = { a: Uint64(2), b: Bytes('Hello'), c: true }
  test(temp)
}
