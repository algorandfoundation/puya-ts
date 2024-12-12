import { assert, BaseContract, BigUint, Bytes, Uint64 } from '@algorandfoundation/algorand-typescript'

function test_truthyness() {
  assert(!0, 'Zero is falsy')
  assert(1, 'Non zero is truthy')
  assert(!Uint64(0), 'Zero is falsy')
  assert(Uint64(1), 'Non zero is truthy')
  assert(!BigUint(0), 'Zero is falsy')
  assert(BigUint(1), 'Non zero is truthy')
  assert(!Bytes(), 'Empty is falsy')
  assert(Bytes('abc'), 'Non empty is truthy')
  const empty = ''
  assert(!empty, 'Empty is falsy')
  assert('abc', 'Non empty is truthy')
  assert(!false, 'False is falsy')
  assert(true, 'True is truthy')
}

function test_booleans_are_equal() {
  // eslint-disable-next-line no-constant-binary-expression
  assert(Boolean(1) === Boolean(5))
  assert(Boolean(Uint64(1)) === Boolean(Uint64(5)))
  assert(Boolean(BigUint(1)) === Boolean(BigUint(5)))
  assert(Boolean(Bytes('abc')) === Boolean(Bytes('abcdef')))
  // eslint-disable-next-line no-constant-binary-expression
  assert(Boolean('abc') === Boolean('abcdef'))

  const boolNoArgs = Boolean()
  assert(!boolNoArgs)
}

export class BooleanConversionsAlgo extends BaseContract {
  approvalProgram(): boolean {
    test_truthyness()
    test_booleans_are_equal()
    return true
  }
}
