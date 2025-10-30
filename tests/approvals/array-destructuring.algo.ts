import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, assertMatch, Bytes, Contract, FixedArray, Uint64 } from '@algorandfoundation/algorand-typescript'

export class ArrayDestructuringAlgo extends Contract {
  testNested(arg: readonly [uint64, readonly [biguint, biguint]]) {
    const [a, b] = arg
    const [c, [d]] = arg
    return [a, b, c, d] as const
  }

  test() {
    const [a, b, c, d] = this.produceItems()
    const [, , e] = this.produceItems()

    let g: uint64, i: biguint
    const f = ([g, , , i] = this.produceItems())

    assert(a === 5)
    assert(b === Bytes())
    assert(!c)
    assert(d === 6n)
    assert(!e)
    assert(g === 5)
    assert(i === 6n)
    assertMatch(f, [5, Bytes(), false, 6n])

    const [x, y, z] = this.produceFixed()
  }

  private produceItems(): readonly [uint64, bytes, boolean, biguint] {
    return [5, Bytes(), false, 6n]
  }

  testLiteralDestructuring() {
    let a = Uint64(1)
    let b = Uint64(2)

    const [x, y] = ([b, a] = [a, b])

    assert(x === b)
    assert(y === a)
  }

  produceFixed(): FixedArray<uint64, 3> {
    return new FixedArray<uint64, 3>(1, 2, 3)
  }
}
