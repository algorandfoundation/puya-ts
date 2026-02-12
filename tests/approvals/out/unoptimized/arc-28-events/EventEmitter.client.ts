// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class EventEmitter extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  emitSwapped(
    a: arc4.Uint<8>,
    b: arc4.Uint<8>,
  ): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  emitCustom(
    arg0: arc4.Str,
    arg1: arc4.Bool,
  ): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  emitDynamicBytes(
    x: arc4.DynamicBytes,
    y: arc4.DynamicBytes,
  ): void {
    err('stub only')
  }
}
