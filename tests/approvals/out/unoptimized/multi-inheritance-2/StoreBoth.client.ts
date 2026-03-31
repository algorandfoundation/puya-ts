// This file is auto-generated, do not modify
/* eslint-disable */
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class StoreBoth extends Contract {
  @abimethod()
  test(
    theString: arc4.Str,
    theUint: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod()
  setStore(value: arc4.Str): void {
    err('stub only')
  }
}
