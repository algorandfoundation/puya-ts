// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class StoreBoth extends Contract {
  @abimethod({ onCreate: 'require' })
  test(
    theString: arc4.Str,
    theUint: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  setStore(value: arc4.Str): void {
    err('stub only')
  }
}
