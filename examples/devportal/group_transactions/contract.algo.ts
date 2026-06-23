import type { Asset, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, assert, Contract, Global, gtxn, itxn, Txn } from '@algorandfoundation/algorand-typescript'
import { decodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'

/**
 * Demonstrates two complementary ways to read sibling transactions from
 * the current atomic group:
 *
 * 1. Index lookup (`gtxn.*Txn(index)`): a runtime assertion + typed view.
 *    Fails the txn unless the transaction at `index` is of that type. Useful
 *    when the shape can't be encoded in the ABI signature, and may assert
 *    facts about transactions coming later in the group as well as before.
 *
 * 2. Typed ABI argument: declare a `gtxn.*Txn` directly as a method
 *    parameter. Transaction parameters are purely positional: they consume no
 *    space in the application args array, and the router binds them to the
 *    transactions immediately preceding this call, in declaration order,
 *    asserting each one's type before the body runs.
 */
export class GroupTransactions extends Contract {
  // example: GTXN_PAYMENT
  @abimethod()
  expectPayment(expectedAmount: uint64): uint64 {
    // Expects a Payment transaction immediately before this app call.
    // The `gtxn.PaymentTxn(index)` form fails if the txn at `index` is not a
    // Payment (or is not present), eliminating the need for an explicit
    // `Txn.typeEnum` check.
    const payTxn = gtxn.PaymentTxn(Txn.groupIndex - 1)
    assert(payTxn.receiver === Global.currentApplicationAddress, 'payment must be to app')
    assert(payTxn.amount === expectedAmount, 'wrong payment amount')
    return payTxn.amount
  }

  // example: GTXN_PAYMENT

  // example: GTXN_ASSET_TRANSFER
  @abimethod()
  expectAssetTransfer(asset: Asset): uint64 {
    // Expects an AssetTransfer transaction immediately before this call.
    // Validates the asset id, sender, and that we (the app account) are the
    // recipient.
    const axfer = gtxn.AssetTransferTxn(Txn.groupIndex - 1)
    assert(axfer.xferAsset === asset, 'wrong asset')
    assert(axfer.assetReceiver === Global.currentApplicationAddress, 'transfer must be to app')
    assert(axfer.sender === Txn.sender, 'transfer must come from caller')
    return axfer.assetAmount
  }

  // example: GTXN_ASSET_TRANSFER

  @abimethod()
  optInToAsset(asset: Asset): void {
    // Opt the application account into `asset` via an inner zero-amount
    // transfer, so it can be the recipient in the `expectAssetTransfer` and
    // `receiveFunding` patterns above.
    itxn
      .assetTransfer({
        xferAsset: asset,
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: 0,
        fee: 0,
      })
      .submit()
  }

  // example: GTXN_APP_CALL
  @abimethod()
  chainedAppCall(): uint64 {
    // Expects an ApplicationCall transaction immediately before this call.
    // `lastLog` exposes the previous app's last log entry, which lets chained
    // app calls observe each other's output.
    const prev = gtxn.ApplicationCallTxn(Txn.groupIndex - 1)
    // `decodeArc4<uint64>(..., 'log')` decodes a typed value off the log.
    return decodeArc4<uint64>(prev.lastLog, 'log')
  }

  // example: GTXN_APP_CALL

  // example: GTXN_TYPED_ARGS
  @abimethod()
  receiveFunding(pay: gtxn.PaymentTxn, axfer: gtxn.AssetTransferTxn, asset: Asset, expectedAmount: uint64): uint64 {
    // Typed-arg form of the `expect*` lookups, with two transaction parameters
    // to show the binding rule: declaration order is group order, ending at
    // this call: the group must look like `[..., pay, axfer, this call, ...]`,
    // so `pay` is bound to `Txn.groupIndex - 2` and `axfer` to
    // `Txn.groupIndex - 1`. The positions are fixed by that rule (the caller
    // cannot choose them), and each position's transaction type is asserted
    // before the body runs, so only the fields still need validating here.
    assert(pay.receiver === Global.currentApplicationAddress, 'payment must be to app')
    assert(pay.amount === expectedAmount, 'wrong payment amount')
    assert(axfer.xferAsset === asset, 'wrong asset')
    assert(axfer.assetReceiver === Global.currentApplicationAddress, 'transfer must be to app')
    assert(axfer.sender === Txn.sender, 'transfer must come from caller')
    return pay.amount + axfer.assetAmount
  }

  @abimethod()
  observeAppCall(prev: gtxn.ApplicationCallTxn): uint64 {
    // Typed-arg form of `chainedAppCall`: a single transaction parameter
    // always binds to the transaction immediately preceding this call
    // (`Txn.groupIndex - 1`), with its type asserted by the router. Reading
    // `lastLog` works the same as via index lookup.
    return decodeArc4<uint64>(prev.lastLog, 'log')
  }

  // example: GTXN_TYPED_ARGS

  // example: GROUP_POSITION_GUARDS
  @abimethod()
  strictPosition(expectedSize: uint64): void {
    // Group-position guards: the `Global.groupSize` and `Txn.groupIndex`
    // properties let a contract verify its place in the group exactly. Useful
    // for atomic patterns that depend on a fixed shape, e.g.
    // `[Payment, AppCall, AssetTransfer]`.
    assert(Global.groupSize === expectedSize, 'wrong group size')
    // This contract expects to sit at index 1 in a 3-txn group.
    assert(Txn.groupIndex === 1, 'must be index 1')

    // Reading the surrounding txns by absolute position rather than relative
    // to `groupIndex` is sometimes clearer.
    const payTxn = gtxn.PaymentTxn(0)
    const axfer = gtxn.AssetTransferTxn(2)
    assert(payTxn.sender === axfer.assetReceiver, 'sender must receive axfer')
  }

  // example: GROUP_POSITION_GUARDS
}
