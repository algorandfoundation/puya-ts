import type { Application, Asset } from '@algorandfoundation/algorand-typescript'
import { Bytes, Contract, MutableArray, Uint64, validateEncoding } from '@algorandfoundation/algorand-typescript'

class AbiValidationAlgo extends Contract {
  test(a: Asset, b: Application) {
    const x = Bytes()
    // @expect-error Cannot validate unbounded bytes
    validateEncoding(x)

    const y = new MutableArray(Uint64(1))
    // @expect-error Can only validate ARC4-encoded types
    validateEncoding(y)

    // @expect-error Can only validate ARC4-encoded types
    validateEncoding(a)

    // @expect-error Can only validate ARC4-encoded types
    validateEncoding(b)
  }
}
