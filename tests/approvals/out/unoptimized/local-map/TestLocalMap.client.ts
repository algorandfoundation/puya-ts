// This file is auto-generated, do not modify
/* eslint-disable */
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class TestLocalMap extends Contract {
  @abimethod({ allowActions: ['OptIn'] })
  optIn(): void {
    err('stub only')
  }

  @abimethod()
  setAndGetUint(
    key: arc4.Str,
    value: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod()
  setAndGetBytes(
    key: arc4.Str,
    value: arc4.DynamicBytes,
  ): void {
    err('stub only')
  }

  @abimethod()
  setAndGetString(
    key: arc4.Str,
    value: arc4.Str,
  ): void {
    err('stub only')
  }

  @abimethod()
  deleteValue(key: arc4.Str): void {
    err('stub only')
  }

  @abimethod()
  hasValue(key: arc4.Str): arc4.Bool {
    err('stub only')
  }

  @abimethod()
  testKeyPrefix(): void {
    err('stub only')
  }

  @abimethod()
  testPrefixedMap(
    key: arc4.Str,
    value: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod()
  setAndGetUintViaLocalState(
    key: arc4.Str,
    value: arc4.Uint<64>,
  ): void {
    err('stub only')
  }
}
