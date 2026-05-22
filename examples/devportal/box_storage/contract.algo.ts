import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { arc4, assert, Box, BoxMap, Bytes, clone, Contract, FixedArray, Global, Txn, Uint64 } from '@algorandfoundation/algorand-typescript'

type StaticInts = arc4.StaticArray<arc4.Uint8, 4>

// example: INIT_BOX_STORAGE_STRUCT
type UserStruct = {
  name: arc4.Str
  id: uint64
  asset: uint64
}

// example: INIT_BOX_STORAGE_STRUCT

type InnerStruct = {
  c: uint64
  arr: uint64[]
  d: uint64
}

type NestedStruct = {
  a: uint64
  inner: InnerStruct
  siblings: InnerStruct[]
  b: uint64
}

export class BoxStorage extends Contract {
  // example: INIT_BOX_STORAGE
  boxInt = Box<uint64>({ key: 'boxInt' })
  boxDynamicBytes = Box<arc4.DynamicBytes>({ key: 'b' })
  boxString = Box<arc4.Str>({ key: Bytes('BOX_STRING') })
  boxBytes = Box<bytes>({ key: Bytes('BOX_BYTES') })
  boxMap = BoxMap<uint64, string>({ keyPrefix: '' })
  boxMapStruct = BoxMap<uint64, UserStruct>({ keyPrefix: 'users' })
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
    // `.maybe()` returns `(value, exists)`; `value` is undefined when False.
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
    this.boxMapStruct(key).value = clone(value)
    assert(this.boxMapStruct(key).value.name === value.name)
    assert(this.boxMapStruct(key).value.id === value.id)
    assert(this.boxMapStruct(key).value.asset === value.asset)
    return true
  }

  // example: SET_BOX_STORAGE

  // example: SET_BOX_STORAGE_EXAMPLE
  public setBoxExample(valueInt: uint64, valueDbytes: arc4.DynamicBytes, valueString: arc4.Str): void {
    this.boxInt.value = valueInt
    this.boxDynamicBytes.value = valueDbytes
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
    assert(this.boxInt.get({ default: Uint64(42) }) === 42)
    assert(this.boxDynamicBytes.get({ default: new arc4.DynamicBytes(Bytes('42')) }).native === Bytes('42'))
    assert(this.boxString.get({ default: new arc4.Str('42') }).native === '42')
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
    const value: UserStruct = {
      name: new arc4.Str('testName'),
      id: 70,
      asset: 2,
    }

    this.boxMapStruct(key).value = clone(value)
    assert(this.boxMapStruct(key).length === value.name.bytes.length + 16)
    return true
  }

  // example: LENGTH_BOX_STORAGE

  // example: EXTRACT_BOX
  // example: EXTRACT_BOX_STORAGE
  public extractBox(): void {
    // An ad-hoc Box<bytes> is useful for low-level byte slicing.
    const box = Box<bytes>({ key: 'blob' })
    assert(box.create({ size: Uint64(32) }))

    const senderBytes = Txn.sender.bytes
    const appAddress = Global.currentApplicationAddress.bytes
    const value3 = Bytes('hello')
    // `.replace(offset, value)` overwrites bytes in place.
    box.replace(0, senderBytes)
    // `.resize(size)` grows or shrinks the box.
    box.resize(32 * 2 + value3.length)
    // `.splice(offset, drop, value)` shifts bytes within the fixed-size box.
    box.splice(0, 0, appAddress)
    box.replace(64, value3)
    // `.extract(offset, length)` returns a slice without mutation.
    const prefix = box.extract(0, 32 * 2 + value3.length)
    assert(prefix === appAddress.concat(senderBytes).concat(value3))
    box.delete()
  }

  // example: EXTRACT_BOX_STORAGE
  // example: EXTRACT_BOX

  // example: OTHER_OPS_BOX
  public existBox(): readonly [boolean, boolean, boolean, boolean] {
    // `.exists` is true if the box exists.
    return [this.boxInt.exists, this.boxDynamicBytes.exists, this.boxString.exists, this.boxBytes.exists] as const
  }

  public sliceBox(): void {
    const box0 = Box<bytes>({ key: 'scratch' })
    box0.value = Bytes('Testing testing 123')
    assert(box0.value.slice(0, 7) === Bytes('Testing'))

    this.boxString.value = new arc4.Str('Hello')
    // `.value.bytes` exposes the raw encoded bytes of an ARC-4 value.
    assert(this.boxString.value.bytes.slice(2, 10) === Bytes('Hello'))
    box0.delete()
  }

  public arc4Box(): void {
    const boxD = Box<StaticInts>({ key: Bytes('d') })
    boxD.value = new arc4.StaticArray(new arc4.Uint8(0), new arc4.Uint8(1), new arc4.Uint8(2), new arc4.Uint8(3))

    assert(boxD.value[0].asUint64() === 0)
    assert(boxD.value[3].asUint64() === 3)
    boxD.delete()
  }

  public keyBox(): bytes {
    return this.boxInt.key
  }

  public keyBoxExample(): void {
    assert(this.boxDynamicBytes.key === Bytes('b'))
    assert(this.boxString.key === Bytes('BOX_STRING'))
    assert(this.boxBytes.key === Bytes('BOX_BYTES'))
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
    this.boxNested.value = {
      a: value,
      inner: { c: value + 1, arr: [], d: value + 2 },
      siblings: [],
      b: value + 3,
    }

    this.boxNested.value.inner.arr.push(0)
    this.boxNested.value.inner.arr.push(1)
    this.boxNested.value.inner.arr.push(2)
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

function getBoxMapValueFromKeyPlus1(boxMap: BoxMap<uint64, string>, key: uint64): string {
  return boxMap(key + 1).value
}
