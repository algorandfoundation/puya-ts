import { uint64, bytes, assert, Uint64, Bytes, BigUint } from '@algorandfoundation/algo-ts'

function test_truthyness(a: uint64, b: uint64, c: string, d: bytes, e: uint64) {
  assert(!0, 'Zero is falsy')
  assert(1, 'Non zero is truthy')
  assert(!Uint64(0), 'Zero is falsy')
  assert(Uint64(1), 'Non zero is truthy')
  assert(!BigUint(0), 'Zero is falsy')
  assert(BigUint(1), 'Non zero is truthy')
  assert(!Bytes(), 'Empty is falsy')
  assert(Bytes('abc'), 'Non empty is truthy')
  assert(!'', 'Empty is falsy')
  assert('abc', 'Non empty is truthy')
  assert(!false, 'False is falsy')
  assert(true, 'True is truthy')
}

function test_booleans_are_equal() {
  assert(Boolean(1) === Boolean(5))
  assert(Boolean(Uint64(1)) === Boolean(Uint64(5)))
  assert(Boolean(BigUint(1)) === Boolean(BigUint(5)))
  assert(Boolean(Bytes('abc')) === Boolean(Bytes('abcdef')))
  assert(Boolean('abc') === Boolean('abcdef'))
}
