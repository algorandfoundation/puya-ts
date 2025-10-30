import type { Application, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, BaseContract, Contract, GlobalState, LocalState, Uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall } from '@algorandfoundation/algorand-typescript/arc4'
import { classes } from 'polytype'

export abstract class NameStore extends BaseContract {
  name = LocalState<string>()
}

export class CommonBase extends Contract {
  stateCommon = GlobalState<uint64>({ initialValue: 123 })

  methodCommon() {
    return 'common'
  }

  b2CantOverride(): string {
    return 'common'
  }
}

export class BaseOne extends CommonBase {
  stateOne = GlobalState({ initialValue: Uint64(45) })
  methodOne() {
    return 'base-one'
  }
}

export class BaseTwo extends CommonBase {
  stateTwo = GlobalState({ initialValue: 'Hello' })
  methodTwo() {
    return 'base-two'
  }

  /**
   * Because CommonBase implements this method, and MRO for polytype is depth first; this method
   * should not be accessible from MultiBases as the MRO should be `BaseOne => CommonBase => BaseTwo => CommonBase`
   * and since CommonBase provides an implementation, this one should not be used
   */
  b2CantOverride(): string {
    return 'base-two'
  }
}

export class MultiBases extends classes(NameStore, BaseOne, BaseTwo) {
  stateMulti = GlobalState({ initialValue: 'Hmmm' })

  methodMulti() {
    return 'multi-bases'
  }

  methodCallsSuper() {
    return super.methodTwo()
  }

  callB2CantOverride() {
    return super.class(BaseTwo).b2CantOverride()
  }

  callB2Common() {
    return super.class(BaseTwo).methodCommon()
  }
}

class AbiCallMultiInheritance extends Contract {
  test(app: Application) {
    abiCall<typeof MultiBases.prototype.methodTwo>({
      args: [],
      appId: app,
    })

    const result = abiCall<typeof AbiCallMultiInheritance.prototype.add>({
      args: [1, 2],
    }).returnValue

    assert(result === 3)
  }

  add(a: uint64, b: uint64): uint64 {
    return a + b
  }
}
