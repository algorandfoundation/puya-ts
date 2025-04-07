import type { bytes } from '@algorandfoundation/algorand-typescript'
import { assert, Contract } from '@algorandfoundation/algorand-typescript'

/* eslint-disable eqeqeq */

export class UnsupportedTokensAlgo extends Contract {
  bytes(b1: bytes, b2: bytes) {
    // @expect-error Loose equality operator '==' is not supported. Please use strict equality operator '==='
    assert(b1 == b2)

    // @expect-error Loose inequality operator '!=' is not supported. Please use strict inequality operator '!=='
    assert(b1 != b2)
  }
}
