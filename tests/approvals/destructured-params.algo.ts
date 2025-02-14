import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Bytes, Contract, log, Uint64 } from '@algorandfoundation/algorand-typescript'

export class DestructuredParamsAlgo extends Contract {
  test({ a, b, c }: { a: uint64; b: bytes; c: boolean }): void {
    log(a, b, c)
  }

  init() {
    this.test({ a: 456, b: Bytes(''), c: false })
    const temp = { a: Uint64(2), b: Bytes('Hello'), c: true }
    this.test(temp)
  }
}
