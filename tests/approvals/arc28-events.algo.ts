import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, emit } from '@algorandfoundation/algorand-typescript'
import { Struct, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'

type Swapped = {
  a: uint64
  b: uint64
}

class SwappedArc4 extends Struct<{ a: UintN64; b: UintN64 }> {}

class EventEmitter extends Contract {
  emitSwapped(a: uint64, b: uint64) {
    emit<Swapped>({ a: b, b: a })

    const x: Swapped = { a: b, b: a }
    emit(x)

    const y = new SwappedArc4({
      a: new UintN64(b),
      b: new UintN64(a),
    })
    emit(y)

    emit('Swapped', b, a)
  }

  emitCustom(arg0: string, arg1: boolean) {
    emit('Custom', arg0, arg1)
  }
}
