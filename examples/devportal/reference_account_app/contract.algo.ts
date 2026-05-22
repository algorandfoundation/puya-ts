import type { Account, Application, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, Account as AccountRef, Application as AppRef, assert, Bytes, Contract, Global, LocalState, op, Txn, Uint64 } from '@algorandfoundation/algorand-typescript'

export class MyCounter extends Contract {
  myCounter = LocalState<uint64>({ key: 'my_counter' })

  @abimethod({ allowActions: 'OptIn' })
  optIn(): void {
    this.myCounter(Txn.sender).value = Uint64(0)
  }

  @abimethod()
  incrementMyCounter(): uint64 {
    assert(Txn.sender.isOptedIn(Global.currentApplicationId), 'sender must opt in to the contract')
    this.myCounter(Txn.sender).value += 1
    return this.myCounter(Txn.sender).value
  }
}

// example: REFERENCE_ACCOUNT_APP_EXAMPLE
export class ReferenceAccountApp extends Contract {
  @abimethod()
  getMyCounter(): uint64 {
    const acct = AccountRef('WMHF4FLJNKY2BPFK7YPV5ID6OZ7LVDB2B66ZTXEAMLL2NX4WJZRJFVX66M')
    const app = AppRef(1717)

    const [myCount, exists] = op.AppLocal.getExUint64(acct, app, Bytes('my_counter'))
    assert(exists, 'the selected account is not opted into the app')
    return myCount
  }

  @abimethod()
  getMyCounterWithArg(acct: Account, app: Application): uint64 {
    const [myCount, exists] = op.AppLocal.getExUint64(acct, app, Bytes('my_counter'))
    assert(exists, 'the selected account is not opted into the app')
    return myCount
  }
}

// example: REFERENCE_ACCOUNT_APP_EXAMPLE
