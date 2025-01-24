import { Box, BoxMap, BoxRef, Contract, GlobalState, gtxn, itxn, LocalState } from '.'
import { AbiMethodConfig, BareMethodConfig } from './arc4'

export type ExecutionContext = {
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
    GlobalState: typeof GlobalState
    LocalState: typeof LocalState
    Box: typeof Box
    BoxMap: typeof BoxMap
    BoxRef: typeof BoxRef
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
