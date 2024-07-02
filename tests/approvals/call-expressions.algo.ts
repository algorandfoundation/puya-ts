import { uint64, Contract } from '@algorandfoundation/algo-ts'

abstract class ExampleBase extends Contract {
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
