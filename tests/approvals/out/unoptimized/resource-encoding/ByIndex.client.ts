// This file is auto-generated, do not modify
import { Contract, abimethod, err, type Account, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class ByIndex extends Contract {
  @abimethod({ resourceEncoding: 'index', allowActions: ['NoOp'], onCreate: 'require' })
  testExplicitIndex(account: Account): arc4.Uint<64> {
    err('stub only')
  }

  /**
   * Should implicitly use default 'value'
   */
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testImplicitValue(account: arc4.Address): arc4.Uint<64> {
    err('stub only')
  }
}
