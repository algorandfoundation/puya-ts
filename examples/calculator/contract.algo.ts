import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, BaseContract, Bytes, err, log, op, Txn, Uint64 } from '@algorandfoundation/algorand-typescript'

const ADD = Uint64(1)
const SUB = Uint64(2)
const MUL = Uint64(3)
const DIV = Uint64(4)
function itoa(i: uint64): string {
  const digits = Bytes`0123456789`
  const radix = digits.length
  if (i < radix) {
    return digits.at(i).toString()
  }
  return itoa(i / radix).concat(digits.at(i % radix).toString())
}
export default class MyContract extends BaseContract {
  public approvalProgram(): boolean {
    const numArgs = Txn.numAppArgs
    let a: uint64, b: uint64, action: uint64
    if (numArgs === 0) {
      a = 0
      b = 0
      action = Uint64(0)
      log(a)
      log(b)
    } else {
      assert(numArgs === 3, 'Expected 3 args')
      action = op.btoi(Txn.applicationArgs(0))
      const a_bytes = Txn.applicationArgs(1)
      const b_bytes = Txn.applicationArgs(2)
      log(a_bytes)
      log(b_bytes)
      a = op.btoi(a_bytes)
      b = op.btoi(b_bytes)
    }
    const result = this.doCalc(action, a, b)
    const result_b = `${itoa(a)}${this.op(action)}${itoa(b)} = ${itoa(result)}`
    log(result_b)
    return true
  }
  public op(action: uint64): string {
    switch (action) {
      case ADD:
        return ` + `
      case SUB:
        return ` - `
      case MUL:
        return ` * `
      case DIV:
        return ` / `
      default:
        err('Unknown operation')
    }
  }

  public doCalc(action: uint64, a: uint64, b: uint64): uint64 {
    switch (action) {
      case ADD:
        return this.add(a, b)
      case SUB:
        return this.sub(a, b)
      case MUL:
        return this.mul(a, b)
      case DIV:
        return this.div(a, b)
      default:
        err('Unknown operation')
    }
  }

  private add(a: uint64, b: uint64): uint64 {
    return a + b
  }

  private sub(a: uint64, b: uint64): uint64 {
    return a - b
  }

  private mul(a: uint64, b: uint64): uint64 {
    return a * b
  }

  private div(a: uint64, b: uint64): uint64 {
    return a / b
  }

  public clearState(): boolean {
    return true
  }
}
