import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { BaseContract } from '@algorandfoundation/algorand-typescript'

abstract class ExampleBase extends BaseContract {
  protected baseMethod(): uint64 {
    return 2
  }
}

export default class Example extends ExampleBase {
  public approvalProgram(): boolean {
    return this.localMethod() + super.baseMethod() === freeMethod() - this.baseMethod()
  }
  protected baseMethod(): uint64 {
    return 1
  }
  private localMethod(): uint64 {
    return 5
  }
}

function freeMethod(): uint64 {
  return 7
}
