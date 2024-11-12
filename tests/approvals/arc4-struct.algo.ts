import { assert, Contract, log } from '@algorandfoundation/algorand-typescript'
import { Struct, UintN } from '@algorandfoundation/algorand-typescript/arc4'

type ARC4Uint64 = UintN<64>
const ARC4Uint64 = UintN<64>

class Vector extends Struct<{ x: ARC4Uint64; y: ARC4Uint64 }> {}

class StructDemo extends Contract {
  public testVectorCreationAndEquality() {
    const v1 = new Vector({ x: new ARC4Uint64(0), y: new ARC4Uint64(0) })
    log(v1.x)
    log(v1.y)
    const v2 = new Vector({ y: new ARC4Uint64(0), x: new ARC4Uint64(0) })
    assert(v1.equals(v2))
  }

  public addVectors(v1: Vector, v2: Vector) {
    return new Vector({
      x: new ARC4Uint64(v1.x.native + v2.x.native),
      y: new ARC4Uint64(v1.y.native + v2.y.native),
    })
  }

  // TODO: Uncomment once puya supports ARC4Decode() on structs
  // public implicitCastingAndSpreading(v1: Vector) {
  //   const v2 = new Vector(v1)
  //   const v3 = new Vector({ ...v2 })
  // }
}
