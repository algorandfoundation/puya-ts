import { Account, Application, Asset, bytes, Bytes, gtxn, internal, Uint64 } from '@algorandfoundation/algo-ts'
import { lazyContext } from '../context-helpers/internal-context'
import { FunctionKeys, Mutable, ObjectKeys } from '../typescript-helpers'
import { asNumber, getRandomBytes } from '../util'

export type TxnFields<TTxn> = Partial<Mutable<Pick<TTxn, ObjectKeys<TTxn>>>>
export type TxnFuncs<TTxn> = Pick<TTxn, FunctionKeys<TTxn>>

const baseDefaultFields = () => ({
  sender: lazyContext.defaultSender,
  fee: Uint64(0),
  firstValid: Uint64(0),
  firstValidTime: Uint64(0),
  lastValid: Uint64(0),
  note: Bytes(),
  lease: Bytes(),
  typeBytes: Bytes(),
  groupIndex: Uint64(0),
  txnId: getRandomBytes(32).asAlgoTs(),
  rekeyTo: Account(),
})

const getTxnProxy = <TTxn extends gtxn.Transaction>(fields: TxnFields<TTxn>, funcs: TxnFuncs<TTxn>) => {
  return new Proxy(
    {} as TTxn,
    {
      get<TProperty extends keyof TTxn>(_target: TTxn, property: TProperty): TTxn[TProperty] {
        return ((Reflect.has(funcs, property) ? funcs : fields) as TTxn)[property]
      },
    } as ProxyHandler<TTxn>,
  )
}

export const PaymentTransaction = (txnFields: TxnFields<gtxn.PaymentTxn>) => {
  const defaultFields: Required<typeof txnFields> = {
    ...baseDefaultFields(),
    type: gtxn.TransactionType.Payment,
    receiver: Account(),
    amount: Uint64(0),
    closeRemainderTo: Account(),
  }
  const fields = {
    ...defaultFields,
    ...txnFields,
  }

  return getTxnProxy(fields, {} as TxnFuncs<gtxn.PaymentTxn>)
}

export const KeyRegistrationTransaction = (txnFields: TxnFields<gtxn.KeyRegistrationTxn>) => {
  const defaultFields: Required<typeof txnFields> = {
    ...baseDefaultFields(),
    type: gtxn.TransactionType.KeyRegistration,
    voteKey: Bytes(),
    selectionKey: Bytes(),
    voteFirst: Uint64(0),
    voteLast: Uint64(0),
    voteKeyDilution: Uint64(0),
    nonParticipation: false,
    stateProofKey: Bytes(),
  }
  const fields = {
    ...defaultFields,
    ...txnFields,
  }
  return getTxnProxy(fields, {} as TxnFuncs<gtxn.KeyRegistrationTxn>)
}

export const AssetConfigTransaction = (txnFields: TxnFields<gtxn.AssetConfigTxn>) => {
  const defaultFields: Required<typeof txnFields> = {
    ...baseDefaultFields(),
    type: gtxn.TransactionType.AssetConfig,
    configAsset: Asset(),
    total: Uint64(0),
    decimals: Uint64(0),
    defaultFrozen: false,
    unitName: Bytes(),
    assetName: Bytes(),
    url: Bytes(),
    metadataHash: Bytes(),
    manager: Account(),
    reserve: Account(),
    freeze: Account(),
    clawback: Account(),
  }
  const fields = {
    ...defaultFields,
    ...txnFields,
  }
  return getTxnProxy(fields, {} as TxnFuncs<gtxn.AssetConfigTxn>)
}

export const AssetTransferTransaction = (txnFields: TxnFields<gtxn.AssetTransferTxn>) => {
  const defaultFields: Required<typeof txnFields> = {
    ...baseDefaultFields(),
    type: gtxn.TransactionType.AssetTransfer,
    xferAsset: Asset(),
    assetAmount: Uint64(0),
    assetSender: Account(),
    assetReceiver: Account(),
    assetCloseTo: Account(),
  }
  const fields = {
    ...defaultFields,
    ...txnFields,
  }
  return getTxnProxy(fields, {} as TxnFuncs<gtxn.AssetTransferTxn>)
}

export const AssetFreezeTransaction = (txnFields: TxnFields<gtxn.AssetFreezeTxn>) => {
  const defaultFields: Required<typeof txnFields> = {
    ...baseDefaultFields(),
    type: gtxn.TransactionType.AssetFreeze,
    freezeAsset: Asset(),
    freezeAccount: Account(),
    frozen: false,
  }
  const fields = {
    ...defaultFields,
    ...txnFields,
  }
  return getTxnProxy(fields, {} as TxnFuncs<gtxn.AssetFreezeTxn>)
}

export type ApplicationTransactionFields = TxnFields<gtxn.ApplicationTxn> &
  Partial<{
    appArgs: Array<bytes>
    accounts: Array<Account>
    assets: Array<Asset>
    apps: Array<Application>
    approvalProgramPages: Array<bytes>
    clearStateProgramPages: Array<bytes>
  }>
export const ApplicationTransaction = (txnFields: ApplicationTransactionFields) => {
  const defaultFields: Required<typeof txnFields> = {
    ...baseDefaultFields(),
    type: gtxn.TransactionType.ApplicationCall,
    appId: Application(),
    onCompletion: 'NoOp',
    globalNumUint: Uint64(0),
    globalNumBytes: Uint64(0),
    localNumUint: Uint64(0),
    localNumBytes: Uint64(0),
    extraProgramPages: Uint64(0),
    lastLog: Bytes(),

    approvalProgram: Bytes(),
    clearStateProgram: Bytes(),
    numAppArgs: Uint64(0),
    numAccounts: Uint64(0),
    numAssets: Uint64(0),
    numApps: Uint64(0),
    numApprovalProgramPages: Uint64(0),
    numClearStateProgramPages: Uint64(0),

    appArgs: [],
    accounts: [],
    assets: [],
    apps: [],
    approvalProgramPages: [],
    clearStateProgramPages: [],
  }
  const fields: Required<typeof txnFields> = {
    ...defaultFields,
    get approvalProgram() {
      return this.approvalProgramPages[0] ?? Bytes()
    },
    get clearStateProgram() {
      return this.clearStateProgramPages[0] ?? Bytes()
    },
    get numAppArgs() {
      return Uint64(this.appArgs.length)
    },
    get numAccounts() {
      return Uint64(this.accounts.length)
    },
    get numAssets() {
      return Uint64(this.assets.length)
    },
    get numApps() {
      return Uint64(this.apps.length)
    },
    get numApprovalProgramPages() {
      return Uint64(this.approvalProgramPages.length)
    },
    get numClearStateProgramPages() {
      return Uint64(this.clearStateProgramPages.length)
    },
    ...txnFields,
  }
  const funcs: TxnFuncs<gtxn.ApplicationTxn> = {
    appArgs(index: internal.primitives.StubUint64Compat): bytes {
      return fields.appArgs[asNumber(index)]
    },
    accounts(index: internal.primitives.StubUint64Compat): Account {
      return fields.accounts[asNumber(index)]
    },
    assets(index: internal.primitives.StubUint64Compat): Asset {
      return fields.assets[asNumber(index)]
    },
    apps(index: internal.primitives.StubUint64Compat): Application {
      return fields.apps[asNumber(index)]
    },
    approvalProgramPages(index: internal.primitives.StubUint64Compat): bytes {
      return fields.approvalProgramPages[asNumber(index)]
    },
    clearStateProgramPages(index: internal.primitives.StubUint64Compat): bytes {
      return fields.clearStateProgramPages[asNumber(index)]
    },
  }

  return getTxnProxy(fields, funcs)
}
