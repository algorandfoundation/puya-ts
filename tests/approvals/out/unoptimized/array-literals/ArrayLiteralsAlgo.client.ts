// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class ArrayLiteralsAlgo extends Contract {
  @abimethod({ onCreate: 'require' })
  test(
    a: arc4.Uint<64>,
    b: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  test2(): arc4.Uint<64> {
    err('stub only')
  }
}
