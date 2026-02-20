// This file is auto-generated, do not modify
/* eslint-disable */
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class ArrayLiteralsAlgo extends Contract {
  @abimethod()
  test(
    a: arc4.Uint<64>,
    b: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod()
  test2(): arc4.Uint<64> {
    err('stub only')
  }
}
