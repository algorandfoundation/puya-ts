import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { arc4, abimethod, contract, Contract, GlobalState, LocalState, op, Uint64, urange } from '@algorandfoundation/algorand-typescript'

// example: CONTRACT_NAME
@contract({ name: 'OnChainName' })
export class ContractWithCustomName extends Contract {
  @abimethod()
  hello(): string {
    return 'hello'
  }
}

// example: CONTRACT_NAME

// example: CONTRACT_STATE_TOTALS
@contract({ stateTotals: { globalUints: 16, globalBytes: 8, localUints: 4 } })
export class ContractWithStateReservation extends Contract {
  counter = GlobalState({ initialValue: Uint64(0) })
  label = GlobalState({ initialValue: '' })

  @abimethod()
  increment(): uint64 {
    this.counter.value += 1
    return this.counter.value
  }
}

// example: CONTRACT_STATE_TOTALS

// example: CONTRACT_SCRATCH_SLOTS
@contract({ scratchSlots: [{ from: 200, to: 255 }] })
export class ContractWithScratchReservation extends Contract {
  @abimethod()
  echo(x: uint64): uint64 {
    for (const i of urange(200, 255)) {
      op.Scratch.store(i, x)
    }
    return x
  }
}

// example: CONTRACT_SCRATCH_SLOTS

// example: CONTRACT_AVM_VERSION
@contract({ avmVersion: 12 })
export class ContractWithAvmVersion extends Contract {
  optedIn = LocalState<boolean>()

  @abimethod({ allowActions: 'OptIn' })
  optIn(sender: arc4.Address): void {
    this.optedIn(sender.native).value = true
  }
}

// example: CONTRACT_AVM_VERSION
