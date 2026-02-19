// This file is auto-generated, do not modify
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class Uint64ToStringAlgo extends Contract {
  @abimethod
  test(x: arc4.Uint<64>): arc4.Str {
    err('stub only')
  }
}
