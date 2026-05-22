import type { Application, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, Application as AppRef, Contract, GlobalState, Uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall } from '@algorandfoundation/algorand-typescript/arc4'

export class Counter extends Contract {
  counter = GlobalState({ initialValue: Uint64(0) })

  @abimethod()
  increment(): uint64 {
    this.counter.value += 1
    return this.counter.value
  }
}

// example: APP_REFERENCE_EXAMPLE
export class ReferenceApp extends Contract {
  @abimethod()
  incrementViaInner(): uint64 {
    const app = AppRef(1717)
    const { returnValue: counterResult } = abiCall({
      method: Counter.prototype.increment,
      fee: 0,
      appId: app,
    })
    return counterResult
  }

  @abimethod()
  incrementViaInnerWithArg(app: Application): uint64 {
    const { returnValue: counterResult } = abiCall({
      method: Counter.prototype.increment,
      fee: 0,
      appId: app,
    })
    return counterResult
  }
}

// example: APP_REFERENCE_EXAMPLE
