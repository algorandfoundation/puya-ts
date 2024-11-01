import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, BaseContract, Bytes, Uint64 } from '@algorandfoundation/algorand-typescript'

const a = Bytes('123')

class ShadowedVariablesAlgo extends BaseContract {
  public approvalProgram(): boolean {
    const [b, u, f] = this.getValues()
    assert(a === b, 'a should be module const (bytes)')
    {
      const a = u
      assert(a === 123, 'a should be local const (uint)')
      {
        let a = f
        assert(!a, 'a should be local let (bool)')
        {
          a = !a
          assert(a, 'a should be modified local let (bool)')
        }
        assert(a, 'a should still be modified local let (bool)')
      }
      assert(a === 123, 'a should be local const (uint)')
    }
    assert(a === Bytes('123'), 'a should be module const (bytes)')
    return true
  }

  private getValues(): [bytes, uint64, boolean] {
    return [a, Uint64(123), false]
  }
}
