import type { bytes } from '@algorandfoundation/algorand-typescript'
import { Contract, emit } from '@algorandfoundation/algorand-typescript'
import type { DynamicBytes, UintN8 } from '@algorandfoundation/algorand-typescript/arc4'
import { Struct } from '@algorandfoundation/algorand-typescript/arc4'

type Swapped = {
  a: UintN8
  b: UintN8
}

class SwappedArc4 extends Struct<{ a: UintN8; b: UintN8 }> {}

class EventEmitter extends Contract {
  emitSwapped(a: UintN8, b: UintN8) {
    emit<Swapped>({ a: b, b: a })

    const x: Swapped = { a: b, b: a }
    emit(x)

    const y = new SwappedArc4({
      a: b,
      b: a,
    })
    emit(y)

    emit('Swapped', b, a)

    emit('Swapped(uint8,uint8)', b, a)
    emit('Swapped((uint8,uint8),uint8)', [b, b] as const, a)

    emit('Swapped((uint8,uint8),uint8)', [b, b], a)
    emit('Swapped(uint8[],uint8)', [b, b], a)
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
