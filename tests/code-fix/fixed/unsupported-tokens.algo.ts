import type { bytes } from '@algorandfoundation/algorand-typescript'
import { assert, Contract } from '@algorandfoundation/algorand-typescript'

/* eslint-disable eqeqeq */

export class UnsupportedTokensAlgo extends Contract {
  bytes(b1: bytes, b2: bytes) {
    assert(b1 === b2)

    assert(b1 !== b2)
  }
}

