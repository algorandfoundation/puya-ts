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

  testReferenceTypes() {
    assert(
      methodSelector(ContractTwo.prototype.referenceTypesIndex) ===
        methodSelector('referenceTypesIndex(pay,asset,account,application,appl)void'),
    )
    assert(
      methodSelector(ContractTwo.prototype.referenceTypesValue) ===
        methodSelector('referenceTypesValue(pay,uint64,address,uint64,appl)void'),
    )
  }
}

class ContractTwo extends Contract {
  @abimethod({ name: 'renamedSomeMethod' })
  someMethod() {}

  test() {
    return methodSelector(ContractOne.prototype.someMethod) === methodSelector('someMethod()uint64')
  }

  @abimethod({ resourceEncoding: 'index' })
  referenceTypesIndex(pay: gtxn.PaymentTxn, asset: Asset, account: Account, app: Application, appTxn: gtxn.ApplicationCallTxn) {}

  @abimethod({ resourceEncoding: 'value' })
  referenceTypesValue(pay: gtxn.PaymentTxn, asset: Asset, account: Account, app: Application, appTxn: gtxn.ApplicationCallTxn) {}
}

const someConst = Uint64(123)
