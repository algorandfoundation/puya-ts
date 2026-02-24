import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Bytes } from '@algorandfoundation/algorand-typescript'

/** Convert a uint64 to its decimal string representation */
export function itoa(i: uint64): string {
  const digits = Bytes`0123456789`
  const radix = digits.length
  if (i < radix) {
    return digits.at(i).toString()
  }
  return `${itoa(i / radix)}${digits.at(i % radix)}`
}

/** Return the smaller of two uint64 values */
export function min(a: uint64, b: uint64): uint64 {
  return a < b ? a : b
}

/** Return the larger of two uint64 values */
export function max(a: uint64, b: uint64): uint64 {
  return a > b ? a : b
}
