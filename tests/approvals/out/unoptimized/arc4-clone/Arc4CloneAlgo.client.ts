// This file is auto-generated, do not modify
import { Contract, abimethod, arc4, err } from '@algorandfoundation/algorand-typescript'

export class SharedStruct extends arc4.Struct<{
  foo: arc4.DynamicBytes
  bar: arc4.Uint<8>
}> {}

export class TopLevelStruct extends arc4.Struct<{
  a: arc4.Uint<64>
  b: arc4.Str
  shared: SharedStruct
}> {}

export abstract class Arc4CloneAlgo extends Contract {
  @abimethod({ onCreate: 'require' })
  aliasing(mutable: arc4.DynamicArray<arc4.Uint<64>>): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  receive(mutable: arc4.DynamicArray<arc4.Uint<64>>): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  receiveReadonly(a: arc4.DynamicArray<arc4.Uint<64>>): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  structReturn(arg: TopLevelStruct): SharedStruct {
    err('stub only')
  }
}
