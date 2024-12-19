import { assert, BaseContract, Bytes, contract } from '@algorandfoundation/algorand-typescript'
import { Scratch } from '@algorandfoundation/algorand-typescript/op'

@contract({ scratchSlots: [0, 1, { from: 10, to: 20 }] })
export class ReserveScratchAlgo extends BaseContract {
  setThings() {
    Scratch.store(0, 1)
    Scratch.store(1, Bytes('hello'))
    Scratch.store(15, 45)
  }

  approvalProgram(): boolean {
    this.setThings()

    assert(Scratch.loadUint64(0) === 1)
    assert(Scratch.loadBytes(0) === Bytes('hello'))
    assert(Scratch.loadUint64(15) === 45)
    return true
  }
}

@contract({ scratchSlots: [50] })
export class SubReserveScratchAlgo extends ReserveScratchAlgo {
  approvalProgram(): boolean {
    super.approvalProgram()
    Scratch.store(50, Bytes('world'))
    Scratch.store(16, Bytes('world'))
    return true
  }
}
