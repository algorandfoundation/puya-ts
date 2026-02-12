// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class TestArc4 extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  setState(
    key: arc4.Str,
    value: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  deleteState(key: arc4.Str): void {
    err('stub only')
  }
}
