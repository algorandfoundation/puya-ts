import type { Asset, uint64 } from '@algorandfoundation/algorand-typescript'
import {
  abimethod,
  assert,
  Contract,
  Global,
  gtxn,
  itxn,
  Txn,
} from '@algorandfoundation/algorand-typescript'
import { decodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'

export class GroupTransactions extends Contract {
  // example: GTXN_PAYMENT
  @abimethod()
  expectPayment(expectedAmount: uint64): uint64 {
    const payTxn = gtxn.PaymentTxn(Txn.groupIndex - 1)
    assert(payTxn.receiver === Global.currentApplicationAddress, 'payment must go to the contract')
    assert(payTxn.amount === expectedAmount, 'unexpected payment amount')
    return payTxn.amount
  }

  // example: GTXN_PAYMENT

  // example: GTXN_ASSET_TRANSFER
  @abimethod()
  expectAssetTransfer(asset: Asset): uint64 {
    const axfer = gtxn.AssetTransferTxn(Txn.groupIndex - 1)
    assert(axfer.xferAsset === asset, 'unexpected asset')
    assert(axfer.assetReceiver === Global.currentApplicationAddress, 'asset transfer must go to the contract')
    assert(axfer.sender === Txn.sender, 'transfer must come from caller')
    return axfer.assetAmount
  }

  // example: GTXN_ASSET_TRANSFER

  @abimethod()
  optInToAsset(asset: Asset): void {
    itxn.assetTransfer({
      xferAsset: asset,
      assetReceiver: Global.currentApplicationAddress,
      assetAmount: 0,
      fee: 0,
    }).submit()
  }

  // example: GTXN_APP_CALL
  @abimethod()
  chainedAppCall(): uint64 {
    const prev = gtxn.ApplicationCallTxn(Txn.groupIndex - 1)
    return decodeArc4<uint64>(prev.lastLog, 'log')
  }

  // example: GTXN_APP_CALL

  // example: GTXN_TYPED_ARGS
  @abimethod()
  receivePayment(pay: gtxn.PaymentTxn, expectedAmount: uint64): uint64 {
    assert(pay.groupIndex === Txn.groupIndex - 1, 'payment must immediately precede the app call')
    assert(pay.receiver === Global.currentApplicationAddress, 'payment must go to the contract')
    assert(pay.amount === expectedAmount, 'unexpected payment amount')
    return pay.amount
  }

  @abimethod()
  receiveAssetTransfer(axfer: gtxn.AssetTransferTxn, asset: Asset): uint64 {
    assert(axfer.xferAsset === asset, 'unexpected asset')
    assert(axfer.assetReceiver === Global.currentApplicationAddress, 'asset transfer must go to the contract')
    assert(axfer.sender === Txn.sender, 'transfer must come from caller')
    return axfer.assetAmount
  }

  @abimethod()
  observeAppCall(prev: gtxn.ApplicationCallTxn): uint64 {
    return decodeArc4<uint64>(prev.lastLog, 'log')
  }

  // example: GTXN_TYPED_ARGS

  // example: GROUP_POSITION_GUARDS
  @abimethod()
  strictPosition(expectedSize: uint64): void {
    assert(Global.groupSize === expectedSize, 'wrong group size')
    assert(Txn.groupIndex === 1, 'must be index 1')

    const payTxn = gtxn.PaymentTxn(0)
    const axfer = gtxn.AssetTransferTxn(2)
    assert(payTxn.sender === axfer.assetReceiver, 'sender must receive axfer')
  }

  // example: GROUP_POSITION_GUARDS
}
