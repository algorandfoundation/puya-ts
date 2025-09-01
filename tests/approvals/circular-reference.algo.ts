import type { Application } from '@algorandfoundation/algorand-typescript'
import { Contract } from '@algorandfoundation/algorand-typescript'
import { abiCall } from '@algorandfoundation/algorand-typescript/arc4'
import type { ContractTwo } from './circular-reference-2.algo'

export class ContractOne extends Contract {
  test(appId: Application) {
    abiCall<typeof ContractTwo.prototype.test>({ appId })
  }
}
