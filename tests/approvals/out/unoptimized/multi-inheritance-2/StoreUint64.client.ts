// This file is auto-generated, do not modify
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class StoreUint64 extends Contract {
  @abimethod
  setStore(value: arc4.Uint<64>): void {
    err('stub only')
  }
}
