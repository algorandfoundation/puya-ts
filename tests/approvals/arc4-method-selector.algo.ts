import type { Account, Application, Asset, gtxn } from '@algorandfoundation/algorand-typescript'
import { abimethod, assert, Contract, Uint64 } from '@algorandfoundation/algorand-typescript'
import { methodSelector } from '@algorandfoundation/algorand-typescript/arc4'

class ContractOne extends Contract {
  test() {
    return methodSelector(ContractTwo.prototype.someMethod) === methodSelector('renamedSomeMethod()void')
  }
  someMethod() {
    return someConst
  }

  test2() {
    assert(
      methodSelector(ContractTwo.prototype.referenceTypes) === methodSelector('referenceTypes(pay,asset,account,application,appl)void'),
    )
  }
}

class ContractTwo extends Contract {
  @abimethod({ name: 'renamedSomeMethod' })
  someMethod() {}

  test() {
    return methodSelector(ContractOne.prototype.someMethod) === methodSelector('someMethod()uint64')
  }

  referenceTypes(pay: gtxn.PaymentTxn, asset: Asset, account: Account, app: Application, appTxn: gtxn.ApplicationTxn) {}
}

const someConst = Uint64(123)
