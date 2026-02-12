// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class StaticBytesAlgo extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  hashAddresses(
    a1: arc4.StaticArray<arc4.Byte, 32>,
    a2: arc4.StaticArray<arc4.Byte, 32>,
  ): arc4.StaticArray<arc4.Byte, 32> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  receiveB32(b: arc4.StaticArray<arc4.Byte, 32>): arc4.StaticArray<arc4.Byte, 32> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  receiveBytes(
    b: arc4.DynamicBytes,
    length: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  returnLength(b: arc4.StaticArray<arc4.Byte, 32>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testArray(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test2(): arc4.DynamicBytes {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test3(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test4(): void {
    err('stub only')
  }
}
