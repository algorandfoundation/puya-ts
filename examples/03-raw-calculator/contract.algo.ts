/**
 * Example 03 — Raw Calculator
 * Tier: 1 — Fundamentals
 *
 * Features demonstrated:
 *   - BaseContract (raw approval/clear program, no ABI routing)
 *   - Custom approvalProgram() override
 *   - Txn.applicationArgs (reading raw transaction arguments)
 *   - Txn.numAppArgs (checking argument count)
 *   - switch statement (dispatching on opcode)
 *   - Free subroutines (module-level helper functions)
 *   - op.btoi (converting bytes to uint64)
 */
import type { uint64 } from '@algorandfoundation/algorand-typescript'
// BaseContract: raw base class (no ABI routing); op: namespace for AVM opcodes; Txn: current transaction fields
import { assert, BaseContract, log, op, Txn, Uint64 } from '@algorandfoundation/algorand-typescript'

// Operation codes passed as the first application arg
const OP_ADD = Uint64(1)
const OP_SUB = Uint64(2)
const OP_MUL = Uint64(3)
const OP_DIV = Uint64(4)

// --- Free subroutines (module-level functions, compiled as AVM subroutines) ---

// Free subroutine: addition of two uint64 values
function add(a: uint64, b: uint64): uint64 {
  return a + b
}

// Free subroutine: subtraction of two uint64 values
function sub(a: uint64, b: uint64): uint64 {
  return a - b
}

// Free subroutine: multiplication of two uint64 values
function mul(a: uint64, b: uint64): uint64 {
  return a * b
}

// Free subroutine: division of two uint64 values
function div(a: uint64, b: uint64): uint64 {
  return a / b
}

// Free subroutine: dispatch an operation code to the matching arithmetic function
function calculate(action: uint64, a: uint64, b: uint64): uint64 {
  // switch statement: dispatches on the operation code
  switch (action) {
    case OP_ADD:
      return add(a, b)
    case OP_SUB:
      return sub(a, b)
    case OP_MUL:
      return mul(a, b)
    case OP_DIV:
      return div(a, b)
    default:
      assert(false, 'Unknown operation')
  }
}

// BaseContract: no ABI routing — you implement approvalProgram() and clearStateProgram() directly
export class RawCalculator extends BaseContract {
  // Custom approvalProgram(): the entry point for all non-clear-state calls
  public approvalProgram(): boolean {
    // Txn.numAppArgs: read the number of application arguments from the current transaction
    if (Txn.numAppArgs === 0) {
      // No args means app creation or bare call — approve immediately
      return true
    }

    // Expect exactly 3 args: [opcode, operandA, operandB]
    assert(Txn.numAppArgs === 3, 'Expected 3 args')

    // Txn.applicationArgs(n): read the nth application arg as raw bytes (0-indexed)
    // op.btoi: convert big-endian bytes to uint64
    const action = op.btoi(Txn.applicationArgs(0))
    const a = op.btoi(Txn.applicationArgs(1))
    const b = op.btoi(Txn.applicationArgs(2))

    // Call the free subroutine to perform the calculation
    const result = calculate(action, a, b)

    // Log the result (as uint64, logged in big-endian bytes)
    log(result)

    return true
  }

  // clearStateProgram(): called on ClearState action — approve unconditionally
  public clearStateProgram(): boolean {
    return true
  }
}
