import { Account, Application, Bytes } from '@algorandfoundation/algo-ts'
import algosdk from 'algosdk'
import { TestExecutionContext } from '../test-execution-context'
import { asBigInt } from '../util'

export class AvmValueGenerator {
  #context: TestExecutionContext

  constructor(context: TestExecutionContext) {
    this.#context = context
  }

  account(account?: Partial<Account>): Account {
    const { bytes, ...rest } = account ?? {}
    return {
      bytes: bytes ?? Bytes(algosdk.generateAccount().addr),
      ...rest,
    } as Account
  }

  application(app?: Partial<Application>): Application {
    const { id, ...rest } = app ?? {}
    const appId = id ?? this.#context.ledger.appIdIter.next().value
    const application = {
      id: appId,
      ...rest,
    } as Application
    this.#context.ledger.applications.set(asBigInt(application.id), application)
    return application
  }
}
