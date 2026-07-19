import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, emit } from '@algorandfoundation/algorand-typescript'

class EventEmitter extends Contract {
  emitSwapped(a: uint64, b: uint64) {
    // @expect-error Event cannot be an anonymous type...
    emit({ a: b, b: a })
  }

  emitCustom(arg0: string, arg1: boolean) {
    // @expect-error Expression of type `1` must be explicitly converted to an algo-ts type...
    emit('Custom2', 1)
  }
}
