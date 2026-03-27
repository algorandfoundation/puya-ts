// This file is auto-generated, do not modify
/* eslint-disable */
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class TestLocalMapTuple extends Contract {
  @abimethod({ allowActions: ['OptIn'] })
  optIn(): void {
    err('stub only')
  }

  @abimethod()
  testMapOfTuples(
    a: arc4.Str,
    b: arc4.Uint<64>,
    c: arc4.Bool,
  ): void {
    err('stub only')
  }

  @abimethod()
  testMapOfObjects(
    a: arc4.Str,
    b: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod()
  testTupleMap(
    a: arc4.Str,
    b: arc4.Uint<64>,
    c: arc4.Bool,
  ): void {
    err('stub only')
  }

  @abimethod()
  testObjectMap(
    a: arc4.Str,
    b: arc4.Uint<64>,
  ): void {
    err('stub only')
  }
}
