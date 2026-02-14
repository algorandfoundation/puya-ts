// This file is auto-generated, do not modify
import { Contract, abimethod, arc4, err } from '@algorandfoundation/algorand-typescript'

export class ARC4StaticStruct extends arc4.Struct<{
  foo: arc4.Uint<64>
  bar: arc4.Uint<8>
}> {}

export class ARC4DynamicStruct extends arc4.Struct<{
  foo: arc4.Uint<64>
  bar: arc4.Uint<8>
  baz: arc4.Str
}> {}

export class WithABool extends arc4.Struct<{
  foo: arc4.Uint<8>
  bar: arc4.DynamicBytes
  baz: arc4.Bool
}> {}

export class NativeStaticStruct extends arc4.Struct<{
  foo: arc4.Uint<64>
  bar: arc4.Uint<8>
}> {}

export class NativeDynamicStruct extends arc4.Struct<{
  foo: arc4.Uint<64>
  bar: arc4.Uint<8>
  baz: arc4.Str
}> {}

export abstract class AbiValidationExhaustive extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_uint64(value: arc4.Uint<64>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_uint8(value: arc4.Uint<8>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_uint512(value: arc4.Uint<512>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_ufixed64(value: arc4.UFixed<64, 2>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_uint8_arr(value: arc4.DynamicArray<arc4.Uint<8>>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_uint8_arr3(value: arc4.StaticArray<arc4.Uint<8>, 3>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_bool(value: arc4.Bool): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_byte(value: arc4.Byte): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_string(value: arc4.Str): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_bytes(value: arc4.DynamicBytes): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_address(value: arc4.Address): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_account(value: arc4.Address): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_bool_arr(value: arc4.DynamicArray<arc4.Bool>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_bool_arr3(value: arc4.StaticArray<arc4.Bool, 3>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_static_tuple(value: arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<8>]>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_dynamic_tuple(value: arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<8>, arc4.Str]>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_static_struct(value: ARC4StaticStruct): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_dynamic_struct(value: ARC4DynamicStruct): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_static_struct_arr(value: arc4.DynamicArray<arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<8>]>>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_static_struct_arr3(value: arc4.StaticArray<arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<8>]>, 3>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_dynamic_struct_arr(value: arc4.DynamicArray<arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<8>, arc4.Str]>>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_dynamic_struct_arr3(value: arc4.StaticArray<arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<8>, arc4.Str]>, 3>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_dynamic_struct_with_a_bool(value: WithABool): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_native_static_struct(value: NativeStaticStruct): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_native_dynamic_struct(value: NativeDynamicStruct): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_native_static_struct_arr(value: arc4.DynamicArray<arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<8>]>>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_native_static_struct_arr3(value: arc4.StaticArray<arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<8>]>, 3>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_native_dynamic_struct_arr(value: arc4.DynamicArray<arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<8>, arc4.Str]>>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_native_dynamic_struct_arr3(value: arc4.StaticArray<arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<8>, arc4.Str]>, 3>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  validate_c2c(): void {
    err('stub only')
  }
}
