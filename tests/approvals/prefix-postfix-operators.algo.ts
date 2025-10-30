import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, Bytes, Contract } from '@algorandfoundation/algorand-typescript'
import { bzero } from '@algorandfoundation/algorand-typescript/op'

function test_uint64(x: uint64, y: uint64) {
  assert(x === 10, 'x input must be 10')
  assert(y === 5, 'y input must be 5')
  x++
  assert(x === 11)
  x--
  assert(x === 10)
  x -= --y
  assert(x === 6)
  assert(y === 4)
  x += y++
  assert(x === 10)
  assert(y === 5)
  const inverted: uint64 = ~y
  assert(inverted === 2 ** 64 - 1 - y)
  /*
  00001010
  11110101 = 245
   */
  //

  assert(y)
  assert(!!y)
  return !y
}
function test_biguint(x: biguint, y: biguint) {
  assert(x === 10n, 'x input must be 10')
  assert(y === 5n, 'y input must be 5')

  x++
  assert(x === 11n)

  x--

  assert(x === 10n)
  x -= --y
  assert(y === 4n)
  assert(x === 6n)
  x += y++
  assert(y === 5n)
  assert(x === 10n)
  assert(y)
  assert(!!y)
  return !y
}
function test_bytes(x: bytes) {
  assert(x === bzero(4), 'x must be 4 unset bytes')
  const y = x.bitwiseInvert()

  assert(y === Bytes.fromHex('FFFFFFFF'))
}

export class DemoContract extends Contract {
  test() {
    test_uint64(10, 5)
    test_biguint(10n, 5n)

    test_bytes(bzero(4))

    return true
  }
}
