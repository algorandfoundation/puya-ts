import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { BaseContract, Uint64 } from '@algorandfoundation/algorand-typescript'

function test() {
  return [Uint64(), Uint64(0), Uint64('1'), Uint64(1n), Uint64(true)] as const
}

function test2() {
  const x = Uint64(123)
  const y = Uint64(x * 100)
}

class DemoContract extends BaseContract {
  public approvalProgram(): uint64 {
    test2()
    return test().length
  }
}
