import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { BaseContract, Uint64 } from '@algorandfoundation/algorand-typescript'

function test() {
  return [Uint64(), Uint64(0), Uint64('1'), Uint64(1n), Uint64(true)] as const
}

class DemoContract extends BaseContract {
  public approvalProgram(): uint64 {
    return test().length
  }
}
