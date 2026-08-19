import type { uint64, Account } from '@algorandfoundation/algorand-typescript'
import { abimethod, Contract, TemplateVar } from '@algorandfoundation/algorand-typescript'

// example: ACCOUNT_REFERENCE_EXAMPLE
/**
 * Demonstrates accessing properties of an external account. The account is
 * either baked into the program via a template variable or supplied as a
 * method argument. Either way, it must be present in the transaction's
 * reference array at call time (the AlgoKit client typically handles this
 * automatically).
 */
export class ReferenceAccount extends Contract {
  @abimethod()
  getAccountBalance(): uint64 {
    // Read the balance of a well-known account, baked into the program
    // when it is compiled/deployed (`TMPL_KNOWN_ACCOUNT`).
    const account = TemplateVar<Account>('KNOWN_ACCOUNT')
    return account.balance
  }

  @abimethod()
  getAccountBalanceWithArg(account: Account): uint64 {
    // Same lookup, but with a caller-supplied account reference.
    return account.balance
  }
}

// example: ACCOUNT_REFERENCE_EXAMPLE
