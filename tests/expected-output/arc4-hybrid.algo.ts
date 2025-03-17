import { Contract, log } from '@algorandfoundation/algorand-typescript'

class Arc4HybridAlgo extends Contract {
  // @expect-warning Contract overrides approval program method but does not appear to call super.approvalProgram(). ARC4 routing may not work as expected
  override approvalProgram(): boolean {
    return true
  }

  someMethod() {
    log('some method')
  }
}
