import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, Account, Contract } from '@algorandfoundation/algorand-typescript'

// example: ACCOUNT_REFERENCE_EXAMPLE
export class ReferenceAccount extends Contract {
  @abimethod()
  getAccountBalance(): uint64 {
    return Account('WMHF4FLJNKY2BPFK7YPV5ID6OZ7LVDB2B66ZTXEAMLL2NX4WJZRJFVX66M').balance
  }

  @abimethod()
  getAccountBalanceWithArgument(account: Account): uint64 {
    return account.balance
  }
}

// example: ACCOUNT_REFERENCE_EXAMPLE
