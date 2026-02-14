// This file is auto-generated, do not modify
import { Contract, abimethod, arc4, err, type gtxn } from '@algorandfoundation/algorand-typescript'

export class Object3488A93F extends arc4.Struct<{
  sender: arc4.StaticArray<arc4.Byte, 32>
  fee: arc4.Uint<64>
  firstValid: arc4.Uint<64>
  firstValidTime: arc4.Uint<64>
  lastValid: arc4.Uint<64>
  note: arc4.DynamicBytes
  lease: arc4.StaticArray<arc4.Byte, 32>
  typeBytes: arc4.DynamicBytes
  groupIndex: arc4.Uint<64>
  txnId: arc4.StaticArray<arc4.Byte, 32>
  rekeyTo: arc4.StaticArray<arc4.Byte, 32>
  receiver: arc4.StaticArray<arc4.Byte, 32>
  amount: arc4.Uint<64>
  closeRemainderTo: arc4.StaticArray<arc4.Byte, 32>
}> {}

export abstract class GtxnsAlgo extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test2(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test3(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test4(other: gtxn.ApplicationCallTxn): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  reflectAllPay(pay: gtxn.PaymentTxn): Object3488A93F {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test5(txn: gtxn.Transaction): arc4.Uint<64> {
    err('stub only')
  }
}
