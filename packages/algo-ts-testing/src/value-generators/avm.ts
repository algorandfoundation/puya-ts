import { Account, Application, Bytes } from '@algorandfoundation/algo-ts'
import algosdk from 'algosdk'
import { asBigInt, getTestExecutionContext } from '../util'

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
    const context = getTestExecutionContext()
    const appId = id ?? context.ledger.appIdIter.next().value
    const application = {
      id: appId,
      ...rest,
    } as Application
    context.ledger.applications.set(asBigInt(application.id), application)
    return application
  }
}
