// This file is auto-generated, do not modify
/* eslint-disable */
import { Contract, abimethod, arc4, err } from '@algorandfoundation/algorand-typescript'

export class Vector extends arc4.Struct<{
  x: arc4.Uint<64>
  y: arc4.Uint<64>
}> {}

export abstract class NativeArraysAlgo extends Contract {
  @abimethod()
  readonlyArray(): void {
    err('stub only')
  }

  @abimethod()
  arrayInObject(): void {
    err('stub only')
  }

  @abimethod()
  buildArray(): arc4.DynamicArray<arc4.Uint<64>> {
    err('stub only')
  }

  @abimethod()
  arrayFromCtor(): arc4.DynamicArray<arc4.Uint<64>> {
    err('stub only')
  }

  @abimethod()
  buildReadonly(): arc4.DynamicArray<arc4.Uint<64>> {
    err('stub only')
  }

  @abimethod()
  doThings(): void {
    err('stub only')
  }

  @abimethod()
  fixedArray(y: arc4.StaticArray<arc4.Uint<64>, 50>): void {
    err('stub only')
  }

  @abimethod()
  arc4Interop(): void {
    err('stub only')
  }

  @abimethod()
  structs(p: Vector): arc4.DynamicArray<arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>]>> {
    err('stub only')
  }

  @abimethod()
  booleans(): arc4.DynamicArray<arc4.Bool> {
    err('stub only')
  }

  @abimethod()
  booleansStatic(): arc4.Tuple<readonly [arc4.Bool, arc4.Bool, arc4.Bool]> {
    err('stub only')
  }

  @abimethod()
  arc4Booleans(): arc4.DynamicArray<arc4.Bool> {
    err('stub only')
  }

  @abimethod()
  arc4BooleansStatic(): arc4.Tuple<readonly [arc4.Bool, arc4.Bool, arc4.Bool]> {
    err('stub only')
  }

  @abimethod()
  aliasing(
    mutable: arc4.DynamicArray<arc4.Uint<64>>,
    readOnly: arc4.DynamicArray<arc4.Uint<64>>,
  ): void {
    err('stub only')
  }

  @abimethod()
  receiveMutable(a: arc4.DynamicArray<arc4.Uint<64>>): void {
    err('stub only')
  }

  @abimethod()
  receiveReadonly(a: arc4.DynamicArray<arc4.Uint<64>>): void {
    err('stub only')
  }
}
