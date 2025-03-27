import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assertMatch, Contract, ensureBudget, err } from '@algorandfoundation/algorand-typescript'
import { addw, divmodw, mulw } from '@algorandfoundation/algorand-typescript/op'

type Uint128 = readonly [uint64, uint64]

function add([a_h, a_l]: Uint128, [b_h, b_l]: Uint128): Uint128 {
  const [high, low] = addw(a_l, b_l)
  return [high + a_h + b_h, low]
}

function twosComp(n: uint64): uint64 {
  return addw(~n, 1)[1]
}

function sub([a_h, a_l]: Uint128, [b_h, b_l]: Uint128): Uint128 {
  const [ol, resl] = addw(a_l, twosComp(b_l))

  const [oh, resh] = addw(a_h, twosComp(b_h))
  if (resh > a_h) {
    err('u128 underflow')
  }

  if (resl > a_l) {
    return sub([resh, resl], [1, 0])
  }

  return [resh, resl]
}

function mul([a_h, a_l]: Uint128, [b_h, b_l]: Uint128): Uint128 {
  if (a_h && b_h) {
    err('u128 overflow')
  }
  const a_l_m = mulw(a_l, b_l)

  return [a_h * b_l + a_l_m[0] * b_h * a_l, a_l_m[1]]
}

function div([a_h, a_l]: Uint128, [b_h, b_l]: Uint128): Uint128 {
  const [r_h, r_l] = divmodw(a_h, a_l, b_h, b_l)
  return [r_h, r_l]
}

class WideMath extends Contract {
  test() {
    ensureBudget(2000)
    const u64max: Uint128 = [0, 2 ** 64 - 1]
    const one: Uint128 = [0, 1]

    const u128MaxMinOne: Uint128 = [2 ** 64 - 1, 2 ** 64 - 2]
    const u128Max: Uint128 = [2 ** 64 - 1, 2 ** 64 - 1]

    assertMatch(add(one, one), [0, 2])
    assertMatch(add(u64max, one), [1, 0])
    assertMatch(add(u128MaxMinOne, one), u128Max)

    assertMatch(sub(one, one), [0, 0])
    assertMatch(sub([1, 0], one), u64max)
    assertMatch(sub([1, 1], [0, 2]), u64max)
    assertMatch(sub(u128Max, u128Max), [0, 0])
    assertMatch(sub(u64max, u64max), [0, 0])

    assertMatch(mul(one, one), one)
    assertMatch(mul([1, 0], [0, 2]), [2, 0])
    assertMatch(mul([1, 0], u64max), [2 ** 64 - 1, 0])

    assertMatch(div([128, 0], [0, 2]), [64, 0])
    assertMatch(div(mulw(545, 239239329), [0, 239239329]), [0, 545])
  }
}
