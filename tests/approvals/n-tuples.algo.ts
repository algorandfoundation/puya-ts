import type { NTuple, uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, GlobalState } from '@algorandfoundation/algorand-typescript'

export class NTuplesAlgo extends Contract {
  myStorage = GlobalState<NTuple<uint64, 3>>()
  abiTest(arg: NTuple<uint64, 4>): NTuple<uint64, 2> {
    return [arg[0], arg[1]]
  }

  storage() {
    this.myStorage.value = [1, 2, 3]
  }
}
