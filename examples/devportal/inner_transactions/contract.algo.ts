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
     * Sender defaults to the current application address for inner transactions.
     * A different sender would need to be rekeyed to the app address.
     */
    const result = itxn.payment({
      amount: 5000,
      receiver: Txn.sender,
      fee: 0,
    }).submit()
    return result.amount
  }

  // example: PAYMENT

  // example: ASSET_CREATE
  @abimethod()
  fungibleAssetCreate(): uint64 {
    const itxnResult = itxn.assetConfig({
      total: 100_000_000_000,
      decimals: 2,
      unitName: 'RP',
      assetName: 'Royalty Points',
    }).submit()
    return itxnResult.createdAsset.id
  }

  @abimethod()
  nonFungibleAssetCreate(): uint64 {
    const itxnResult = itxn.assetConfig({
      total: 100,
      decimals: 2,
      unitName: 'ML',
      assetName: 'Mona Lisa',
      url: 'https://link_to_ipfs/Mona_Lisa',
      manager: Global.currentApplicationAddress,
      reserve: Global.currentApplicationAddress,
      freeze: Global.currentApplicationAddress,
      clawback: Global.currentApplicationAddress,
    }).submit()
    return itxnResult.createdAsset.id
  }

  // example: ASSET_CREATE

  // example: ASSET_OPT_IN
  @abimethod()
  assetOptIn(asset: Asset): void {
    /*
     * A zero-amount transfer to self opts the app account into the asset.
     * The asset must be available as a referenced resource for the call.
     */
    itxn.assetTransfer({
      assetReceiver: Global.currentApplicationAddress,
      xferAsset: asset,
      assetAmount: 0,
      fee: 0,
    }).submit()
  }

  // example: ASSET_OPT_IN

  // example: ASSET_TRANSFER
  @abimethod()
  assetTransfer(asset: Asset, receiver: Account, amount: uint64): void {
    itxn.assetTransfer({
      assetReceiver: receiver,
      xferAsset: asset,
      assetAmount: amount,
      fee: 0,
    }).submit()
  }

  // example: ASSET_TRANSFER

  // example: ASSET_FREEZE
  @abimethod()
  assetFreeze(acctToBeFrozen: Account, asset: Asset): void {
    itxn.assetFreeze({
      freezeAccount: acctToBeFrozen,
      freezeAsset: asset,
      frozen: true,
      fee: 0,
    }).submit()
  }

  // example: ASSET_FREEZE

  // example: ASSET_REVOKE
  @abimethod()
  assetRevoke(asset: Asset, accountToBeRevoked: Account, amount: uint64): void {
    itxn.assetTransfer({
      assetReceiver: Global.currentApplicationAddress,
      xferAsset: asset,
      assetSender: accountToBeRevoked,
      assetAmount: amount,
      fee: 0,
    }).submit()
  }

  // example: ASSET_REVOKE

  // example: ASSET_CONFIG
  @abimethod()
  assetConfig(asset: Asset): void {
    itxn.assetConfig({
      configAsset: asset,
      manager: Global.currentApplicationAddress,
      reserve: Global.currentApplicationAddress,
      freeze: Txn.sender,
      clawback: Txn.sender,
      fee: 0,
    }).submit()
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
    const helloWorldResult = decodeArc4<string>(appCallTxn.lastLog, 'log')
    return [payTxn.amount, helloWorldResult] as const
  }

  // example: GROUPED_INNER_TXNS

  // example: DEPLOY_APP
  @abimethod()
  deployApp(): uint64 {
    const compiled = compile(HelloWorldContract)
    const appTxn = itxn.applicationCall({
      approvalProgram: compiled.approvalProgram,
      clearStateProgram: compiled.clearStateProgram,
      fee: 0,
    }).submit()
    return appTxn.createdApp.id
  }

  @abimethod()
  arc4DeployApp(): uint64 {
    const appTxn = compileArc4(HelloWorldContract).bareCreate()
    return appTxn.createdApp.id
  }

  // example: DEPLOY_APP

  // example: NOOP_APP_CALL
  @abimethod()
  noopAppCall(appId: Application): readonly [string, string] {
    const callTxn = itxn.applicationCall({
      appId,
      appArgs: [methodSelector(HelloWorldContract.prototype.hello), encodeArc4('World')],
    }).submit()
    const firstHelloWorldResult = decodeArc4<string>(callTxn.lastLog, 'log')

    const { returnValue: secondHelloWorldResult } = abiCall({
      method: HelloWorldContract.prototype.hello,
      args: ['again'],
      appId,
    })

    return [firstHelloWorldResult, secondHelloWorldResult] as const
  }

  // example: NOOP_APP_CALL
}
