import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, baremethod, Contract, GlobalState, LocalState, Txn } from '@algorandfoundation/algorand-typescript'
import type { ConventionalRouting } from '@algorandfoundation/algorand-typescript/arc4'

export class TealScriptConventionsAlgo extends Contract implements ConventionalRouting {
  global = GlobalState<bytes>()
  local = LocalState<string>()
  @abimethod({ name: 'noMoreThanks' })
  closeOutOfApplication(arg: uint64) {
    return arg
  }
  @abimethod({ allowActions: ['NoOp', 'DeleteApplication'] })
  createApplication(value: bytes) {
    this.global.value = value
  }

  setLocal(value: string) {
    this.local(Txn.sender).value = value
  }
  @baremethod()
  deleteApplication() {}

  optInToApplication() {}

  updateApplication() {}

  clearStateProgram(): boolean {
    return true
  }
}
