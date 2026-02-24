/**
 * Example 14 — Event Logger
 * Tier: 3 — Transactions & Interactions
 *
 * Features demonstrated:
 *   - emit() with arc4.Struct events — emit an instance of an arc4.Struct subclass
 *   - emit('Name', ...positionalArgs) — emit using explicit event name + positional values
 *   - Typed named events (type X = { ... }) — emit using a named type alias with arc4 fields
 *   - ARC-28 event prefix — event signature follows ARC-28 format: "Name(type1,type2,...)"
 */

import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, Contract, emit, GlobalState, Uint64 } from '@algorandfoundation/algorand-typescript'
import { Str, Struct, Uint8, Uint64 as Arc4Uint64 } from '@algorandfoundation/algorand-typescript/arc4'

// ═══════════════════════════════════════════════════════════════════
// arc4.Struct event — class-based ARC-28 event definition
// Event name is derived from the class name: "Transfer(uint64,uint64,uint64)"
// ═══════════════════════════════════════════════════════════════════

// arc4.Struct event — fields declared in the generic parameter
class Transfer extends Struct<{ from: Arc4Uint64; to: Arc4Uint64; amount: Arc4Uint64 }> {}

// ═══════════════════════════════════════════════════════════════════
// Typed named event — type alias with arc4-compatible fields
// Event name is derived from the type name: "Approval(uint64,uint64,uint64)"
// ═══════════════════════════════════════════════════════════════════

// Typed named event — named type alias with arc4 fields for emit<T>() usage
type Approval = { owner: Arc4Uint64; spender: Arc4Uint64; value: Arc4Uint64 }

// ═══════════════════════════════════════════════════════════════════
// Another typed named event with mixed types
// ═══════════════════════════════════════════════════════════════════

// Typed named event with string and uint8 fields
type StatusChanged = { message: Str; code: Uint8 }

// ═══════════════════════════════════════════════════════════════════
// Event Logger Contract
// ═══════════════════════════════════════════════════════════════════

export class EventLogger extends Contract {
  // Track total events emitted
  eventCount = GlobalState({ initialValue: Uint64(0) })

  @abimethod({ allowActions: 'NoOp', onCreate: 'require' })
  public createApplication(): void {}

  /**
   * Emit a Transfer event using an arc4.Struct instance.
   * ARC-28 prefix: "Transfer(uint64,uint64,uint64)"
   */
  public logTransfer(from: uint64, to: uint64, amount: uint64): void {
    // emit() with arc4.Struct — create a Struct instance and pass to emit()
    const event = new Transfer({
      from: new Arc4Uint64(from),   // Wrap native uint64 in arc4.Uint64
      to: new Arc4Uint64(to),       // Wrap native uint64 in arc4.Uint64
      amount: new Arc4Uint64(amount), // Wrap native uint64 in arc4.Uint64
    })
    emit(event) // Emits ARC-28 event: "Transfer(uint64,uint64,uint64)" + ABI-encoded data

    // Increment event counter
    const count: uint64 = this.eventCount.value + 1
    this.eventCount.value = count
  }

  /**
   * Emit an Approval event using a typed named event (type alias).
   * ARC-28 prefix: "Approval(uint64,uint64,uint64)"
   */
  public logApproval(owner: uint64, spender: uint64, value: uint64): void {
    // emit<T>() with typed named event — generic type parameter specifies the event name
    emit<Approval>({
      owner: new Arc4Uint64(owner),     // Wrap native value in arc4 type
      spender: new Arc4Uint64(spender), // Wrap native value in arc4 type
      value: new Arc4Uint64(value),     // Wrap native value in arc4 type
    })

    // Increment event counter
    const count: uint64 = this.eventCount.value + 1
    this.eventCount.value = count
  }

  /**
   * Emit events using explicit event name with positional arguments.
   * ARC-28 prefix: "Deposit(uint64,uint64)"
   */
  public logDeposit(account: uint64, amount: uint64): void {
    // emit('Name', ...args) — positional args form; event name as string literal
    emit('Deposit', new Arc4Uint64(account), new Arc4Uint64(amount))

    // Increment event counter
    const count: uint64 = this.eventCount.value + 1
    this.eventCount.value = count
  }

  /**
   * Emit an event with explicit ARC-28 signature in the name string.
   * ARC-28 prefix provided directly: "Withdrawal(uint64,uint64)"
   */
  public logWithdrawal(account: uint64, amount: uint64): void {
    // emit('Name(type,type)', ...args) — explicit ARC-28 signature in event name
    emit('Withdrawal(uint64,uint64)', new Arc4Uint64(account), new Arc4Uint64(amount))

    // Increment event counter
    const count: uint64 = this.eventCount.value + 1
    this.eventCount.value = count
  }

  /**
   * Emit a StatusChanged event via typed variable inference.
   * ARC-28 prefix: "StatusChanged(string,uint8)"
   */
  public logStatusChange(message: string, code: uint64): void {
    // Typed variable — emit() infers event name "StatusChanged" from the variable's type annotation
    const event: StatusChanged = {
      message: new Str(message), // Wrap native string in arc4.Str
      code: new Uint8(code),     // Wrap native uint64 in arc4.Uint8
    }
    emit(event) // Emits ARC-28 event: "StatusChanged(string,uint8)" + ABI-encoded data

    // Increment event counter
    const count: uint64 = this.eventCount.value + 1
    this.eventCount.value = count
  }

  /**
   * Emit multiple events in a single call — demonstrates batching pattern.
   */
  public logBatch(from: uint64, to: uint64, amount: uint64): void {
    // Emit struct-based event
    const transfer = new Transfer({
      from: new Arc4Uint64(from),
      to: new Arc4Uint64(to),
      amount: new Arc4Uint64(amount),
    })
    emit(transfer) // First event: "Transfer(uint64,uint64,uint64)"

    // Emit positional-args event in the same method
    emit('BatchProcessed', new Arc4Uint64(from)) // Second event: "BatchProcessed(uint64)"

    // Increment event counter by 2 for both events
    const count: uint64 = this.eventCount.value + 2
    this.eventCount.value = count
  }
}
