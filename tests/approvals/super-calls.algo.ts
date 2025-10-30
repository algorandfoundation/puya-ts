import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, BaseContract, GlobalState, Uint64 } from '@algorandfoundation/algorand-typescript'

export class SuperContract extends BaseContract {
  g1 = GlobalState({ initialValue: Uint64(1) })

  approvalProgram(): boolean {
    assert(this.g1.value === 1)
    return true
  }

  superMethod() {
    return true
  }
}

export class SubContract extends SuperContract {
  g2 = GlobalState({ initialValue: Uint64(2) })

  approvalProgram(): boolean {
    assert(this.g1.value === 1)
    assert(this.g2.value === 2)
    return true
  }
}

export class SubSubContract extends SubContract {
  approvalProgram(): boolean {
    assert(this.g1.value === 1)
    assert(this.g2.value === 2)
    return true
  }
}

export class SubSubSubContract extends SubSubContract {
  g3 = GlobalState<uint64>()
  constructor() {
    super()
    this.g3.value = 3
  }
  approvalProgram(): boolean {
    assert(this.g1.value === 1)
    assert(this.g2.value === 2)
    assert(this.g3.value === 3)
    return true
  }

  subSubSubMethod() {
    return super.superMethod()
  }
}
