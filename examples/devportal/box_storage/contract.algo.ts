import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { arc4, assert, Box, BoxMap, Bytes, clone, Contract, Global, Txn, Uint64, urange } from '@algorandfoundation/algorand-typescript'

type StaticInts = arc4.StaticArray<arc4.Uint8, 4>

// example: INIT_BOX_STORAGE_STRUCT
// An ARC-4 struct stored as the value type of a BoxMap.
class UserStruct extends arc4.Struct<{
  name: arc4.Str
  id: arc4.Uint64
  asset: arc4.Uint64
}> {}
// example: INIT_BOX_STORAGE_STRUCT

// A nested Struct with a dynamic array inside it.
type InnerStruct = {
  c: uint64
  arr: uint64[]
  d: uint64
}

// Composition of Structs, including an Array of Structs.
type NestedStruct = {
  a: uint64
  inner: InnerStruct
  siblings: InnerStruct[]
  b: uint64
}

export class BoxStorage extends Contract {
  // example: INIT_BOX_STORAGE
  // Box<T> holds a single value of type T; every box needs an explicit key.
  boxInt = Box<uint64>({ key: 'boxInt' })
  // A key can be given as a string or as raw bytes.
  boxDynamicBytes = Box<arc4.DynamicBytes>({ key: 'b' })
  boxString = Box<arc4.Str>({ key: Bytes('BOX_STRING') })
  boxBytes = Box<bytes>({ key: Bytes('BOX_BYTES') })
  // BoxMap<K, V> is a family of boxes keyed by K with values of type V.
  boxMap = BoxMap<uint64, string>({ keyPrefix: '' })
  // A BoxMap whose value is a Struct.
  boxMapStruct = BoxMap<uint64, UserStruct>({ keyPrefix: 'users' })
  // Boxes can also hold a non-ARC-4 Struct, including nested ones with
  // dynamic arrays inside.
  boxNested = Box<NestedStruct>({ key: 'boxNested' })
  // example: INIT_BOX_STORAGE

  // example: GET_BOX_STORAGE
  public getBox(): uint64 {
    // `.value` reads the current contents; fails if the box does not exist.
    return this.boxInt.value
  }

  public getItemBoxMap(key: uint64): string {
    // Calling a BoxMap reads the box for `key`; fails if it does not exist.
    return this.boxMap(key).value
  }

  public getBoxMap(): string {
    // `.get({ default: ... })` returns the default when the box does not exist.
    return this.boxMap(1).get({ default: 'default' })
  }

  public maybeBox(): readonly [uint64, boolean] {
    // `.maybe()` returns `(value, exists)`; `value` is undefined when exists is false.
    return this.boxInt.maybe()
  }

  public maybeBoxMap(): readonly [string, boolean] {
    const [value, exists] = this.boxMap(1).maybe()
    return [exists ? value : '', exists] as const
  }

  // example: GET_BOX_STORAGE

  // example: GET_BOX_STORAGE_EXAMPLE
  public getBoxExample(): readonly [uint64, bytes, arc4.Str] {
    return [this.boxInt.value, this.boxDynamicBytes.value.native, this.boxString.value] as const
  }

  public getBoxMapStruct(key: uint64): UserStruct {
    return clone(this.boxMapStruct(key).value)
  }

  public readBoxPassedToSubroutine(key: uint64): string {
    // Box and BoxMap proxies can be passed to subroutines.
    return getBoxMapValueFromKeyPlus1(this.boxMap, key)
  }

  // example: GET_BOX_STORAGE_EXAMPLE

  // example: SET_BOX_STORAGE
  public setBox(value: uint64): void {
    this.boxInt.value = value
  }

  public setBoxMap(key: uint64, value: string): void {
    this.boxMap(key).value = value
  }

  public setBoxMapStruct(key: uint64, value: UserStruct): boolean {
    // ARC-4 Structs are reference-like; `clone()` is required when assigning
    // to storage so the box owns its own bytes.
    this.boxMapStruct(key).value = clone(value)
    assert(this.boxMapStruct(key).value.bytes === value.bytes, 'stored struct must round-trip')
    return true
  }

  // example: SET_BOX_STORAGE

  // example: SET_BOX_STORAGE_EXAMPLE
  public setBoxExample(valueInt: uint64, valueDbytes: arc4.DynamicBytes, valueString: arc4.Str): void {
    this.boxInt.value = valueInt
    this.boxDynamicBytes.value = clone(valueDbytes)
    this.boxString.value = valueString
    this.boxBytes.value = valueDbytes.native

    // Boxes support in-place mutation via augmented assignment.
    this.boxInt.value += 3
  }

  // example: SET_BOX_STORAGE_EXAMPLE

  // example: DELETE_BOX_STORAGE
  public deleteBox(): void {
    // `.delete()` removes the box entirely.
    this.boxInt.delete()
    this.boxDynamicBytes.delete()
    this.boxString.delete()

    // After deletion, `.get({ default: ... })` returns the default.
    assert(this.boxInt.get({ default: Uint64(42) }) === 42, 'box_int must be deleted')
    assert(
      this.boxDynamicBytes.get({ default: new arc4.DynamicBytes(Bytes('42')) }).native === Bytes('42'),
      'box_dynamic_bytes must be deleted',
    )
    assert(this.boxString.get({ default: new arc4.Str('42') }).native === '42', 'box_string must be deleted')
  }

  public deleteBoxMap(key: uint64): void {
    this.boxMap(key).delete()
  }

  // example: DELETE_BOX_STORAGE

  // example: LENGTH_BOX_STORAGE
  public boxIntLength(): uint64 {
    // `.length` is the size in bytes of the stored value.
    return this.boxInt.length
  }

  public boxMapLength(key: uint64): uint64 {
    if (!this.boxMap(key).exists) {
      return Uint64(0)
    }
    return this.boxMap(key).length
  }

  public boxMapStructLength(): boolean {
    const key: uint64 = 0
    const value = new UserStruct({ name: new arc4.Str('testName'), id: new arc4.Uint64(70), asset: new arc4.Uint64(2) })

    this.boxMapStruct(key).value = clone(value)
    // The on-chain length matches the encoded byte length of the struct.
    assert(this.boxMapStruct(key).value.bytes.length === value.bytes.length, 'stored struct must have the same encoded length')
    assert(this.boxMapStruct(key).length === value.bytes.length, 'box length must match the encoded length')
    return true
  }

  // example: LENGTH_BOX_STORAGE

  // example: EXTRACT_BOX
  public extractBox(): void {
    // An ad-hoc Box<bytes> is useful for low-level byte slicing.
    const box = Box<bytes>({ key: 'blob' })
    // `.create({ size: n })` allocates a zero-filled box; true means newly created.
    assert(box.create({ size: Uint64(32) }), 'box must not exist yet')

    // Addresses are 32 bytes long.
    const senderBytes = Txn.sender.bytes
    const appAddress = Global.currentApplicationAddress.bytes
    const value3 = Bytes('hello')
    // `.replace(offset, value)` overwrites bytes in place.
    box.replace(0, senderBytes)
    // `.resize(size)` grows (zero-padding the end) or shrinks the box;
    // `.splice` cannot grow a box, so resize first to make room.
    box.resize(32 * 2 + value3.length)
    // `.splice(offset, drop, value)` shifts bytes within the fixed-size box:
    // here it inserts `appAddress` at the front, pushing the existing content
    // right; bytes past the box length are dropped.
    box.splice(0, 0, appAddress)
    box.replace(64, value3)
    // `.extract(offset, length)` returns a slice without mutation.
    const prefix = box.extract(0, 32 * 2 + value3.length)
    assert(prefix === appAddress.concat(senderBytes).concat(value3), 'unexpected box contents')
    box.delete()
  }

  // example: EXTRACT_BOX

  // example: OTHER_OPS_BOX
  public existBox(): readonly [boolean, boolean, boolean, boolean] {
    // `.exists` is true if the box exists.
    return [this.boxInt.exists, this.boxDynamicBytes.exists, this.boxString.exists, this.boxBytes.exists] as const
  }

  public sliceBox(): void {
    const box0 = Box<bytes>({ key: 'scratch' })
    box0.value = Bytes('Testing testing 123')
    assert(box0.value.slice(0, 7) === Bytes('Testing'), 'box value must support slicing')

    this.boxString.value = new arc4.Str('Hello')
    // `.value.bytes` exposes the raw encoded bytes of an ARC-4 value
    // (an arc4.Str is prefixed with its 2-byte length).
    assert(this.boxString.value.bytes.slice(2, 10) === Bytes('Hello'), 'unexpected string contents')
    box0.delete()
  }

  public arc4Box(): void {
    const boxD = Box<StaticInts>({ key: Bytes('d') })
    boxD.value = new arc4.StaticArray(new arc4.Uint8(0), new arc4.Uint8(1), new arc4.Uint8(2), new arc4.Uint8(3))

    assert(boxD.value[0].asUint64() === 0, 'first element must be 0')
    assert(boxD.value[3].asUint64() === 3, 'last element must be 3')
    boxD.delete()
  }

  public keyBox(): bytes {
    return this.boxInt.key
  }

  public keyBoxExample(): void {
    assert(this.boxDynamicBytes.key === Bytes('b'), 'key must match the explicit str key')
    assert(this.boxString.key === Bytes('BOX_STRING'), 'key must match the explicit bytes key')
    assert(this.boxBytes.key === Bytes('BOX_BYTES'), 'key must match the explicit bytes key')
  }

  // example: OTHER_OPS_BOX

  // example: OTHER_OPS_BOX_MAP
  public boxMapExists(key: uint64): boolean {
    // `.exists` is true if the box for `key` exists.
    return this.boxMap(key).exists
  }

  public boxMapStructExists(key: uint64): boolean {
    return this.boxMapStruct(key).exists
  }

  public keyPrefixBoxMap(): bytes {
    return this.boxMap.keyPrefix
  }

  // example: OTHER_OPS_BOX_MAP

  // example: NESTED_STRUCT_BOX
  public nestedStructWrite(value: uint64): void {
    // Boxes can hold Structs whose fields are themselves Structs or Arrays.
    // Field assignment writes through to the underlying box bytes.
    this.boxNested.value = {
      a: value,
      inner: { c: value + 1, arr: [], d: value + 2 },
      siblings: [],
      b: value + 3,
    }
    for (const i of urange(3)) {
      this.boxNested.value.inner.arr.push(i)
    }
  }

  public nestedStructSum(): uint64 {
    let total: uint64 = this.boxNested.value.a + this.boxNested.value.b
    total += this.boxNested.value.inner.c + this.boxNested.value.inner.d
    for (const value of this.boxNested.value.inner.arr) {
      total += value
    }
    return total
  }

  // example: NESTED_STRUCT_BOX
}

// BoxMap proxies are first-class values and can be passed to subroutines.
function getBoxMapValueFromKeyPlus1(boxMap: BoxMap<uint64, string>, key: uint64): string {
  return boxMap(key + 1).value
}
