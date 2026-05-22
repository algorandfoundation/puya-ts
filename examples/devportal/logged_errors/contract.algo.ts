import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, GlobalState, loggedAssert, loggedErr, Contract, Uint64 } from '@algorandfoundation/algorand-typescript'

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
    loggedAssert(amount > 0, 'amountError01', 'amount must be positive')
    loggedAssert(amount <= this.balance.value, 'amountError02', 'insufficient balance')

    this.balance.value -= amount
    return this.balance.value
  }

  // example: LOGGED_ASSERT

  // example: LOGGED_ERR
  @abimethod()
  reject(code: uint64): uint64 {
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
