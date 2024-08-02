import type { bytes } from '@algorandfoundation/algo-ts'
import { assert, Box, BoxMap, BoxRef, Bytes } from '@algorandfoundation/algo-ts'

const boxA = Box<string>({ key: Bytes('A') })
function testBox(box: Box<string>, value: string) {
  box.value = value
  boxA.value = value

  assert(box.value === boxA.value)
}

const boxMap = BoxMap<string, bytes>({ keyPrefix: '' })

function testBoxMap(box: BoxMap<string, bytes>, key: string, value: bytes) {
  box.set(key, value)
  boxMap.set(key, value)

  assert(box.get(key) === boxMap.get(key))

  box.delete(key)

  assert(box.get(`${key}x`, { default: Bytes('b') }) === boxMap.get(`${key}x`, { default: Bytes('b') }))
}

const boxRef = BoxRef({ key: 'abc' })

function testBoxRef(box: BoxRef) {
  const someBytes = Bytes.fromHex('FFFFFFFF')
  box.put(someBytes)
  boxRef.put(someBytes)
}
