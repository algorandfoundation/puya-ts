/**
 * Example 01: Counter
 *
 * This example demonstrates GlobalState and uint64 arithmetic.
 *
 * Features:
 * - GlobalState<uint64>
 * - uint64 arithmetic (+=, -=, *, /)
 * - createApplication conventional routing
 * - Uint64() factory
 *
 * Prerequisites: LocalNet
 *
 * @note Educational only — not audited for production use.
 */
import type { uint64 } from '@algorandfoundation/algorand-typescript'
// Contract: ABI-routed base class; GlobalState: typed global storage; Uint64: factory for uint64 constants
import { Contract, GlobalState, Uint64 } from '@algorandfoundation/algorand-typescript'

// Initial counter value set via Uint64() factory
const INITIAL_VALUE = Uint64(0)

// Minimal counter contract demonstrating uint64 global state and ABI methods
// example: COUNTER
export class Counter extends Contract {
  // Global state storing the current counter value as a uint64
  counter = GlobalState<uint64>()

  /** Called once when the app is first deployed. */
  public createApplication(): void {
    // Initialise counter to zero using Uint64() factory
    this.counter.value = INITIAL_VALUE
  }

  /**
   * Increment the counter by the given value using compound assignment (+=).
   * @param value - amount to add
   * @returns updated counter value
   */
  public increment(value: uint64): uint64 {
    this.counter.value += value
    return this.counter.value
  }

  /**
   * Decrement the counter by the given value using compound assignment (-=).
   * @param value - amount to subtract
   * @returns updated counter value
   */
  public decrement(value: uint64): uint64 {
    this.counter.value -= value
    return this.counter.value
  }

  /**
   * Multiply the counter by the given value using uint64 multiplication (*).
   * @param value - multiplier
   * @returns updated counter value
   */
  public multiply(value: uint64): uint64 {
    this.counter.value = this.counter.value * value
    return this.counter.value
  }

  /**
   * Divide the counter by the given value using uint64 division (/).
   * @param value - divisor
   * @returns updated counter value
   */
  public divide(value: uint64): uint64 {
    this.counter.value = this.counter.value / value
    return this.counter.value
  }
}
// example: COUNTER
