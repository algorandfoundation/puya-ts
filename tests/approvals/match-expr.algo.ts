import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, assertMatch, Contract, match } from '@algorandfoundation/algorand-typescript'

class MatchExprAlgo extends Contract {
  public testMatches(x: uint64) {
    const xObj = { x }
    assertMatch(xObj, { x: 5 }, 'x should be 5')

    assert(match(xObj, { x: { greaterThan: 4 } }))
    assert(match(xObj, { x: { lessThan: 6 } }))
    assert(match(xObj, { x: { greaterThanEq: 5 } }))
    assert(match(xObj, { x: { lessThanEq: 5 } }))

    const xArray = [x]

    assert(match(xArray, [5]))
    assert(match(xArray, [{ greaterThan: 4 }]))
    assert(match(xArray, [{ lessThan: 6 }]))
    assert(match(xArray, [{ greaterThanEq: 5 }]))
    assert(match(xArray, [{ lessThanEq: 5 }]))
  }
}
