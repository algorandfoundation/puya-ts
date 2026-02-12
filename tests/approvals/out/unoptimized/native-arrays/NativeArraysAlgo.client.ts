// This file is auto-generated, do not modify
import { Contract, abimethod, arc4, err } from '@algorandfoundation/algorand-typescript'

export class Vector extends arc4.Struct<{
  x: arc4.Uint<64>
  y: arc4.Uint<64>
}> {}

export abstract class NativeArraysAlgo extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  readonlyArray(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  arrayInObject(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  buildArray(): arc4.DynamicArray<arc4.Uint<64>> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  arrayFromCtor(): arc4.DynamicArray<arc4.Uint<64>> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  buildReadonly(): arc4.DynamicArray<arc4.Uint<64>> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  doThings(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  fixedArray(y: arc4.StaticArray<arc4.Uint<64>, 50>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  arc4Interop(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  structs(p: Vector): arc4.DynamicArray<arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>]>> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  booleans(): arc4.DynamicArray<arc4.Bool> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  booleansStatic(): arc4.Tuple<readonly [arc4.Bool, arc4.Bool, arc4.Bool]> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  arc4Booleans(): arc4.DynamicArray<arc4.Bool> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  arc4BooleansStatic(): arc4.Tuple<readonly [arc4.Bool, arc4.Bool, arc4.Bool]> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  aliasing(
    mutable: arc4.DynamicArray<arc4.Uint<64>>,
    readOnly: arc4.DynamicArray<arc4.Uint<64>>,
  ): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  receiveMutable(a: arc4.DynamicArray<arc4.Uint<64>>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  receiveReadonly(a: arc4.DynamicArray<arc4.Uint<64>>): void {
    err('stub only')
  }
}
