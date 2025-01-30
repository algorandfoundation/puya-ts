import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, Uint64 } from '@algorandfoundation/algorand-typescript'

export class NativeArraysAlgo extends Contract {
  buildArray(): uint64[] {
    return [1, 2, 3, 4]
  }

  doThings() {
    const a = ['a', 'b', 'c']
    const c = a.with(2, 'e')

    let arr = this.buildArray()

    // append
    arr = [...arr, Uint64(4)]

    // pop
    const top = arr[arr.length - 1]
    arr = arr.slice(0, -1)

    // replace
    arr = arr.with(1, 10)
  }
}
