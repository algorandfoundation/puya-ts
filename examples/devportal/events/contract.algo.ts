import type { Account, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, Contract, emit } from '@algorandfoundation/algorand-typescript'
import { Address, Struct, Uint64 } from '@algorandfoundation/algorand-typescript/arc4'

// example: ARC28_EVENT_STRUCT
/**
 * A typed ARC-28 event. The signature emitted on-chain is derived from the
 * class name and field types: `Swapped(address,address,uint64,uint64)`.
 *
 * The first 4 bytes of the SHA-512/256 of that signature form the event's
 * selector; the rest of the log payload is the ARC-4 encoding of the fields.
 * Indexers can subscribe to the selector to pick up only this event.
 */
class Swapped extends Struct<{
  sender: Address
  receiver: Address
  inAmount: Uint64
  outAmount: Uint64
}> {}

/**
 * Native structs can also be directly emitted. In this case the equivalent
 * ARC-4 representation of the native types will be used.
 */
type NativeStruct = {
  count: uint64
  message: string
}

export class SwapContract extends Contract {
  /** Emit by passing the Struct instance (recommended form). */
  @abimethod()
  swapEmitStruct(sender: Account, receiver: Account, inAmount: uint64, outAmount: uint64): void {
    const event = new Swapped({
      sender: new Address(sender),
      receiver: new Address(receiver),
      inAmount: new Uint64(inAmount),
      outAmount: new Uint64(outAmount),
    })
    emit(event)

    const nativeEvent: NativeStruct = { count: inAmount, message: 'payment received' }
    emit(nativeEvent)
  }
}

// example: ARC28_EVENT_STRUCT

// example: ARC28_EVENT_BY_SIGNATURE
export class TransferContract extends Contract {
  /**
   * Emit using an explicit ARC-28 signature string. The signature must
   * match the runtime arg types; puya type-checks the args against it.
   */
  @abimethod()
  transferEmitSignature(sender: Account, receiver: Account, amount: uint64): void {
    emit('Transfer(address,address,uint64)', new Address(sender), new Address(receiver), new Uint64(amount))
  }
}

// example: ARC28_EVENT_BY_SIGNATURE

// example: ARC28_EVENT_BY_NAME
export class MintContract extends Contract {
  /**
   * Emit using only an event *name*; the signature is inferred from the
   * types of the following args. Equivalent to the by-signature form when
   * the inferred shape matches what off-chain consumers expect.
   *
   * Be aware that the inferred ARC-4 types are picked from the runtime arg
   * types, so passing native types (e.g. `uint64`) results in a different
   * signature than passing the ARC-4 equivalent (`Uint64`). Prefer the
   * explicit signature form when the shape must be exact.
   */
  @abimethod()
  mintEmitByName(recipient: Account, amount: uint64): void {
    emit('Mint', new Address(recipient), new Uint64(amount))
  }
}

// example: ARC28_EVENT_BY_NAME
