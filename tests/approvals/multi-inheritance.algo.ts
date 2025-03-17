import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, GlobalState, Uint64 } from '@algorandfoundation/algorand-typescript'
import { classes } from 'polytype'

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

export class MultiBases extends classes(BaseOne, BaseTwo) {
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
