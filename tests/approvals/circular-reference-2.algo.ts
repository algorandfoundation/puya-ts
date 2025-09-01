import type { Application } from '@algorandfoundation/algorand-typescript'
import { Contract } from '@algorandfoundation/algorand-typescript'
import { abiCall } from '@algorandfoundation/algorand-typescript/arc4'
import type { ContractOne } from './circular-reference.algo'

export class ContractTwo extends Contract {
  test(appId: Application) {
    abiCall<typeof ContractOne.prototype.test>({ appId })
  }
}
