// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class StoreUint64 extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  setStore(value: arc4.Uint<64>): void {
    err('stub only')
  }
}
