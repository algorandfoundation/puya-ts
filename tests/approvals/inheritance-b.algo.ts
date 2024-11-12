import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { log, op, Txn } from '@algorandfoundation/algorand-typescript'
import { Arc4Contract, SimpleContract, VERY_IMPORTANT_VALUE } from './inheritance-a.algo'

export class ConcreteSimpleContract extends SimpleContract {
  public approvalProgram(): uint64 {
    const a = op.btoi(Txn.applicationArgs(0))
    const b = op.btoi(Txn.applicationArgs(1))
    log(this.simpleMethod(a, b))
    return 1
  }
}

export class ConcreteArc4Contract extends Arc4Contract {
  public getVeryImportantValue() {
    return VERY_IMPORTANT_VALUE
  }
}
