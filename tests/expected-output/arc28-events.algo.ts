import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Asset, Contract, emit } from '@algorandfoundation/algorand-typescript'

type Named = { a: uint64; b: Asset }

class EventEmitter extends Contract {
  emitSwapped(a: uint64, b: uint64) {
    // @expect-error Event cannot be an anonymous type...
    emit({ a: b, b: a })

    // @expect-error Asset cannot be encoded to an ARC4 type
    emit<Named>({ a: b, b: Asset(a) })

    // @expect-error Event signature length (2) does not match number of provided values (1).
    emit('Swapped(uint64,uint64)', b)

    // @expect-error Invalid signature: Tuple has not been closed
    emit('Swapped(uint64', b)

    // @expect-error Expected type UintN<16> does not match actual type UintN<64>
    emit('Swapped(uint16,uint64)', b, a)

    // @expect-error [uint64, uint64] cannot be encoded to an ARC4 type
    emit('Swapped((uint64,uint64),uint64)', [b, b], a)
  }

  emitCustom(arg0: string, arg1: boolean) {
    // @expect-error Expression of type `number` must be explicitly converted to an algo-ts type...
    emit('Custom2', 1)
  }
}
