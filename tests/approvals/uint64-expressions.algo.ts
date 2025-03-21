import { assertMatch, BaseContract, Uint64 } from '@algorandfoundation/algorand-typescript'

function test() {
  return [Uint64(), Uint64(0), Uint64('1'), Uint64(1n), Uint64(true)] as const
}

function test2() {
  const x = Uint64(123)
  const y = Uint64(x * 100)
  return [x, y] as const
}

class DemoContract extends BaseContract {
  public approvalProgram(): boolean {
    assertMatch(test2(), [123, 12300])
    assertMatch(test(), [0, 0, 1, 1, 1])
    return true
  }
}
