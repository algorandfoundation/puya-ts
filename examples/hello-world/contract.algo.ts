import { BaseContract, log, op, Str } from '@algorandfoundation/algo-ts'

export default class HelloWorldContract extends BaseContract {
  approvalProgram(): boolean {
    const name = Str(op.Txn.applicationArgs(0))
    log(Str`Hello, ${name}`)
    return true
  }

  clearState(): boolean {
    return true
  }
}
