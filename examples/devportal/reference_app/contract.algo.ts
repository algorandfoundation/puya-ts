import type { uint64, Application } from '@algorandfoundation/algorand-typescript'
import { abimethod, Contract, GlobalState, TemplateVar, Uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall } from '@algorandfoundation/algorand-typescript/arc4'

// example: APP_REFERENCE_EXAMPLE
/** A trivial callee whose state is incremented by inner app calls. */
export class Counter extends Contract {
  counter = GlobalState({ initialValue: Uint64(0) })

  @abimethod()
  increment(): uint64 {
    this.counter.value += 1
    return this.counter.value
  }
}

/**
 * Demonstrates referencing another application by id and invoking one of its
 * methods via `abiCall`. The referenced app must be present in the
 * transaction's reference arrays at call time (the AlgoKit client typically
 * handles this automatically).
 */
export class ReferenceApp extends Contract {
  @abimethod()
  incrementViaInner(): uint64 {
    // Call into a well-known `Counter` application, baked into the program
    // when it is compiled/deployed (`TMPL_KNOWN_APP`).
    const app = TemplateVar<Application>('KNOWN_APP')
    // fee: 0 means the outer transaction's fee must also cover the inner call
    const { returnValue: counterResult } = abiCall({
      method: Counter.prototype.increment,
      fee: 0,
      appId: app,
    })
    return counterResult
  }

  @abimethod()
  incrementViaInnerWithArg(app: Application): uint64 {
    // Same call, but the target app is supplied by the caller.
    const { returnValue: counterResult } = abiCall({
      method: Counter.prototype.increment,
      fee: 0,
      appId: app,
    })
    return counterResult
  }
}

// example: APP_REFERENCE_EXAMPLE
