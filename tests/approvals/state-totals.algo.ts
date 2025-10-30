import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, contract, Contract, GlobalState, LocalState, Txn, Uint64 } from '@algorandfoundation/algorand-typescript'

export class BaseWithState extends Contract {
  oneGlobal = GlobalState({ initialValue: Uint64(1) })
  twoGlobal = GlobalState<uint64>()
  oneLocalBytes = LocalState<bytes>()

  setState(n: uint64) {
    this.oneGlobal.value = n
    this.twoGlobal.value = n
  }
}

export class SubClassWithState extends BaseWithState {
  threeGlobal = GlobalState<uint64>()
  twoLocalBytes = LocalState<bytes>()
  setState(n: uint64) {
    super.setState(n)
    this.threeGlobal.value = n
  }
}

@contract({ stateTotals: { globalUints: 4, localUints: 0 } })
export class SubClassWithExplicitTotals extends BaseWithState {}

@contract({ stateTotals: {} })
export class ExtendsSubWithTotals extends SubClassWithExplicitTotals {
  oneLocal = LocalState<uint64>()

  @abimethod({ allowActions: 'OptIn' })
  setState(n: uint64) {
    super.setState(n)

    this.oneLocal(Txn.sender).value = n
  }
}
