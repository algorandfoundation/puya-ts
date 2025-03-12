import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, BaseContract, Box, BoxMap, BoxRef, Bytes, Txn } from '@algorandfoundation/algorand-typescript'
import { itob } from '@algorandfoundation/algorand-typescript/op'

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
