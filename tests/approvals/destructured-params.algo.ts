import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Bytes, Contract, log, Uint64 } from '@algorandfoundation/algorand-typescript'
import type { Bool, DynamicBytes, Uint64 as ARC4Uint64 } from '@algorandfoundation/algorand-typescript/arc4'
import { Struct } from '@algorandfoundation/algorand-typescript/arc4'

class Arc4 extends Struct<{ a: ARC4Uint64; b: DynamicBytes; c: Bool }> {}

export class DestructuredParamsAlgo extends Contract {
  test({ a, b, c }: { a: uint64; b: bytes; c: boolean }): void {
    log(a, b, c)
  }

  testMutable({ a, b, c }: Arc4) {
    log(a, b, c)
  }

  init() {
    this.test({ a: 456, b: Bytes(''), c: false })
    const temp = { a: Uint64(2), b: Bytes('Hello'), c: true }
    this.test(temp)
  }
}
