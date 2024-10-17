import { Contract, GlobalState, gtxn, itxn, LocalState } from '.'
import { AbiMethodConfig, BareMethodConfig } from './arc4'
import { OpsNamespace } from './op-types'
import { bytes, uint64 } from './primitives'
import { Account, Application, Asset } from './reference'

export type ExecutionContext = {
  log(value: bytes): void
  application(id?: uint64): Application
  asset(id?: uint64): Asset
  account(address?: bytes): Account
  op: Partial<OpsNamespace>
  abiMetadata: {
    captureMethodConfig<T extends Contract>(contract: T, methodName: string, config?: AbiMethodConfig<T> | BareMethodConfig): void
  }
  gtxn: {
    Transaction: typeof gtxn.Transaction
    PaymentTxn: typeof gtxn.PaymentTxn
    KeyRegistrationTxn: typeof gtxn.KeyRegistrationTxn
    AssetConfigTxn: typeof gtxn.AssetConfigTxn
    AssetTransferTxn: typeof gtxn.AssetTransferTxn
    AssetFreezeTxn: typeof gtxn.AssetFreezeTxn
    ApplicationTxn: typeof gtxn.ApplicationTxn
  }
  itxn: {
    submitGroup: typeof itxn.submitGroup
    payment: typeof itxn.payment
    keyRegistration: typeof itxn.keyRegistration
    assetConfig: typeof itxn.assetConfig
    assetTransfer: typeof itxn.assetTransfer
    assetFreeze: typeof itxn.assetFreeze
    applicationCall: typeof itxn.applicationCall
  }
  state: {
    createGlobalState: typeof GlobalState
    createLocalState: typeof LocalState
  }
}

declare global {
  // eslint-disable-next-line no-var
  var puyaTsExecutionContext: ExecutionContext | undefined
}

export const ctxMgr = {
  set instance(ctx: ExecutionContext) {
    const instance = global.puyaTsExecutionContext
    if (instance != undefined) throw new Error('Execution context has already been set')
    global.puyaTsExecutionContext = ctx
  },
  get instance() {
    const instance = global.puyaTsExecutionContext
    if (instance == undefined) throw new Error('No execution context has been set')
    return instance
  },
  reset() {
    global.puyaTsExecutionContext = undefined
  },
}
