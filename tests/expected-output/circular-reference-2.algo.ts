import { Contract } from '@algorandfoundation/algorand-typescript'
import { abiCall } from '@algorandfoundation/algorand-typescript/arc4'
import { ContractOne } from './circular-reference.algo'

export class ContractTwo extends Contract {
  test() {
    // @expect-error test is not an ABI method, or the containing contract has not been visited (possibly due to a circular reference)
    abiCall(ContractOne.prototype.test, {})
  }
}
