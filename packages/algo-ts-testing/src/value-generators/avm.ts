import { Account, Application, Bytes, internal } from '@algorandfoundation/algo-ts'
import algosdk from 'algosdk'
import { lazyContext } from '../context-helpers/internal-context'
import { AccountCls } from '../reference'
import { AccountData } from '../subcontexts/ledger-context'
import { asBigInt } from '../util'

export class AvmValueGenerator {
  account(account?: Partial<Account>): Account {
    const { bytes } = account ?? {}
    if (bytes && lazyContext.ledger.accountDataMap.has(bytes.toString())) {
      internal.errors.internalError(
        'Account with such address already exists in testing context. Use `context.ledger.getAccount(address)` to retrieve the existing account.',
      )
    }

    const address = bytes?.toString() ?? algosdk.generateAccount().addr
    const data = new AccountData()
    data.account = {
      ...data.account,
      ...account,
    }
    lazyContext.ledger.accountDataMap.set(address, data)
    return new AccountCls(Bytes(address))
  }

  application(app?: Partial<Application>): Application {
    const { id, ...rest } = app ?? {}
    const appId = id ?? lazyContext.ledger.appIdIter.next().value
    const application = {
      id: appId,
      ...rest,
    } as Application
    lazyContext.ledger.applications.set(asBigInt(application.id), application)
    return application
  }
}
