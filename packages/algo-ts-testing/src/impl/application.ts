import { Account, Application, Bytes, bytes, uint64 } from '@algorandfoundation/algo-ts'
import algosdk from 'algosdk'
import { ALWAYS_APPROVE_TEAL_PROGRAM } from '../constants'
import { lazyContext } from '../context-helpers/internal-context'
import { Mutable } from '../typescript-helpers'
import { asBigInt, asUint64 } from '../util'

export class ApplicationData {
  application: Mutable<Omit<Application, 'id' | 'address'>> & { appLogs: bytes[] }
  isCreating: boolean = false

  get appLogs() {
    return this.application.appLogs
  }

  constructor() {
    this.application = {
      approvalProgram: ALWAYS_APPROVE_TEAL_PROGRAM,
      clearStateProgram: ALWAYS_APPROVE_TEAL_PROGRAM,
      globalNumUint: 0,
      globalNumBytes: 0,
      localNumUint: 0,
      localNumBytes: 0,
      extraProgramPages: 0,
      creator: lazyContext.defaultSender,
      appLogs: [],
    }
  }
}

export class ApplicationCls implements Application {
  readonly id: uint64

  constructor(id?: uint64) {
    this.id = asUint64(id ?? 0)
  }

  private get data(): ApplicationData {
    return lazyContext.getApplicationData(this.id)
  }
  get approvalProgram(): bytes {
    return this.data.application.approvalProgram
  }
  get clearStateProgram(): bytes {
    return this.data.application.clearStateProgram
  }
  get globalNumUint(): uint64 {
    return this.data.application.globalNumUint
  }
  get globalNumBytes(): uint64 {
    return this.data.application.globalNumBytes
  }
  get localNumUint(): uint64 {
    return this.data.application.localNumUint
  }
  get localNumBytes(): uint64 {
    return this.data.application.localNumBytes
  }
  get extraProgramPages(): uint64 {
    return this.data.application.extraProgramPages
  }
  get creator(): Account {
    return this.data.application.creator
  }
  get address(): Account {
    const addr = algosdk.getApplicationAddress(asBigInt(this.id))
    return Account(Bytes(addr))
  }
}
