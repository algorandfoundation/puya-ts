import { abimethod, Contract, Uint64 } from '@algorandfoundation/algorand-typescript'
import { methodSelector } from '@algorandfoundation/algorand-typescript/arc4'

class ContractOne extends Contract {
  test() {
    return methodSelector(ContractTwo.prototype.someMethod) === methodSelector('renamedSomeMethod()void')
  }
  someMethod() {
    return someConst
  }
}

class ContractTwo extends Contract {
  @abimethod({ name: 'renamedSomeMethod' })
  someMethod() { }

  test() {
    return methodSelector(ContractOne.prototype.someMethod) === methodSelector('someMethod()uint64')
  }
}

const someConst = Uint64(123)
