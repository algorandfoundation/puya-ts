import type { uint64, Account, Application } from '@algorandfoundation/algorand-typescript'
import {
  abimethod,
  assert,
  Bytes,
  Contract,
  Global,
  LocalState,
  op,
  TemplateVar,
  Txn,
  Uint64,
} from '@algorandfoundation/algorand-typescript'

/**
 * A reusable counter app held in each opted-in account's local state.
 * Accounts must opt in before the counter is readable or writable.
 */
export class MyCounter extends Contract {
  myCounter = LocalState<uint64>({ key: 'my_counter' })

  @abimethod({ allowActions: 'OptIn' })
  optIn(): void {
    this.myCounter(Txn.sender).value = Uint64(0)
  }

  @abimethod()
  incrementMyCounter(): uint64 {
    assert(Txn.sender.isOptedIn(Global.currentApplicationId), 'Account is not opted in to the app')
    this.myCounter(Txn.sender).value += 1
    return this.myCounter(Txn.sender).value
  }
}

// example: REFERENCE_ACCOUNT_APP_EXAMPLE
/**
 * Demonstrates reading another application's per-account local state.
 * The referenced account and application must both appear in the
 * transaction's reference arrays at call time (the AlgoKit client
 * typically handles this automatically).
 */
export class ReferenceAccountApp extends Contract {
  @abimethod()
  getMyCounter(): uint64 {
    // Read a counter from a well-known account/app pair, baked into the
    // program when it is compiled/deployed (`TMPL_KNOWN_ACCOUNT`, `TMPL_KNOWN_APP`).
    const account = TemplateVar<Account>('KNOWN_ACCOUNT')
    const app = TemplateVar<Application>('KNOWN_APP')

    // reading another app's local state requires the low-level AppLocal.getEx* ops;
    // the high-level LocalState type only covers the current application's state.
    // note: if the account is not opted in to the app at all, the opcode itself
    // fails the program — `exists` is false only when the account *is* opted in
    // but the key has not been set
    const [myCount, exists] = op.AppLocal.getExUint64(account, app, Bytes('my_counter'))
    assert(exists, 'my_counter is not set for this account')
    return myCount
  }

  @abimethod()
  getMyCounterWithArg(account: Account, app: Application): uint64 {
    // Same lookup, but with caller-supplied account and app references.
    const [myCount, exists] = op.AppLocal.getExUint64(account, app, Bytes('my_counter'))
    assert(exists, 'my_counter is not set for this account')
    return myCount
  }
}

// example: REFERENCE_ACCOUNT_APP_EXAMPLE
