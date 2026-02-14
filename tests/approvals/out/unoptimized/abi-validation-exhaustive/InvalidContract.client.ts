// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class InvalidContract extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  create(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  invalidValue(): arc4.StaticArray<arc4.Uint<64>, 3> {
    err('stub only')
  }
}
