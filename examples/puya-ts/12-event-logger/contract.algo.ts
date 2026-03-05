/**
 * Example 12: Event Logger
 *
 * This example demonstrates ARC-28 event emission with native types and positional args.
 *
 * Features:
 * - emit<T>() with typed named events — emit using a named type alias with native fields
 * - emit('Name', ...positionalArgs) — emit using explicit event name + native values
 * - ARC-28 event prefix — event signature follows ARC-28 format: "Name(type1,type2,...)"
 * - Compound assignment (+=) for counter increments
 *
 * Prerequisites: LocalNet
 *
 * @note Educational only — not audited for production use.
 */

import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, emit, GlobalState, Uint64 } from '@algorandfoundation/algorand-typescript'

// ═══════════════════════════════════════════════════════════════════
// Typed named event — type alias with native fields
// Event name is derived from the type name: "Transfer(uint64,uint64,uint64)"
// ═══════════════════════════════════════════════════════════════════

// Typed named event — named type alias with native uint64 fields for emit<T>() usage
type Transfer = { from: uint64; to: uint64; amount: uint64 }

// ═══════════════════════════════════════════════════════════════════
// Another typed named event with native fields
// Event name is derived from the type name: "Approval(uint64,uint64,uint64)"
// ═══════════════════════════════════════════════════════════════════

// Typed named event — native uint64 fields
type Approval = { owner: uint64; spender: uint64; value: uint64 }

// ═══════════════════════════════════════════════════════════════════
// Typed named event with string and uint64 fields
// ═══════════════════════════════════════════════════════════════════

// Typed named event with string and uint64 fields
type StatusChanged = { message: string; code: uint64 }

// ═══════════════════════════════════════════════════════════════════
// Event Logger Contract
// ═══════════════════════════════════════════════════════════════════

// example: EVENT_LOGGER
export class EventLogger extends Contract {
  // Track total events emitted
  eventCount = GlobalState({ initialValue: Uint64(0) })

  /** Initialize the application. */
  public createApplication(): void {}

  /**
   * Emit a Transfer event using a typed named event (type alias) with native values.
   * ARC-28 prefix: "Transfer(uint64,uint64,uint64)"
   * @param from - sender account identifier
   * @param to - receiver account identifier
   * @param amount - transfer amount
   */
  public logTransfer(from: uint64, to: uint64, amount: uint64): void {
    // emit<T>() with typed named event — native uint64 values, no arc4 wrapping needed
    emit<Transfer>({ from, to, amount })

    // Increment event counter using compound assignment
    this.eventCount.value += 1
  }

  /**
   * Emit an Approval event using a typed named event (type alias).
   * ARC-28 prefix: "Approval(uint64,uint64,uint64)"
   * @param owner - asset owner identifier
   * @param spender - approved spender identifier
   * @param value - approved spending amount
   */
  public logApproval(owner: uint64, spender: uint64, value: uint64): void {
    // emit<T>() with typed named event — generic type parameter specifies the event name
    emit<Approval>({ owner, spender, value })

    // Increment event counter using compound assignment
    this.eventCount.value += 1
  }

  /**
   * Emit events using explicit event name with positional native arguments.
   * ARC-28 prefix: "Deposit(uint64,uint64)"
   * @param account - depositing account identifier
   * @param amount - deposit amount
   */
  public logDeposit(account: uint64, amount: uint64): void {
    // emit('Name', ...args) — positional args form with native values
    emit('Deposit', account, amount)

    // Increment event counter using compound assignment
    this.eventCount.value += 1
  }

  /**
   * Emit an event with explicit ARC-28 signature in the name string.
   * ARC-28 prefix provided directly: "Withdrawal(uint64,uint64)"
   * @param account - withdrawing account identifier
   * @param amount - withdrawal amount
   */
  public logWithdrawal(account: uint64, amount: uint64): void {
    // emit('Name(type,type)', ...args) — explicit ARC-28 signature in event name
    emit('Withdrawal(uint64,uint64)', account, amount)

    // Increment event counter using compound assignment
    this.eventCount.value += 1
  }

  /**
   * Emit a StatusChanged event via typed variable inference.
   * ARC-28 prefix: "StatusChanged(string,uint64)"
   * @param message - status message text
   * @param code - numeric status code
   */
  public logStatusChange(message: string, code: uint64): void {
    // Typed variable — emit() infers event name "StatusChanged" from the variable's type annotation
    const event: StatusChanged = { message, code }
    emit(event)

    // Increment event counter using compound assignment
    this.eventCount.value += 1
  }

  /**
   * Emit multiple events in a single call — demonstrates batching pattern.
   * @param from - sender account identifier
   * @param to - receiver account identifier
   * @param amount - transfer amount
   */
  public logBatch(from: uint64, to: uint64, amount: uint64): void {
    // Emit typed named event with native values
    emit<Transfer>({ from, to, amount })

    // Emit positional-args event in the same method
    emit('BatchProcessed', from)

    // Increment event counter by 2 for both events
    this.eventCount.value += 2
  }
}
// example: EVENT_LOGGER
