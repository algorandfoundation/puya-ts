// This file is auto-generated, do not modify
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class StaticBytesAlgo extends Contract {
  @abimethod
  hashAddresses(
    a1: arc4.StaticArray<arc4.Byte, 32>,
    a2: arc4.StaticArray<arc4.Byte, 32>,
  ): arc4.StaticArray<arc4.Byte, 32> {
    err('stub only')
  }

  @abimethod
  receiveB32(b: arc4.StaticArray<arc4.Byte, 32>): arc4.StaticArray<arc4.Byte, 32> {
    err('stub only')
  }

  @abimethod
  receiveBytes(
    b: arc4.DynamicBytes,
    length: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod
  returnLength(b: arc4.StaticArray<arc4.Byte, 32>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod
  test(): void {
    err('stub only')
  }

  @abimethod
  testArray(): void {
    err('stub only')
  }

  @abimethod
  test2(): arc4.DynamicBytes {
    err('stub only')
  }

  @abimethod
  test3(): void {
    err('stub only')
  }

  @abimethod
  test4(): void {
    err('stub only')
  }
}
