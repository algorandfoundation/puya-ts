import type { Account, bytes, FixedArray, uint64 } from '@algorandfoundation/algorand-typescript'
import {
  arc4,
  assert,
  BaseContract,
  Box,
  BoxMap,
  BoxRef,
  Bytes,
  clone,
  Contract,
  ensureBudget,
  Txn,
  Uint64,
} from '@algorandfoundation/algorand-typescript'
import type { Address, Bool, DynamicArray, StaticArray, Tuple, Uint32 } from '@algorandfoundation/algorand-typescript/arc4'
import { sizeOf, Uint8 } from '@algorandfoundation/algorand-typescript/arc4'
import { Global, itob } from '@algorandfoundation/algorand-typescript/op'

const boxA = Box<string>({ key: Bytes('A') })

function testBox(box: Box<string>, value: string) {
  box.value = value
  boxA.value = value

  assert(box.key === Bytes('one'))
  assert(boxA.key === Bytes('A'))

  assert(box.value === boxA.value)

  assert(box.exists && boxA.exists)

  assert(box.length)

  assert(box.delete(), 'delete failed')
  const isBoxADeleted = boxA.delete()
  assert(isBoxADeleted, 'delete failed')
  assert(!box.exists && !boxA.exists)

  const defaultVal = 'O'
  assert(boxA.get({ default: defaultVal }) === box.get({ default: defaultVal }))

  let [, e] = box.maybe()
  assert(!e)
  box.value = value
  ;[, e] = box.maybe()
  assert(e)
}

const boxMap = BoxMap<string, bytes>({ keyPrefix: '' })

function testBoxMap(box: BoxMap<string, bytes>, key: string, value: bytes) {
  box(key).value = value
  boxMap(key).value = value

  const boxMapItem = boxMap(key)

  assert(boxMapItem.exists)

  assert(box.keyPrefix === Bytes('two'))
  assert(boxMap.keyPrefix === Bytes(''))

  assert(box(key).length)

  assert(box(key).maybe()[1])

  assert(box(key).value === boxMap(key).value)

  const isBoxDeleted = box(key).delete()
  assert(isBoxDeleted, 'delete failed')

  assert(box(`${key}x`).get({ default: Bytes('b') }) === boxMap(`${key}x`).get({ default: Bytes('b') }))
}

const boxRef = BoxRef({ key: 'abc' })

function testBoxRef(box: BoxRef, length: uint64) {
  assert(box.key === Bytes('three'))
  assert(boxRef.key === Bytes('abc'))

  if (!boxRef.exists) {
    boxRef.create({ size: 1000 })
  } else if (boxRef.length !== length) {
    boxRef.resize(length)
  }
  if (box.exists) {
    box.resize(4)
  } else {
    box.create({ size: 4 })
  }
  const someBytes = Bytes.fromHex('FFFFFFFF')
  box.put(someBytes)

  assert(box.get({ default: Bytes() }) === Bytes.fromHex('FFFFFFFF'))

  const maybeBox = box.maybe()
  assert(maybeBox[1])

  assert(box.value === Bytes.fromHex('FFFFFFFF'))
  box.splice(1, 1, Bytes.fromHex('00'))
  assert(box.value === Bytes.fromHex('FF00FFFF'))

  const x = box.delete()
  assert(x, 'delete failed')
  assert(!box.exists)
}

export class BoxContract extends BaseContract {
  boxOne = Box<string>({ key: 'one' })
  boxMapTwo = BoxMap<string, bytes>({ keyPrefix: 'two' })
  boxRefThree = BoxRef({ key: 'three' })

  approvalProgram(): boolean {
    if (Txn.applicationId.id !== 0) {
      testBox(this.boxOne, 'aaaaaargh')

      testBoxMap(this.boxMapTwo, 'what?', itob(256456))

      testBoxRef(this.boxRefThree, 99)
    }
    return true
  }
}

class BoxNotExist extends BaseContract {
  approvalProgram(): boolean {
    if (Txn.applicationId.id !== 0) {
      switch (Txn.applicationArgs(0).toString()) {
        case 'box':
          return Box<boolean>({ key: 'abc' }).value
        case 'boxmap':
          return BoxMap<string, boolean>({ keyPrefix: 'a' })('bc').value
        case 'createbox':
          Box<boolean>({ key: 'abc' }).value = true
          return true
      }
    }
    return true
  }
}

class BoxCreate extends Contract {
  boxBool = Box<boolean>({ key: 'bool' })
  boxArc4Bool = Box<Bool>({ key: 'arc4b' })
  boxStr = Box<string>({ key: 'a' })
  boxUint = Box<uint64>({ key: 'b' })
  boxStaticArray = Box<StaticArray<Uint32, 10>>({ key: 'c' })
  boxDynamicArray = Box<DynamicArray<Uint8>>({ key: 'd' })
  boxTuple = Box<Tuple<[Uint8, Uint8, Bool, Bool]>>({ key: 'e' })

  createBoxes() {
    this.boxStr.create({ size: 10 })
    assert(this.boxStr.length === 10)
    this.boxUint.create()
    assert(this.boxUint.length === 8)
    this.boxStaticArray.create()
    assert(this.boxStaticArray.length === (32 / 8) * 10)
    this.boxDynamicArray.create({ size: 2 })
    assert(this.boxDynamicArray.length === 2)
    this.boxTuple.create()
    assert(this.boxTuple.length === 3)
    this.boxBool.create()
    assert(this.boxBool.length === 8)
    this.boxArc4Bool.create()
    assert(this.boxArc4Bool.length === 1)
  }
}

class BoxMapTest extends Contract {
  bmap = BoxMap<Account, string>({ keyPrefix: '' })
}

type BoxMap2 = { a: string; b: bytes; c: boolean }

class TupleBox extends Contract {
  box1 = Box<[string, bytes, boolean]>({ key: 't1' })
  box2 = Box<{ a: string; b: bytes; c: boolean }>({ key: 't2' })
  boxMap1 = BoxMap<string, [string, bytes, boolean]>({ keyPrefix: 'tm1' })
  boxMap2 = BoxMap<string, BoxMap2>({ keyPrefix: 'tm2' })

  testBox() {
    this.box1.create({ size: 10 })
    this.box2.create({ size: 20 })
    assert(this.box1.length === 10)
    assert(this.box2.length === 20)

    assert(this.box1.exists)
    assert(this.box2.exists)

    this.box1.value = ['hello', Bytes('world'), true]
    assert(this.box1.value[0] === 'hello')
    assert(this.box1.value[1].equals(Bytes('world')))
    assert(this.box1.value[2])

    this.box2.value = { a: 'hello', b: Bytes('world'), c: true }
    assert(this.box2.value.a === 'hello')
    assert(this.box2.value.b.equals(Bytes('world')))
    assert(this.box2.value.c)

    this.box1.delete()
    assert(!this.box1.exists)

    this.box2.delete()
    assert(!this.box2.exists)
  }

  testBoxMap() {
    assert(!this.boxMap1('a').exists)
    assert(!this.boxMap2('a').exists)

    this.boxMap1('a').value = ['hello', Bytes('world'), true]
    this.boxMap2('a').value = { a: 'hello', b: Bytes('world'), c: true }
    assert(this.boxMap1('a').exists)

    assert(this.boxMap1('a').value[0] === 'hello')
    assert(this.boxMap1('a').value[1].equals(Bytes('world')))
    assert(this.boxMap1('a').value[2])

    assert(this.boxMap2('a').exists)
    assert(this.boxMap2('a').value.a === 'hello')
    assert(this.boxMap2('a').value.b.equals(Bytes('world')))
    assert(this.boxMap2('a').value.c)

    this.boxMap1('b').value = ['abc', Bytes('def'), false]
    assert(this.boxMap1('b').exists)

    this.boxMap2('b').value = { a: 'abc', b: Bytes('def'), c: false }
    assert(this.boxMap2('b').exists)

    this.boxMap1('a').delete()
    assert(!this.boxMap1('a').exists)

    this.boxMap2('a').delete()
    assert(!this.boxMap2('a').exists)
  }
}

class BoxToRefTest extends Contract {
  boxMap = BoxMap<Account, StaticArray<Uint8, 4>>({ keyPrefix: '' })

  test() {
    const boxForCaller = this.boxMap(Txn.sender)

    boxForCaller.create()

    const boxRef = boxForCaller

    boxRef.replace(0, new Uint8(123).bytes)

    assert(boxForCaller.value[0].asUint64() === 123, 'First array item in box should be 123')
  }
}

class CompositeKeyTest extends Contract {
  boxMap = BoxMap<{ a: uint64; b: uint64 }, string>({ keyPrefix: '' })

  test(key: { a: uint64; b: uint64 }, val: string) {
    this.boxMap(key).value = val
  }
}

type Info = {
  account: Address
  balance: uint64
  totalRewarded: uint64
  rewardTokenBalance: uint64
  entryRound: uint64
}

export class LargeBox extends Contract {
  box = Box<FixedArray<Info, 200>>({ key: 'large' })

  test() {
    ensureBudget(7000)
    this.box.create()
    assert(this.box.length === 200 * 64, 'Box should be created with the correct size')
    assert(this.box.value.length === 200, 'Box value should be an array of 200 items')
    for (const [index, v] of this.box.value.entries()) {
      const x = clone(v)

      x.balance = index + 10

      this.box.value[index] = clone(x)

      assert(this.box.value[index].balance === index + 10)
    }
  }
}

type StaticInts = arc4.StaticArray<arc4.Uint8, 4>
type Bytes1024 = FixedArray<arc4.Byte, 1024>
type ManyInts = FixedArray<uint64, 513>

type LargeStruct = {
  a: Bytes1024
  b: Bytes1024
  c: Bytes1024
  d: Bytes1024
  e: uint64
  f: Bytes1024
  g: Bytes1024
  h: uint64
}

type FixedArrayUint64 = {
  length: arc4.Uint16
  arr: FixedArray<uint64, 4095>
}

type DynamicArrayInAStruct = {
  a: uint64
  arr: Array<uint64>
  b: uint64
  arr2: Array<uint64>
}

type FixedArrayInAStruct = {
  a: uint64
  arr_offset: arc4.Uint16
  b: uint64
  arr2_offset: arc4.Uint16
  arr: FixedArrayUint64
}

export type InnerStruct = {
  c: uint64
  arrArr: Array<Array<uint64>>
  d: uint64
}

type NestedStruct = {
  a: uint64
  inner: InnerStruct
  woah: Array<InnerStruct>
  b: uint64
}

type LargeNestedStruct = {
  padding: FixedArray<arc4.Byte, 4096>
  nested: NestedStruct
}

class Arc4BoxContract extends arc4.Contract {
  boxA = Box<uint64>({ key: 'boxA' })
  boxB = Box<arc4.DynamicBytes>({ key: 'b' })
  boxC = Box<arc4.Str>({ key: 'BOX_C' })
  boxD = Box<bytes>({ key: 'boxD' })
  boxMap = BoxMap<uint64, string>({ keyPrefix: '' })
  boxRef = Box<bytes>({ key: 'boxRef' })
  boxLarge = Box<LargeStruct>({ key: 'boxLarge' })
  manyInts = Box<ManyInts>({ key: 'manyInts' })

  dynamicBox = Box<Array<uint64>>({ key: 'dynamicBox' })
  dynamicArrStruct = Box<DynamicArrayInAStruct>({ key: 'dynamicArrStruct' })
  tooManyBools = Box<FixedArray<boolean, 33_000>>({ key: 'tooManyBools' })

  constructor() {
    super()
    assert(sizeOf<ManyInts>() > 4096, 'expected ManyInts to exceed max bytes size')
  }

  setBoxes(a: uint64, b: bytes, c: arc4.Str) {
    const dynamicBytes = new arc4.DynamicBytes(b)
    this.boxA.value = a
    this.boxB.value = dynamicBytes
    this.boxC.value = c
    this.boxD.value = dynamicBytes.native
    this.boxLarge.create()
    this.boxLarge.value.e = 42
    this.boxLarge.replace(sizeOf<Bytes1024>() * 4, new arc4.Uint64(42).bytes)

    const bValue = clone(this.boxB.value)
    assert(this.boxB.value.length === bValue.length, 'direct reference should match copy')
    this.boxA.value += 3

    // test.length
    assert(this.boxA.length === 8)
    assert(this.boxB.length === dynamicBytes.bytes.length)
    assert(this.boxC.length === c.bytes.length)
    assert(this.boxD.length === dynamicBytes.native.length)

    // test.value.bytes
    assert(this.boxC.value.bytes.at(0) === c.bytes.at(0))
    assert(this.boxC.value.bytes.at(-1) === c.bytes.at(-1))
    assert(this.boxC.value.bytes.slice(0, -1) === c.bytes.slice(0, -1))
    assert(this.boxC.value.bytes.slice(0, 2) === c.bytes.slice(0, 2))

    // test.value with Bytes type
    assert(this.boxD.value.at(0) === dynamicBytes.native.at(0))
    assert(this.boxD.value.at(-1) === dynamicBytes.native.at(-1))
    assert(this.boxD.value.slice(0, -1) === dynamicBytes.native.slice(0, -1))
    assert(this.boxD.value.slice(0, 5) === dynamicBytes.native.slice(0, 5))
    assert(this.boxD.value.slice(0, Uint64(2)) === dynamicBytes.native.slice(0, Uint64(2)))
    assert(this.boxLarge.length === sizeOf<LargeStruct>())
  }

  checkKeys() {
    assert(this.boxA.key === Bytes('boxA'), 'box a key ok')
    assert(this.boxB.key === Bytes('b'), 'box b key ok')
    assert(this.boxC.key === Bytes('BOX_C'), 'box c key ok')
    assert(this.boxLarge.key === Bytes('boxLarge'), 'box large key ok')
  }

  createManyInts() {
    this.manyInts.create()
  }

  setManyInts(index: uint64, value: uint64) {
    this.manyInts.value[index] = value
  }

  sumManyInts() {
    ensureBudget(10_500)
    let total = Uint64(0)
    for (const val of this.manyInts.value) {
      total = total + val
    }
    return total
  }

  deleteBoxes() {
    this.boxA.delete()
    this.boxB.delete()
    this.boxC.delete()
    assert(this.boxA.get({ default: Uint64(42) }) === 42)
    assert(this.boxB.get({ default: new arc4.DynamicBytes(Bytes('42')) }).native === Bytes('42'))
    assert(this.boxC.get({ default: new arc4.Str('42') }).native === '42')

    const [a, aExists] = this.boxA.maybe()
    assert(!aExists)
    assert(a === 0)
    this.boxLarge.delete()
  }
  indirectExtractAndReplace() {
    const large = clone(this.boxLarge.value)
    large.e += 1
    this.boxLarge.value = clone(large)
  }

  readBoxes(): readonly [uint64, bytes, arc4.Str, uint64] {
    return [Uint64(getBoxValuePlus1(this.boxA) - 1), this.boxB.value.native, this.boxC.value, this.boxLarge.value.e] as const
  }

  boxesExist(): readonly [boolean, boolean, boolean, boolean] {
    return [this.boxA.exists, this.boxB.exists, this.boxC.exists, this.boxLarge.exists] as const
  }

  sliceBox() {
    const box0 = Box<bytes>({ key: '0' })
    box0.value = Bytes('Testing testing 123')
    assert(box0.value.slice(0, 7) === Bytes('Testing'))

    this.boxC.value = new arc4.Str('Hello')
    assert(this.boxC.value.bytes.slice(2, 10) === Bytes('Hello'))
  }

  arc4Box() {
    const boxD = Box<StaticInts>({ key: Bytes('d') })
    boxD.value = new arc4.StaticArray(new arc4.Uint8(0), new arc4.Uint8(1), new arc4.Uint8(2), new arc4.Uint8(3))
    assert(boxD.value[0].asUint64() === 0)
    assert(boxD.value[1].asUint64() === 1)
    assert(boxD.value[2].asUint64() === 2)
    assert(boxD.value[3].asUint64() === 3)
  }

  testBoxRef() {
    // init ref, with valid key types
    const boxRef1 = Box<bytes>({ key: 'blob' })
    assert(!boxRef1.exists, 'no data')
    const boxRef2 = Box<bytes>({ key: Bytes('blob') })
    assert(!boxRef2.exists, 'no data')

    // create
    assert(boxRef1.create({ size: Uint64(32) }))
    assert(boxRef1.exists, 'has data')
    // manipulate data
    const senderBytes = Txn.sender.bytes
    const appAddress = Global.currentApplicationAddress.bytes
    const value3 = Bytes('hello')
    boxRef1.replace(0, senderBytes)
    boxRef1.resize(8000)
    boxRef1.splice(0, 0, appAddress)
    boxRef1.replace(64, value3)
    const prefix = boxRef1.extract(0, 32 * 2 + value3.length)
    assert(prefix === appAddress.concat(senderBytes).concat(value3))
    // delete
    boxRef1.delete()
    assert(boxRef1.key === Bytes('blob'))
    // query
    const [value, exists] = boxRef1.maybe()
    assert(!exists)
    assert(value === Bytes(''))
    assert(boxRef1.get({ default: senderBytes }) === senderBytes)
    // update
    boxRef1.value = senderBytes.concat(appAddress)
    assert(boxRef1.exists, 'Blob exists')
    assert(boxRef1.length === 64)
    assert(getBoxRefLength(boxRef1) === 64)
    // instance box ref
    this.boxRef.create({ size: Uint64(32) })
    assert(this.boxRef.exists, 'has data')
    this.boxRef.delete()
  }

  createBools() {
    this.tooManyBools.create()
  }

  setBool(index: uint64, value: boolean) {
    this.tooManyBools.value[index] = value
  }

  sumBools(stopAtTotal: uint64): uint64 {
    ensureBudget(13_000)
    let total: uint64 = 0
    for (const value of this.tooManyBools.value) {
      if (value) {
        total += 1
      }
      if (total === stopAtTotal) {
        break
      }
    }
    return total
  }
}

function getBoxValuePlus1(box: Box<uint64>): uint64 {
  return Uint64(box.value + 1)
}

function getBoxRefLength(ref: Box<bytes>): uint64 {
  return ref.length
}
