import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, assertMatch, Contract, Global, match, Txn } from '@algorandfoundation/algorand-typescript'

class MatchExprAlgo extends Contract {
  public testMatches(x: uint64) {
    const xObj = { x }
    assertMatch(xObj, { x: 5 }, 'x should be 5')
    assertMatch(xObj, { x: { not: 3 } }, 'x should not be 3')
    assertMatch(Txn, { sender: { not: Global.zeroAddress } })
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
