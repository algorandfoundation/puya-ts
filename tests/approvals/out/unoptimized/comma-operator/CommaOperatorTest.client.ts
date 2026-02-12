// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class CommaOperatorTest extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  emitEmitAdd(
    a: arc4.Uint<8>,
    b: arc4.Uint<8>,
  ): arc4.Uint<8> {
    err('stub only')
  }
}
