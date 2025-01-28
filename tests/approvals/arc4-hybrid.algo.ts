import { Contract, log } from '@algorandfoundation/algorand-typescript'

class Arc4HybridAlgo extends Contract {
  override approvalProgram(): boolean {
    log('before')
    const result = super.approvalProgram()
    log('after')
    return result
  }

  someMethod() {
    log('some method')
  }
}
