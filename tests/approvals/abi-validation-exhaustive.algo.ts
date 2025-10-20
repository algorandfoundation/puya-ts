import type { uint64, Account, FixedArray } from '@algorandfoundation/algorand-typescript'
import { validate } from '@algorandfoundation/algorand-typescript'
import { Contract } from '@algorandfoundation/algorand-typescript'
import * as arc4 from '@algorandfoundation/algorand-typescript/arc4'

class ARC4StaticStruct extends arc4.Struct<{ foo: arc4.Uint64; bar: arc4.Uint8 }> {}
class ARC4DynamicStruct extends arc4.Struct<{ foo: arc4.Uint64; bar: arc4.Uint8; baz: arc4.Str }> {}
type NativeStaticStruct = { foo: uint64; bar: arc4.Uint8 }
type NativeDynamicStruct = {
  foo: uint64
  bar: arc4.Uint8
  baz: string
}
class WithABool extends arc4.Struct<{ foo: arc4.Uint8; bar: arc4.DynamicBytes; baz: arc4.Bool }> {}
type ARC4StaticTuple = arc4.Tuple<[arc4.Uint64, arc4.Uint8]>
type ARC4DynamicTuple = arc4.Tuple<[arc4.Uint64, arc4.Uint8, arc4.Str]>

class AbiValidationExhaustive extends Contract {
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_uint64(value: arc4.Uint64) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_uint8(value: arc4.Uint8) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_uint512(value: arc4.Uint<512>) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_ufixed64(value: arc4.UFixed<64, 2>) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_uint8_arr(value: arc4.DynamicArray<arc4.Uint8>) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_uint8_arr3(value: arc4.StaticArray<arc4.Uint8, 3>) {
    validate(value)
  }
  validate_bool(value: arc4.Bool) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_byte(value: arc4.Byte) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_string(value: arc4.Str) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_bytes(value: arc4.DynamicBytes) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_address(value: arc4.Address) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_account(value: Account) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_bool_arr(value: arc4.DynamicArray<arc4.Bool>) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_bool_arr3(value: arc4.StaticArray<arc4.Bool, 3>) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_static_tuple(value: ARC4StaticTuple) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_dynamic_tuple(value: ARC4DynamicTuple) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_static_struct(value: ARC4StaticStruct) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_dynamic_struct(value: ARC4DynamicStruct) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_static_struct_arr(value: arc4.DynamicArray<ARC4StaticStruct>) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_static_struct_arr3(value: arc4.StaticArray<ARC4StaticStruct, 3>) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_dynamic_struct_arr(value: arc4.DynamicArray<ARC4DynamicStruct>) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_dynamic_struct_arr3(value: arc4.StaticArray<ARC4DynamicStruct, 3>) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_dynamic_struct_with_a_bool(value: WithABool) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_native_static_struct(value: NativeStaticStruct) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_native_dynamic_struct(value: NativeDynamicStruct) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_native_static_struct_arr(value: Array<NativeStaticStruct>) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_native_static_struct_arr3(value: FixedArray<NativeStaticStruct, 3>) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_native_dynamic_struct_arr(value: NativeDynamicStruct[]) {
    validate(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_native_dynamic_struct_arr3(value: FixedArray<NativeDynamicStruct, 3>) {
    validate(value)
  }
}
