import { BaseContract, log, op } from '@algorandfoundation/algorand-typescript'

export default class HelloWorldContract extends BaseContract {
  public approvalProgram(): boolean {
    const name = String(op.Txn.applicationArgs(0))
    log(`Hello, ${name}`)
    return true
  }
}
