import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, Contract, GlobalState, loggedAssert, loggedErr, Uint64 } from '@algorandfoundation/algorand-typescript'

/**
 * Demonstrates `loggedAssert` and `loggedErr`: ARC-65-compliant error
 * helpers that log a structured `ERR:{errorCode}:{errorMessage}` string
 * before failing the transaction.
 *
 * ARC-65 suggests error codes be camel case and alphanumeric (the compiler
 * emits a warning when a code does not follow this format).
 * Furthermore, code and message may not contain ':', as this character is
 * the domain separator for ARC-65 (the compiler will error if code or
 * message contain ':').
 *
 * Compared to a plain `assert(condition, 'msg')` this:
 *   * Always logs the error, so failed transactions in algod carry it in
 *     their response.
 *   * Uses an explicit short code clients can match against.
 *
 * The trade-off is bytecode size: every distinct code + message becomes a
 * byte string in the program, so keep both as short as possible.
 */
export class LoggedErrors extends Contract {
  balance = GlobalState({ initialValue: Uint64(0) })

  @abimethod()
  deposit(amount: uint64): uint64 {
    this.balance.value += amount
    return this.balance.value
  }

  // example: LOGGED_ASSERT
  @abimethod()
  withdraw(amount: uint64): uint64 {
    // `loggedAssert(condition, code, { message, prefix, desc })` logs
    // `ERR:amountError01:amount must be positive` and aborts when the
    // condition is false. `desc` additionally sets a plain description in the
    // ARC-56 source info — the human-readable error typed clients surface —
    // without changing the logged output.
    loggedAssert(amount > 0, 'amountError01', {
      message: 'amount must be positive',
      desc: 'Withdrawal amount must be greater than zero',
    })
    loggedAssert(amount <= this.balance.value, 'amountError02', 'insufficient balance')

    this.balance.value -= amount
    return this.balance.value
  }

  // example: LOGGED_ASSERT

  // example: LOGGED_ERR
  @abimethod()
  reject(code: uint64): uint64 {
    // `loggedErr` is the unconditional version of `loggedAssert`; it is
    // equivalent to `loggedAssert(false, ...)`. Useful inside branches where
    // the failure decision has already been made.
    if (code === 0) {
      loggedErr('codeRange00', 'code zero is reserved')
    }
    if (code > 100) {
      loggedErr('codeRange01', 'code out of range')
    }
    return code
  }

  // example: LOGGED_ERR
}
