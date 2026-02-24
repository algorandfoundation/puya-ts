/**
 * Example 05 — Type Explorer
 * Tier: 1 — Fundamentals
 *
 * Features demonstrated:
 *   - uint64 / biguint / bytes primitive types and conversions
 *   - Uint64() factory function
 *   - BigUint() factory function
 *   - Bytes() factory function
 *   - Bytes.fromHex() hex decoding
 *   - op.sha256() hashing
 *   - op.addw() 128-bit addition
 *   - op.itob() uint64 → bytes conversion
 *   - op.btoi() bytes → uint64 conversion
 *   - op.bsqrt() big-integer square root
 *   - log() transaction logging
 */
import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
// Contract: ABI-routed base; op: AVM opcodes; factories: Uint64, BigUint, Bytes; log: txn logging
import { BigUint, Bytes, Contract, log, op, Uint64 } from '@algorandfoundation/algorand-typescript'

// --- Free subroutines demonstrating type conversions ---

// Free subroutine: convert uint64 to bytes via op.itob, then back via op.btoi
function uint64RoundTrip(value: uint64): uint64 {
  // op.itob: convert uint64 to 8-byte big-endian bytes
  const asBytes = op.itob(value)
  // op.btoi: convert big-endian bytes back to uint64
  return op.btoi(asBytes)
}

// Free subroutine: convert uint64 to biguint via BigUint() factory
function uint64ToBigUint(value: uint64): biguint {
  // BigUint(uint64): widen a uint64 into a biguint
  return BigUint(value)
}

// Free subroutine: convert bytes to biguint (big-endian interpretation)
function bytesToBigUint(value: bytes): biguint {
  // BigUint(bytes): interpret bytes as a big-endian unsigned integer
  return BigUint(value)
}

// Type explorer contract showcasing primitive types, conversions, and low-level ops
export class TypeExplorer extends Contract {
  // Demonstrate uint64 factories and arithmetic, returning the round-tripped value
  public exploreUint64(a: uint64, b: uint64): uint64 {
    // Uint64(): create a uint64 constant from a literal
    const zero = Uint64(0)
    // uint64 addition — explicit type annotation required (otherwise inferred as `number`)
    const sum: uint64 = a + b + zero

    // log(): emit the sum to the transaction log
    log(sum)

    // Free subroutine: uint64 → bytes → uint64 round trip via op.itob / op.btoi
    return uint64RoundTrip(sum)
  }

  // Demonstrate biguint factories, conversion from uint64, and op.bsqrt
  public exploreBigUint(value: uint64): biguint {
    // Convert uint64 → biguint via free subroutine (uses BigUint(uint64))
    const big = uint64ToBigUint(value)

    // biguint arithmetic: squaring — explicit type annotation required (otherwise inferred as `bigint`)
    const squared: biguint = big * big

    // op.bsqrt: compute integer square root of a biguint (largest I where I² ≤ N)
    const root = op.bsqrt(squared)

    // log the square root
    log(root)

    return root
  }

  // Demonstrate Bytes() factory, Bytes.fromHex(), op.sha256, and bytes → biguint conversion
  public exploreBytes(input: bytes): bytes {
    // Bytes(): create an empty bytes value
    const empty = Bytes()

    // Bytes.fromHex(): decode a hexadecimal string into bytes
    const deadbeef = Bytes.fromHex('DEADBEEF')

    // .concat(): concatenate bytes values together
    const combined = empty.concat(input).concat(deadbeef)

    // op.sha256: compute SHA-256 hash (returns bytes<32>)
    const hash = op.sha256(combined)

    // Convert hash bytes to biguint via free subroutine (BigUint(bytes))
    const hashAsBigUint = bytesToBigUint(hash)

    // log the hash as biguint for inspection
    log(hashAsBigUint)

    return hash
  }

  // Demonstrate op.addw (128-bit addition) and op.itob / op.btoi conversions
  public exploreWideMath(a: uint64, b: uint64): uint64 {
    // op.addw: add two uint64 values, returning a 128-bit result as [carry, low]
    const [carry, low] = op.addw(a, b)

    // op.itob: convert the carry and low parts to big-endian bytes
    const carryBytes = op.itob(carry)
    const lowBytes = op.itob(low)

    // log both parts for inspection
    log(carryBytes, lowBytes)

    // Bytes(uint64): convert uint64 to bytes via Bytes() factory
    const aBytes = Bytes(a)
    // op.btoi: convert bytes back to uint64
    const aRecovered = op.btoi(aBytes)

    // log the recovered value
    log(aRecovered)

    return low
  }
}
