import type { Account, Application, Asset, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, compile, Contract, Global, itxn, Txn } from '@algorandfoundation/algorand-typescript'
import { abiCall, compileArc4, decodeArc4, encodeArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'

export class HelloWorldContract extends Contract {
  @abimethod()
  hello(name: string): string {
    return `Hello, ${name}`
  }
}

export class InnerTransactions extends Contract {
  // example: PAYMENT
  @abimethod()
  payment(): uint64 {
    /*
     * The inner transaction `fee` defaults to 0, so the outer transaction must cover
     * it; it is only set explicitly here for demonstration purposes.
     * The sender is implied to be `Global.currentApplicationAddress`.
     *
     * If a different sender is needed, it would have to be an account that has been
     * rekeyed to the application address.
     */
    const result = itxn
      .payment({
        amount: 5000,
        receiver: Txn.sender,
        fee: 0,
      })
      .submit()
    return result.amount
  }

  // example: PAYMENT

  // example: ASSET_CREATE
  @abimethod()
  fungibleAssetCreate(): uint64 {
    const itxnResult = itxn
      .assetConfig({
        total: 100_000_000_000,
        decimals: 2,
        unitName: 'RP',
        assetName: 'Royalty Points',
      })
      .submit()
    return itxnResult.createdAsset.id
  }

  @abimethod()
  nonFungibleAssetCreate(): uint64 {
    /*
     * Following the ARC3 standard, a non-fungible asset must have an on-chain total
     * supply of exactly 1 whole unit. For fractional NFTs that means
     * `total` must equal 10^`decimals`.
     * Example: total=100, decimals=2 -> 100 * 0.01 = 1 whole unit
     */
    const itxnResult = itxn
      .assetConfig({
        total: 100,
        decimals: 2,
        unitName: 'ML',
        assetName: 'Mona Lisa',
        url: 'https://link_to_ipfs/Mona_Lisa',
        manager: Global.currentApplicationAddress,
        reserve: Global.currentApplicationAddress,
        freeze: Global.currentApplicationAddress,
        clawback: Global.currentApplicationAddress,
      })
      .submit()
    return itxnResult.createdAsset.id
  }

  // example: ASSET_CREATE

  // example: ASSET_OPT_IN
  @abimethod()
  assetOptIn(asset: Asset): void {
    /*
     * A zero amount asset transfer to one's self is a special type of asset transfer
     * that is used to opt-in to an asset.
     *
     * To send an asset transfer, the asset must be an available resource.
     * Refer to the Resource Availability section for more information.
     */
    itxn
      .assetTransfer({
        assetReceiver: Global.currentApplicationAddress,
        xferAsset: asset,
        assetAmount: 0,
        fee: 0,
      })
      .submit()
  }

  // example: ASSET_OPT_IN

  // example: ASSET_TRANSFER
  @abimethod()
  assetTransfer(asset: Asset, receiver: Account, amount: uint64): void {
    /*
     * For a smart contract to transfer an asset, the app account must be opted into it,
     * and be holding a non zero amount of said asset.
     *
     * To send an asset transfer, the asset must be an available resource.
     * Refer to the Resource Availability section for more information.
     */
    itxn
      .assetTransfer({
        assetReceiver: receiver,
        xferAsset: asset,
        assetAmount: amount,
        fee: 0,
      })
      .submit()
  }

  // example: ASSET_TRANSFER

  // example: ASSET_FREEZE
  @abimethod()
  assetFreeze(acctToBeFrozen: Account, asset: Asset): void {
    // The asset must have an account with freeze authority.
    itxn
      .assetFreeze({
        freezeAccount: acctToBeFrozen,
        freezeAsset: asset,
        frozen: true,
        fee: 0,
      })
      .submit()
  }

  // example: ASSET_FREEZE

  // example: ASSET_REVOKE
  @abimethod()
  assetRevoke(asset: Asset, accountToBeRevoked: Account, amount: uint64): void {
    /*
     * To revoke an asset, the asset must be a revocable asset
     * by having an account with clawback authority.
     *
     * Sender is implied to be currentApplicationAddress.
     */
    itxn
      .assetTransfer({
        assetReceiver: Global.currentApplicationAddress,
        xferAsset: asset,
        assetSender: accountToBeRevoked,
        assetAmount: amount,
        fee: 0,
      })
      .submit()
  }

  // example: ASSET_REVOKE

  // example: ASSET_CONFIG
  @abimethod()
  assetConfig(asset: Asset): void {
    itxn
      .assetConfig({
        configAsset: asset,
        manager: Global.currentApplicationAddress,
        reserve: Global.currentApplicationAddress,
        freeze: Txn.sender,
        clawback: Txn.sender,
        fee: 0,
      })
      .submit()
  }

  // example: ASSET_CONFIG

  // example: ASSET_DELETE
  @abimethod()
  assetDelete(asset: Asset): void {
    itxn.assetConfig({ configAsset: asset, fee: 0 }).submit()
  }

  // example: ASSET_DELETE

  // example: GROUPED_INNER_TXNS
  @abimethod()
  multiInnerTxns(appId: Application): readonly [uint64, string] {
    const paymentParams = itxn.payment({
      amount: 5000,
      receiver: Txn.sender,
      fee: 0,
    })
    const appCallParams = itxn.applicationCall({
      appId,
      appArgs: [methodSelector(HelloWorldContract.prototype.hello), encodeArc4('World')],
      fee: 0,
    })

    const [payTxn, appCallTxn] = itxn.submitGroup(paymentParams, appCallParams)

    // `decodeArc4<string>(..., 'log')` decodes a typed ARC4 value off the transaction
    // log and converts it to the native `string` type.
    const helloWorldResult = decodeArc4<string>(appCallTxn.lastLog, 'log')
    return [payTxn.amount, helloWorldResult] as const
  }

  // example: GROUPED_INNER_TXNS

  // example: DEPLOY_APP
  @abimethod()
  deployApp(): uint64 {
    // Deploy `HelloWorldContract` via a low-level `itxn.applicationCall`.
    const compiled = compile(HelloWorldContract)
    const appTxn = itxn
      .applicationCall({
        approvalProgram: compiled.approvalProgram,
        clearStateProgram: compiled.clearStateProgram,
        fee: 0,
      })
      .submit()
    return appTxn.createdApp.id
  }

  @abimethod()
  arc4DeployApp(): uint64 {
    // Deploy `HelloWorldContract` via the higher-level `compileArc4(...).bareCreate()`.
    const appTxn = compileArc4(HelloWorldContract).bareCreate()
    return appTxn.createdApp.id
  }

  // example: DEPLOY_APP

  // example: NOOP_APP_CALL
  @abimethod()
  noopAppCall(appId: Application): readonly [string, string] {
    // Manually-constructed app call: caller must encode args and decode logs.
    const callTxn = itxn
      .applicationCall({
        appId,
        appArgs: [methodSelector(HelloWorldContract.prototype.hello), encodeArc4('World')],
      })
      .submit()
    const firstHelloWorldResult = decodeArc4<string>(callTxn.lastLog, 'log')

    // `abiCall` infers the signature from the typed method reference and handles
    // argument encoding and return decoding automatically.
    const { returnValue: secondHelloWorldResult } = abiCall({
      method: HelloWorldContract.prototype.hello,
      args: ['again'],
      appId,
    })

    return [firstHelloWorldResult, secondHelloWorldResult] as const
  }

  // example: NOOP_APP_CALL
}
