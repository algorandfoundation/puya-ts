// This file is auto-generated, do not modify
import type { Account, arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class ByIndex extends Contract {
  @abimethod({ resourceEncoding: 'index' })
  testExplicitIndex(account: Account): arc4.Uint<64> {
    err('stub only')
  }

  /**
   * Should implicitly use default 'value'
   */
  @abimethod
  testImplicitValue(account: arc4.Address): arc4.Uint<64> {
    err('stub only')
  }
}
