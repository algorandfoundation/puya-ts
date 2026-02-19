// This file is auto-generated, do not modify
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class InvalidContract extends Contract {
  @abimethod({ onCreate: 'require' })
  create(): void {
    err('stub only')
  }

  @abimethod
  invalidValue(): arc4.StaticArray<arc4.Uint<64>, 3> {
    err('stub only')
  }
}
