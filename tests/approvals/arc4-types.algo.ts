import { DynamicArray, StaticArray, UintN } from '@algorandfoundation/algo-ts/arc4'
import type { biguint, uint64 } from '@algorandfoundation/algo-ts'
import { BaseContract } from '@algorandfoundation/algo-ts'
import { undefined } from 'zod'

function test(n: uint64, b: biguint, c: UintN<256>) {
  const x = new UintN<8>(4)
  const x2 = new UintN<8>(255n)
  const y = new UintN<16>()
  const z = new UintN<8>(n)
  const z_native = z.native
  const a = new UintN<128>(b)
  const a_native = a.native
}

type ARC4Uint64 = UintN<64>

function test_arrays(n: ARC4Uint64) {
  const myArray = new DynamicArray(n, n, n)

  const myStatic = new StaticArray(n, n)

  const myStatic2 = new StaticArray<ARC4Uint64, 3>(n, n, n)
}

export class Arc4TypesTestContract extends BaseContract {
  public approvalProgram(): boolean {
    test(1, 2n, new UintN<256>(4))
    test_arrays(new UintN<64>(65))

    return true
  }
}
