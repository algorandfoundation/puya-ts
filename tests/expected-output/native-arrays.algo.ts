import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract } from '@algorandfoundation/algorand-typescript'

export class NativeArraysAlgo extends Contract {
  aliasing(mutable: uint64[]) {
    // @expect-error mutable reference to ARC-4-encoded value must be copied using .copy() when being assigned to another variable
    const needClone = mutable

    // @expect-error mutable reference to ARC-4-encoded value must be copied using .copy() when being assigned to another variable
    const needClone2: readonly uint64[] = mutable
  }
}
