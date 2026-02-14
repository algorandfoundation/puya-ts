// This file is auto-generated, do not modify
import { Contract, abimethod, arc4, err } from '@algorandfoundation/algorand-typescript'

export class ObjectEFF43F36 extends arc4.Struct<{
  a: arc4.Uint<64>
  b: arc4.DynamicBytes
}> {}

export class ReadonlyObjectEFF43F36 extends arc4.Struct<{
  a: arc4.Uint<64>
  b: arc4.DynamicBytes
}> {}

export class Data extends arc4.Struct<{
  a: arc4.Uint<64>
  b: arc4.DynamicBytes
  c: arc4.Bool
  d: arc4.Str
}> {}

export class ObjectE4D9E83F extends arc4.Struct<{
  localUint: arc4.Uint<64>
  localUint2: arc4.Uint<64>
  localBytes: arc4.DynamicBytes
  localBytes2: arc4.DynamicBytes
  localEncoded: arc4.StaticArray<arc4.Uint<64>, 10>
  localTuple: arc4.Tuple<readonly [arc4.Uint<64>, arc4.DynamicBytes]>
  localObject: ReadonlyObjectEFF43F36
  localMutableObject: Data
}> {}

export abstract class LocalStateDemo extends Contract {
  @abimethod({ onCreate: 'require' })
  optIn(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  setState(
    p: ObjectEFF43F36,
    c: arc4.StaticArray<arc4.Uint<64>, 10>,
  ): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  getState(): ObjectE4D9E83F {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  clearState(): void {
    err('stub only')
  }

  /**
   * Writes a value to local state using a dynamic key.
   * Demonstrates dynamic key-value storage in local state.
   */
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  writeDynamicLocalState(
    key: arc4.Str,
    value: arc4.Str,
  ): arc4.Str {
    err('stub only')
  }

  /**
   * Reads a value from local state using a dynamic key.
   */
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  readDynamicLocalState(key: arc4.Str): arc4.Str {
    err('stub only')
  }
}
