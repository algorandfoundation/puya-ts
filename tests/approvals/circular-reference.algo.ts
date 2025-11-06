import type { Application } from '@algorandfoundation/algorand-typescript'
import { assert, Contract, itxnCompose, op } from '@algorandfoundation/algorand-typescript'
import { abiCall, convertBytes, methodSelector, type StaticBytes } from '@algorandfoundation/algorand-typescript/arc4'
import type { ContractTwo } from './circular-reference-2.algo'

export class ContractOne extends Contract {
  test(appId: Application) {
    abiCall<typeof ContractTwo.prototype.test>({ appId })
  }
  test2() {
    return methodSelector<typeof ContractTwo.prototype.test>()
  }

  test3(appId: Application) {
    itxnCompose.begin<typeof ContractTwo.prototype.test2>({
      appId,
    })
    itxnCompose.next<typeof ContractTwo.prototype.test2>({
      appId,
    })
    itxnCompose.submit()

    const expected = methodSelector(ContractOne.prototype.test)
    const res1 = convertBytes<StaticBytes<4>>(op.GITxn.lastLog(1), { prefix: 'log', strategy: 'validate' }).bytes
    const res2 = convertBytes<StaticBytes<4>>(op.GITxn.lastLog(0), { prefix: 'log', strategy: 'validate' }).bytes

    assert(expected === res1)
    assert(expected === res2)
  }
}
