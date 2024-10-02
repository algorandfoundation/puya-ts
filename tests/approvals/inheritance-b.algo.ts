import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, op, Txn } from '@algorandfoundation/algorand-typescript'
import { SimpleContract } from './inheritance-a.algo'

export class ConcreteSimpleContract extends SimpleContract {
  public approvalProgram(): uint64 {
    const a = op.btoi(Txn.applicationArgs(0))
    const b = op.btoi(Txn.applicationArgs(1))
    return this.simpleMethod(a, b)
  }
}

export class ConcreteArc4Contract extends Contract {}