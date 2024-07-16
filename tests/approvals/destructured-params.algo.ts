import { Bytes, bytes, log, Uint64, uint64 } from '@algorandfoundation/algo-ts'

function test({ a, b, c }: { a: uint64; b: bytes; c: boolean }): void {
  log(a, b, c)
}

function init() {
  test({ a: 1, b: Bytes(''), c: false })
  const temp = { a: Uint64(2), b: Bytes('Hello'), c: true }
  test(temp)
}
