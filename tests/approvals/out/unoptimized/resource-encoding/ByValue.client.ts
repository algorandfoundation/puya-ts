// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class ByValue extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testExplicitValue(account: arc4.Address): arc4.Uint<64> {
    err('stub only')
  }
}
