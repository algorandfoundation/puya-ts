import { BaseContract, log, op } from '@algorandfoundation/algo-ts'

export default class HelloWorldContract extends BaseContract {
  public approvalProgram(): boolean {
    const name = String(op.Txn.applicationArgs(0))
    log(`Hello, ${name}`)
    return true
  }

  public clearState(): boolean {
    return true
  }
}
