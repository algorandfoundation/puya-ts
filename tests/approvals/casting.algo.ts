import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { BaseContract } from '@algorandfoundation/algorand-typescript'

export class CastingAlgo extends BaseContract {
  approvalProgram(): boolean {
    const x = 123 as uint64

    const y = [1, 2, 3] as [uint64, uint64, uint64]

    const z = [1 as uint64, 2 as uint64, 3 as uint64] as const

    return x > y[0] * y[1] * y[2] * z[0] * z[1] * z[2]
  }
}
