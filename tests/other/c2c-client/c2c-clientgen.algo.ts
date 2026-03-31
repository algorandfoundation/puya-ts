import { type Application, arc4, assert, Contract } from '@algorandfoundation/algorand-typescript'
import { StringContract as StringContractClient } from './StringContract.client'

export class C2CClientgenTest extends Contract {
  testContractClient(stringApp: Application) {
    const { returnValue: result1 } = arc4.abiCall({
      method: StringContractClient.prototype.join,
      appId: stringApp,
      args: [new arc4.Str('Hello'), new arc4.Str(' World')],
    })
    assert(result1 === new arc4.Str('Hello World'))

    const { returnValue: result2 } = arc4.abiCall<typeof StringContractClient.prototype.join>({
      appId: stringApp,
      args: [new arc4.Str('Hello'), new arc4.Str(' Galaxy')],
    })
    assert(result2 === new arc4.Str('Hello Galaxy'))

    const { returnValue: result3 } = arc4.abiCall({
      method: StringContractClient.prototype.interpolate,
      appId: stringApp,
      args: [new arc4.Str('yourself!')],
    })
    assert(result3 === new arc4.Str('You interpolated yourself!'))
  }
}
