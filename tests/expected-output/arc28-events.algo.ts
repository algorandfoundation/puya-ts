import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Asset, Contract, emit } from '@algorandfoundation/algorand-typescript'

type Named = { a: uint64; b: Asset }

class EventEmitter extends Contract {
  emitSwapped(a: uint64, b: uint64) {
    // @expect-error Event cannot be an anonymous type...
    emit({ a: b, b: a })

    // @expect-error Asset cannot be encoded to an ARC4 type
    emit<Named>({ a: b, b: Asset(a) })
  }

  emitCustom(arg0: string, arg1: boolean) {
    // @expect-error Expression of type `number` must be explicitly converted to an algo-ts type...
    emit('Custom2', 1)
  }
}
