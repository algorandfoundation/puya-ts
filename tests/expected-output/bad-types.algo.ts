import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract } from '@algorandfoundation/algorand-typescript'

type WithMethod = {
  x: uint64
  // @expect-error Invalid object property type. Functions are not supported
  y(): uint64
}

class BadTypesAlgo extends Contract {
  // @expect-error Unsupported property type 3. Only GlobalState, LocalState, and Box proxies can be stored on a contract.
  x = 3

  test(arg: WithMethod) {
    // @expect-error SymbolConstructor is not supported
    const x = Symbol('hello')
    // @expect-error Uint8ArrayConstructor is not supported
    const y = new Uint8Array(4)
  }
}
