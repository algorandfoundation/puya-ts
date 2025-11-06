import type { Application } from '@algorandfoundation/algorand-typescript'
import { assert, Contract, itxnCompose, op } from '@algorandfoundation/algorand-typescript'
import type { StaticBytes } from '@algorandfoundation/algorand-typescript/arc4'
import { abiCall, convertBytes, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'
import type { ContractOne } from './circular-reference.algo'

export class ContractTwo extends Contract {
  test(appId: Application) {
    abiCall<typeof ContractOne.prototype.test>({ appId })
  }

  test2() {
    return methodSelector<typeof ContractOne.prototype.test>()
  }

  test3(appId: Application) {
    itxnCompose.begin<typeof ContractOne.prototype.test2>({
      appId,
    })
    itxnCompose.next<typeof ContractOne.prototype.test2>({
      appId,
    })
    itxnCompose.submit()

    const expected = methodSelector(ContractTwo.prototype.test)
    const res1 = convertBytes<StaticBytes<4>>(op.GITxn.lastLog(1), { prefix: 'log', strategy: 'validate' }).bytes
    const res2 = convertBytes<StaticBytes<4>>(op.GITxn.lastLog(0), { prefix: 'log', strategy: 'validate' }).bytes

    assert(expected === res1)
    assert(expected === res2)
  }
}
