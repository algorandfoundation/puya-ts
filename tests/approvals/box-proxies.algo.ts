import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, BaseContract, Box, BoxMap, BoxRef, Bytes, Txn } from '@algorandfoundation/algorand-typescript'
import { itob } from '@algorandfoundation/algorand-typescript/op'

const boxA = Box<string>({ key: Bytes('A') })
function testBox(box: Box<string>, value: string) {
  box.value = value
  boxA.value = value

  assert(box.value === boxA.value)

  assert(box.exists && boxA.exists)

  assert(box.length)

  box.delete()
  boxA.delete()
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
  box.set(key, value)
  boxMap.set(key, value)

  assert(box.length(key))

  assert(box.maybe(key)[1])

  assert(box.get(key) === boxMap.get(key))

  box.delete(key)

  assert(box.get(`${key}x`, { default: Bytes('b') }) === boxMap.get(`${key}x`, { default: Bytes('b') }))
}

const boxRef = BoxRef({ key: 'abc' })

function testBoxRef(box: BoxRef, length: uint64) {
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

  const maybeBox = box.maybe()
  assert(maybeBox[1])

  assert(box.value === Bytes.fromHex('FFFFFFFF'))
  box.splice(1, 1, Bytes.fromHex('00'))
  assert(box.value === Bytes.fromHex('FF00FFFF'))
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
