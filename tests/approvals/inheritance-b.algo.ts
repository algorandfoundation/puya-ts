import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { GlobalState, log, op, Txn } from '@algorandfoundation/algorand-typescript'
import { Arc4Contract, SimpleContract, VERY_IMPORTANT_VALUE } from './inheritance-a.algo'

const OTHER_IMPORTANT_VALUE = 'hello'

export class ConcreteSimpleContract extends SimpleContract {
  public approvalProgram(): uint64 {
    const a = op.btoi(Txn.applicationArgs(0))
    const b = op.btoi(Txn.applicationArgs(1))
    log(this.simpleMethod(a, b))
    return 1
  }
}

export class ConcreteArc4Contract extends Arc4Contract {
  concreteState = GlobalState({ initialValue: 'testing' })
  public getVeryImportantValue() {
    return VERY_IMPORTANT_VALUE + OTHER_IMPORTANT_VALUE
  }
}
