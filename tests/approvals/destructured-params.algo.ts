import type { bytes, uint64 } from '@algorandfoundation/algo-ts'
import { Bytes, log, Uint64 } from '@algorandfoundation/algo-ts'

function test({ a, b, c }: { a: uint64; b: bytes; c: boolean }): void {
  log(a, b, c)
}

function init() {
  test({ a: 1, b: Bytes(''), c: false })
  const temp = { a: Uint64(2), b: Bytes('Hello'), c: true }
  test(temp)
}

function test2(args: { x: boolean; y: boolean; z: readonly [string, string] }) {
  const {
    a,
    b,
    args: { x, y },
  } = { a: true, b: false, args }

  const args2 = { ...args, x: true, y: true }
}
