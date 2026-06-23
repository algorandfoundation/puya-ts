import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, Bytes, contract, Contract, GlobalState, op, Txn, Uint64, urange } from '@algorandfoundation/algorand-typescript'

// example: CONTRACT_NAME
/**
 * `name` on the contract options serves two purposes:
 *   * It overrides the output TEAL file name when multiple non-abstract
 *     contracts share a source file.
 *   * It sets the contract name in the published ARC-32 application.json
 *     (and ARC-56), decoupling the on-chain identity from the class name.
 *
 * Useful for renaming the implementation class without breaking client
 * code that pins to the published name.
 */
@contract({ name: 'OnChainName' })
export class ContractWithCustomName extends Contract {
  @abimethod()
  hello(): string {
    return 'hello'
  }
}

// example: CONTRACT_NAME

// example: CONTRACT_STATE_TOTALS
/**
 * `stateTotals` declares the total state slots the application requires,
 * overriding the automatic calculation from the state proxy declarations.
 *
 * Required when:
 *   * The contract reads or writes state via dynamic keys (`op.AppGlobal.put(...)`
 *     etc.) that puya-ts can't see by inspecting the declared state proxies.
 *   * You want to reserve extra slots for future upgrades. However, the AVM
 *     now does allow updates to state totals after creation.
 */
@contract({ stateTotals: { globalUints: 16, globalBytes: 8, localUints: 4 } })
export class ContractWithStateReservation extends Contract {
  // Puya-ts sees these two state proxies and would auto-compute
  // `globalUints=1`, `globalBytes=1`. The explicit `stateTotals`
  // above reserves 16 + 8 instead, leaving room for upgrades.
  counter = GlobalState({ initialValue: Uint64(0) })
  label = GlobalState<bytes>({ initialValue: Bytes() })

  @abimethod()
  increment(): uint64 {
    this.counter.value += 1
    return this.counter.value
  }
}

// example: CONTRACT_STATE_TOTALS

// example: CONTRACT_SCRATCH_SLOTS
/**
 * `scratchSlots` reserves AVM scratch slots so puya-ts won't try to use
 * them for compiler-managed values. Pass a range (`{ from, to }`), a plain
 * slot number, or a list mixing the two.
 */
// `{ from: 200, to: 255 }` reserves slots 200..255 for non-puya use (e.g.
// `op.Scratch.store`, `op.Scratch.load`, and ReferenceArray usage).
@contract({ scratchSlots: [{ from: 200, to: 255 }] })
export class ContractWithScratchReservation extends Contract {
  @abimethod()
  echo(x: uint64): uint64 {
    // write to the reserved slots 200..255 directly; puya-ts will avoid
    // internally placing any values there under any circumstance
    for (const i of urange(200, 255)) {
      op.Scratch.store(i, x)
    }
    return x
  }
}

// example: CONTRACT_SCRATCH_SLOTS

// example: CONTRACT_AVM_VERSION
/**
 * `avmVersion` pins the contract to a specific AVM version. The compiler
 * allows opcodes available in that version, rejects ones introduced later,
 * and the produced bytecode declares the version at the top.
 * Using the default (latest) version is recommended, use this only if needed.
 */
@contract({ avmVersion: 12 })
export class ContractWithAvmVersion extends Contract {
  @abimethod()
  callerPin(): uint64 {
    // `Txn.rejectVersion` is a transaction field introduced in AVM 12, so
    // reading it compiles because of the `avmVersion: 12` declaration above;
    // on an older target version the compiler rejects it.
    return Txn.rejectVersion
  }
}

// example: CONTRACT_AVM_VERSION
