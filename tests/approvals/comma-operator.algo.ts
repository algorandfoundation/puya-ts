import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, emit } from '@algorandfoundation/algorand-typescript'
import { Uint8 } from '@algorandfoundation/algorand-typescript/arc4'

type Event = { v: Uint8; acc: Uint8 }

class CommaOperatorTest extends Contract {
  emitEmitAdd(a: Uint8, b: Uint8): Uint8 {
    let res: uint64 = 0
    // prettier-ignore
    return new Uint8((
      emit<Event>({ acc: new Uint8((res += a.asUint64())), v: a }),
      emit<Event>({ acc: new Uint8((res += b.asUint64())), v: b }),
      res
    ))
  }
}
