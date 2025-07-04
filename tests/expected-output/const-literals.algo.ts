import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract } from '@algorandfoundation/algorand-typescript'

const unsafeUint64 = 2 ** 128

class ConstLiteralsAlgo extends Contract {
  test(): uint64 {
    // @expect-error uint64 overflow or underflow: 18446744073709551616
    const unsafeLocal: uint64 = 2 ** 64
    // @expect-error uint64 overflow or underflow: 340282366920938463463374607431768211456
    return unsafeUint64
  }
}
