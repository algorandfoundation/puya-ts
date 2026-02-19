// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class InvalidContract extends Contract {
  @abimethod({ onCreate: 'require' })
  create(): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  invalidValue(): arc4.StaticArray<arc4.Uint<64>, 3> {
    err('stub only')
  }
}
