import { Account, gtxn, internal, uint64 } from '@algorandfoundation/algo-ts'
import { lazyContext } from '../context-helpers/internal-context'
import { asMaybeUint64Cls } from '../util'

const getAccount = (acct: Account | internal.primitives.StubUint64Compat): Account => {
  const acctId = asMaybeUint64Cls(acct)
  if (acctId !== undefined) {
    const activeTxn = lazyContext.activeGroup.activeTransaction
    return (activeTxn as gtxn.ApplicationTxn).accounts(acctId.asAlgoTs())
  }
  return acct as Account
}

export const balance = (a: Account | internal.primitives.StubUint64Compat): uint64 => {
  const acct = getAccount(a)
  return acct.balance
}

export const minBalance = (a: Account | internal.primitives.StubUint64Compat): uint64 => {
  const acct = getAccount(a)
  return acct.minBalance
}

export const AcctParams: internal.opTypes.AcctParamsType = {
  acctBalance: function (a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.balance, acct.balance !== 0]
  },
  acctMinBalance: function (a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.minBalance, acct.balance !== 0]
  },
  acctAuthAddr: function (a: Account | internal.primitives.StubUint64Compat): readonly [Account, boolean] {
    const acct = getAccount(a)
    return [acct.authAddress, acct.balance !== 0]
  },
  acctTotalNumUint: function (a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.totalNumUint, acct.balance !== 0]
  },
  acctTotalNumByteSlice: function (a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.totalNumByteSlice, acct.balance !== 0]
  },
  acctTotalExtraAppPages: function (a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.totalExtraAppPages, acct.balance !== 0]
  },
  acctTotalAppsCreated: function (a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.totalAppsCreated, acct.balance !== 0]
  },
  acctTotalAppsOptedIn: function (a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.totalAppsOptedIn, acct.balance !== 0]
  },
  acctTotalAssetsCreated: function (a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.totalAssetsCreated, acct.balance !== 0]
  },
  acctTotalAssets: function (a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.totalAssets, acct.balance !== 0]
  },
  acctTotalBoxes: function (a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.totalBoxes, acct.balance !== 0]
  },
  acctTotalBoxBytes: function (a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.totalBoxBytes, acct.balance !== 0]
  },
}
