import { Account, Application, Bytes, internal } from '@algorandfoundation/algo-ts'
import algosdk from 'algosdk'
import { TestExecutionContext } from '../test-execution-context'
import { asBigInt } from '../util'

export class AvmValueGenerator {
  account(account?: Partial<Account>): Account {
    const { bytes, ...rest } = account ?? {}
    return {
      bytes: bytes ?? Bytes(algosdk.generateAccount().addr),
      ...rest,
    } as Account
  }

  application(app?: Partial<Application>): Application {
    const { id, ...rest } = app ?? {}
    const context = internal.ctxMgr.instance as TestExecutionContext
    const appId = id ?? context.ledger.appIdIter.next().value
    const application = {
      id: appId,
      ...rest,
    } as Application
    context.ledger.applications.set(asBigInt(application.id), application)
    return application
  }
}
