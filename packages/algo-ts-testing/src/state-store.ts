import { Account, Application, Bytes, bytes, gtxn, internal } from '@algorandfoundation/algo-ts'
import algosdk from 'algosdk'

interface ApplicationLogs {
  applicationId: bigint
  logs: bytes[]
}

export class StateStore {
  logs: ApplicationLogs[] = []
  txnGroup: gtxn.Transaction[] = []
  defaultCreator: Account
  activeTransactionIndex: number | undefined

  constructor() {
    this.defaultCreator = Account(Bytes(algosdk.generateAccount().addr))
  }

  get activeTransaction(): gtxn.Transaction {
    if (this.activeTransactionIndex === undefined) {
      throw new internal.errors.InternalError('No active transaction found')
    }
    return this.txnGroup[this.activeTransactionIndex]
  }

  addApplicationLog(application: Application, value: bytes): void {
    const applicationId = internal.primitives.Uint64Cls.fromCompat(application.id).value
    this.logs.find((l) => l.applicationId === applicationId)?.logs.push(value) ?? this.logs.push({ applicationId, logs: [value] })
  }

  getApplicationLogs(application: Application): bytes[] {
    const applicationId = internal.primitives.Uint64Cls.fromCompat(application.id).value
    return this.logs.find((l) => l.applicationId === applicationId)?.logs ?? []
  }
}
