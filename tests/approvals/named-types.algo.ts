import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assertMatch, Contract, Uint64 } from '@algorandfoundation/algorand-typescript'

type XY = {
  x: uint64
  y: uint64
}

type YX = {
  y: uint64
  x: uint64
}

export class MyContract extends Contract {
  public getXY(): XY {
    return {
      x: 1,
      y: 2,
    }
  }

  public getYX(): YX {
    return {
      x: 222,
      y: 111,
    }
  }

  public getAnon() {
    return {
      x: Uint64(3),
      y: Uint64(4),
    }
  }

  public test(x: XY, y: YX) {
    assertMatch(x, { ...y })
  }

  public testing() {
    const a = this.getXY()
    const b = this.getYX()
    const c = this.getAnon()
    return [a, b, c] as const
  }
}
