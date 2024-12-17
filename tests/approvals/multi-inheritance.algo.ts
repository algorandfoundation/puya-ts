import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, GlobalState, Uint64 } from '@algorandfoundation/algorand-typescript'
import { classes } from 'polytype'

export class CommonBase extends Contract {
  stateCommon = GlobalState<uint64>({ initialValue: 123 })

  methodCommon() {
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
}

export class MultiBases extends classes(BaseOne, BaseTwo) {
  stateMulti = GlobalState({ initialValue: 'Hmmm' })

  methodMulti() {
    return 'multi-bases'
  }
}
