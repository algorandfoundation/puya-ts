import type { Account, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, Contract, emit } from '@algorandfoundation/algorand-typescript'
import { Address, Struct, Uint64 } from '@algorandfoundation/algorand-typescript/arc4'

// example: ARC28_EVENT_STRUCT
class Swapped extends Struct<{
  sender: Address
  receiver: Address
  inAmount: Uint64
  outAmount: Uint64
}> {}

type NativeEvent = {
  count: uint64
  message: string
}

export class SwapContract extends Contract {
  @abimethod()
  swapEmitStruct(sender: Account, receiver: Account, inAmount: uint64, outAmount: uint64): void {
    const event = new Swapped({
      sender: new Address(sender),
      receiver: new Address(receiver),
      inAmount: new Uint64(inAmount),
      outAmount: new Uint64(outAmount),
    })
    emit(event)

    const nativeEvent: NativeEvent = { count: inAmount, message: 'payment received' }
    emit(nativeEvent)
  }
}

// example: ARC28_EVENT_STRUCT

// example: ARC28_EVENT_BY_SIGNATURE
export class TransferContract extends Contract {
  @abimethod()
  transferEmitSignature(sender: Account, receiver: Account, amount: uint64): void {
    emit('Transfer(address,address,uint64)', new Address(sender), new Address(receiver), new Uint64(amount))
  }
}

// example: ARC28_EVENT_BY_SIGNATURE

// example: ARC28_EVENT_BY_NAME
export class MintContract extends Contract {
  @abimethod()
  mintEmitByName(recipient: Account, amount: uint64): void {
    emit('Mint', new Address(recipient), new Uint64(amount))
  }
}

// example: ARC28_EVENT_BY_NAME
