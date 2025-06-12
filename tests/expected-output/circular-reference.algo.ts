import { Contract } from '@algorandfoundation/algorand-typescript'
import { abiCall } from '@algorandfoundation/algorand-typescript/arc4'
import { ContractTwo } from './circular-reference-2.algo'

export class ContractOne extends Contract {
  test() {
    /*
    This one 'could' be an error but ContractTwo should be visited first because it is referenced by this file, and this file
    will be discovered first by the expected output test glob pattern
     */
    abiCall(ContractTwo.prototype.test, {})
  }
}
