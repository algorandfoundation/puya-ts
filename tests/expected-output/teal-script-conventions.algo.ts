import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, baremethod, Contract, GlobalState } from '@algorandfoundation/algorand-typescript'
import type { ConventionalRouting } from '@algorandfoundation/algorand-typescript/arc4'

export class TealScriptConventionsAlgo extends Contract implements ConventionalRouting {
  global = GlobalState<bytes>()

  closeOutOfApplication(arg: uint64) {
    return arg
  }

  // @expect-error onCreate for conventional routing method 'createApplication' must be: require
  @abimethod({ onCreate: 'disallow' })
  createApplication(value: bytes) {
    this.global.value = value
  }

  deleteApplication() {}

  // @expect-error allowActions for conventional routing method 'optInToApplication' must be: OptIn
  @baremethod({ allowActions: ['UpdateApplication'] })
  optInToApplication() {}

  updateApplication() {}

  clearStateProgram(): boolean {
    return true
  }
}
