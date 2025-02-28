import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, Bytes, Contract, GlobalState, Uint64 } from '@algorandfoundation/algorand-typescript'

export class DemoContract extends Contract {
  run() {
    assert(this.test_uint64(1) === 3)
    assert(this.test_uint64(2) === 3)
    assert(this.test_uint64(3) === 1)
    assert(this.test_uint64(4) === 3)

    assert(this.test_break(1) === 11)
    assert(this.test_break(2) === 12)
    assert(this.test_break(3) === 10)
    assert(this.test_break(4) === 14)
    assert(this.test_break(5) === 50)

    assert(this.test_bytes(Bytes('hmmm')))
    assert(this.test_bytes(Bytes.fromHex('ff')))
    assert(this.test_bytes(Bytes.fromBase64('ZHNmc2Rmc2Q=')))
    assert(this.test_bytes(Bytes.fromBase32('ONSGMZ3OMJTGOZDGMRSGM===')))
    assert(!this.test_bytes(Bytes()))
  }

  private test_uint64(x: uint64): uint64 {
    switch (x) {
      case 1:
      case 2:
      case Uint64(4):
        return 3
      default: {
        return 1
      }
    }
  }

  private test_break(x: uint64): uint64 {
    let i: uint64 = 10
    switch (x) {
      case 1:
      case 2:
      case Uint64(4):
        i += x
        break
      case 5:
        i *= x
    }
    return i
  }

  private test_bytes(x: bytes): boolean {
    switch (x) {
      case Bytes('hmmm'):
      case Bytes.fromHex('Ff'):
      case Bytes.fromBase64('ZHNmc2Rmc2Q='):
      case Bytes.fromBase32('ONSGMZ3OMJTGOZDGMRSGM==='):
        return true
    }
    return false
  }

  evalCount = GlobalState<uint64>()

  private increaseEvalAndReturn(n: uint64) {
    this.evalCount.value++
    return n
  }

  public test_side_effects(n: uint64) {
    this.evalCount.value = 0

    switch (n) {
      case this.increaseEvalAndReturn(n - 1):
        break
      case this.increaseEvalAndReturn(n):
        break
      case this.increaseEvalAndReturn(n + 1):
        break
    }

    assert(this.evalCount.value === 2, 'Only two functions should be evaluated')
  }

  public test_non_trivial_termination_of_clause(n: uint64, y: uint64): uint64 {
    switch (n) {
      case 1:
        if (y % 2 === 0) {
          return y
        } else {
          return n
        }
      default:
        return y * n
    }
  }
}
