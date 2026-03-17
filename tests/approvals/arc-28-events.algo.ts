import type { bytes } from '@algorandfoundation/algorand-typescript'
import { Contract, emit } from '@algorandfoundation/algorand-typescript'
import type { DynamicBytes, Uint8 } from '@algorandfoundation/algorand-typescript/arc4'
import { Struct } from '@algorandfoundation/algorand-typescript/arc4'

type Swapped = {
  a: Uint8
  b: Uint8
}

class SwappedArc4 extends Struct<{ a: Uint8; b: Uint8 }> {}

class EventEmitter extends Contract {
  emitSwapped(a: Uint8, b: Uint8) {
    emit<Swapped>({ a: b, b: a })

    const x: Swapped = { a: b, b: a }
    emit(x)

    const y = new SwappedArc4({
      a: b,
      b: a,
    })
    emit(y)

    emit('Swapped4', b, a)

    emit('Swapped5(uint8,uint8)', b, a)

    emit('Swapped6((uint8,uint8),uint8)', [b, b] as const, a)
    emit('Swapped6((uint8,uint8),uint8)', [b, b], a)

    emit('Swapped7(uint8[],uint8)', [b, b], a)

    emit('Swapped8(((uint8,uint8)),uint8)', [[b, b]], a)
    emit('Swapped9(uint8[][],uint8)', [[b, b]], a)

    emit('Swapped10((uint8,uint8)[],uint8)', [[b, b]], a)
    emit('Swapped11((uint8[]),uint8)', [[b, b]], a)

    const aUint64 = a.asUint64()
    const bUint64 = b.asUint64()
    emit('Swapped12(uint64[],uint64)', [bUint64, bUint64], aUint64)
  }

  emitCustom(arg0: string, arg1: boolean) {
    emit('Custom', arg0, arg1)
    emit('Custom(string,bool)', arg0, arg1)
  }

  emitDynamicBytes(x: bytes, y: DynamicBytes) {
    // this throws an error in python and requires `_HasAssignmentVisitor.check(emit)` in arc4 copy validator
    emit('DB(byte[],byte[])', x, y)
  }
}
