// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class DemoContract extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testWhile(stop: arc4.Uint<64>): arc4.Uint<64> {
    err('stub only')
  }
}
