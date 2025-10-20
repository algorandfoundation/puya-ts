import { Contract, validateEncoding } from '@algorandfoundation/algorand-typescript'
import * as arc4 from '@algorandfoundation/algorand-typescript/arc4'

class ARC4StaticStruct extends arc4.Struct<{ foo: arc4.UintN64; bar: arc4.UintN8 }> {}
class ARC4DynamicStruct extends arc4.Struct<{ foo: arc4.UintN64; bar: arc4.UintN8; baz: arc4.Str }> {}
class WithABool extends arc4.Struct<{ foo: arc4.UintN8; bar: arc4.DynamicBytes; baz: arc4.Bool }> {}
type ARC4StaticTuple = arc4.Tuple<[arc4.UintN64, arc4.UintN8]>
type ARC4DynamicTuple = arc4.Tuple<[arc4.UintN64, arc4.UintN8, arc4.Str]>

class AbiValidationExhaustive extends Contract {
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_uint64(value: arc4.UintN64) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_uint8(value: arc4.UintN8) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_uint512(value: arc4.UintN<512>) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_ufixed64(value: arc4.UFixedNxM<64, 2>) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_uint8_arr(value: arc4.DynamicArray<arc4.UintN8>) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_uint8_arr3(value: arc4.StaticArray<arc4.UintN8, 3>) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_bool(value: arc4.Bool) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_byte(value: arc4.Byte) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_string(value: arc4.Str) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_bytes(value: arc4.DynamicBytes) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_address(value: arc4.Address) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_account(value: arc4.Address) {
    validateEncoding(value.native)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_bool_arr(value: arc4.DynamicArray<arc4.Bool>) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_bool_arr3(value: arc4.StaticArray<arc4.Bool, 3>) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_static_tuple(value: ARC4StaticTuple) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_dynamic_tuple(value: ARC4DynamicTuple) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_static_struct(value: ARC4StaticStruct) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_dynamic_struct(value: ARC4DynamicStruct) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_static_struct_arr(value: arc4.DynamicArray<ARC4StaticStruct>) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_static_struct_arr3(value: arc4.StaticArray<ARC4StaticStruct, 3>) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_dynamic_struct_arr(value: arc4.DynamicArray<ARC4DynamicStruct>) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_dynamic_struct_arr3(value: arc4.StaticArray<ARC4DynamicStruct, 3>) {
    validateEncoding(value)
  }
  @arc4.abimethod({ validateEncoding: 'unsafe-disabled' })
  validate_dynamic_struct_with_a_bool(value: WithABool) {
    validateEncoding(value)
  }
}
