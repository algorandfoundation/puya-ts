/**
 * Example 01 — Counter
 * Tier: 1 — Fundamentals
 *
 * Features demonstrated:
 *   - GlobalState<uint64>
 *   - @abimethod
 *   - uint64 arithmetic (+, -, *, /)
 *   - createApplication conventional routing
 *   - Uint64() factory
 */
import type { uint64 } from '@algorandfoundation/algorand-typescript'
// Contract: ABI-routed base class; GlobalState: typed global storage; abimethod: decorator for ABI methods; Uint64: factory for uint64 constants
import { abimethod, Contract, GlobalState, Uint64 } from '@algorandfoundation/algorand-typescript'

// Initial counter value set via Uint64() factory
const INITIAL_VALUE = Uint64(0)

// Minimal counter contract demonstrating uint64 global state and ABI methods
export class Counter extends Contract {
  // Global state storing the current counter value as a uint64
  counter = GlobalState<uint64>()

  // createApplication: called once when the app is first deployed (onCreate: 'require')
  @abimethod({ allowActions: 'NoOp', onCreate: 'require' })
  public createApplication(): void {
    // Initialise counter to zero using Uint64() factory
    this.counter.value = INITIAL_VALUE
  }

  // Increment the counter by the given value using uint64 addition (+)
  public increment(value: uint64): uint64 {
    this.counter.value = this.counter.value + value
    return this.counter.value
  }

  // Decrement the counter by the given value using uint64 subtraction (-)
  public decrement(value: uint64): uint64 {
    this.counter.value = this.counter.value - value
    return this.counter.value
  }

  // Multiply the counter by the given value using uint64 multiplication (*)
  public multiply(value: uint64): uint64 {
    this.counter.value = this.counter.value * value
    return this.counter.value
  }

  // Divide the counter by the given value using uint64 division (/)
  public divide(value: uint64): uint64 {
    this.counter.value = this.counter.value / value
    return this.counter.value
  }
}
