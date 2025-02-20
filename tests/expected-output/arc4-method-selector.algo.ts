import { Contract } from '@algorandfoundation/algorand-typescript'
import { baremethod, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'

class ContractOne extends Contract {
  test() {
    // @expect-error bareMethod is not an ABI method
    return methodSelector(ContractTwo.prototype.bareMethod)
  }

  test2() {
    // @epect-error Expected contract instance method, found someSubroutine
    return methodSelector(someSubroutine)
  }
  test3() {
    // @expect-error approvalProgram is not an ABI method
    return methodSelector(ContractTwo.prototype.approvalProgram)
  }
}

class ContractTwo extends Contract {
  @baremethod({ onCreate: 'allow' })
  bareMethod() {}
}

function someSubroutine() {
  return true
}
