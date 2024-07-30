import { Uint64, uint64 } from '@algorandfoundation/algo-ts'

function test(x: uint64, y: uint64) {
  const a: uint64 = (x < 4 ? x : y) + x
  const b: uint64 = y % 2 ? 2 : 1
  const c: uint64 = x > y ? (y > 10 ? 3 : y) : x
  const d: uint64 = (y % 2 ? 2 : 1) + (x < 4 ? x : y)
  const e: uint64 = x || 4

  return true
}
