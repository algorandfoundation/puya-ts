import type { bytes } from '@algorandfoundation/algorand-typescript'
import { assert, Box, BoxMap, BoxRef, Bytes } from '@algorandfoundation/algorand-typescript'

const boxA = Box<string>({ key: Bytes('A') })
function testBox(box: Box<string>, value: string) {
  box.value = value
  boxA.value = value

  assert(box.value === boxA.value)

  assert(box.exists && boxA.exists)

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

  assert(box.get(key) === boxMap.get(key))

  box.delete(key)

  assert(box.get(`${key}x`, { default: Bytes('b') }) === boxMap.get(`${key}x`, { default: Bytes('b') }))
}

const boxRef = BoxRef({ key: 'abc' })

function testBoxRef(box: BoxRef) {
  const someBytes = Bytes.fromHex('FFFFFFFF')
  box.put(someBytes)
  boxRef.put(someBytes)
  box.splice(1, 2, Bytes.fromHex('00'))
  boxRef.splice(1, 2, Bytes.fromHex('00'))
  assert(box.value === Bytes.fromHex('FF00FFFF'))
}
