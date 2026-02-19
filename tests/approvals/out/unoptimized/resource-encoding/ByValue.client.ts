// This file is auto-generated, do not modify
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class ByValue extends Contract {
  @abimethod()
  testExplicitValue(account: arc4.Address): arc4.Uint<64> {
    err('stub only')
  }
}
