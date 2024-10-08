import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, Uint64 } from '@algorandfoundation/algorand-typescript'

type XY = {
  x: uint64
  y: uint64
}

type YX = {
  y: uint64
  x: uint64
}

/**
 * In TypeScript, objects with the same properties are considered equal regardless of declaration order however puya-ts
 * should respect the declaration order when encoding an object as an ARC4 tuple. Ie. XY should be assignable to YX but
 * when encoded as an ARC4 tuple they should be encoded as [X, Y] and [Y, X] respectively.
 *
 * TODO: This is not currently the case.
 */
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

  public testing() {
    const a = this.getXY()
    const b = this.getYX()
    const c = this.getAnon()
    return [a, b, c] as const
  }
}
