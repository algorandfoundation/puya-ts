import {
  abimethod,
  Account,
  Application,
  assert,
  assertMatch,
  Asset,
  Contract,
  Global,
  itxn,
  op,
  Txn,
} from '@algorandfoundation/algorand-typescript'
import { abiCall, compileArc4 } from '@algorandfoundation/algorand-typescript/arc4'

class ByIndex extends Contract {
  @abimethod({ resourceEncoding: 'Index' })
  testExplicitIndex(account: Account) {
    return account.balance
  }

  /**
   * Should implicitly use default 'value'
   * @param account
   */
  testImplicitValue(account: Account) {
    return account.balance
  }
}

class ByValue extends Contract {
  @abimethod({ resourceEncoding: 'Value' })
  testExplicitValue(account: Account) {
    return account.balance
  }
}

class EchoResource extends Contract {
  @abimethod({ resourceEncoding: 'Index' })
  echoResourceByIndex(asset: Asset, app: Application, acc: Account): [Asset, Application, Account] {
    const assetIdx = op.btoi(Txn.applicationArgs(1))
    assert(asset === Txn.assets(assetIdx), 'expected asset to be passed by Index')
    const appIdx = op.btoi(Txn.applicationArgs(2))
    assert(app === Txn.applications(appIdx), 'expected application to be passed by Index')
    const accIdx = op.btoi(Txn.applicationArgs(3))
    assert(acc === Txn.accounts(accIdx), 'expected account to be passed by Index')
    return [asset, app, acc] as const
  }

  @abimethod({ resourceEncoding: 'Value' })
  echoResourceByValue(asset: Asset, app: Application, acc: Account): [Asset, Application, Account] {
    const assetId = op.btoi(Txn.applicationArgs(1))
    assert(asset === Asset(assetId), 'expected asset to be passed by Value')
    const appId = op.btoi(Txn.applicationArgs(2))
    assert(app === Application(appId), 'expected application to be passed by Value')
    const address = Txn.applicationArgs(3)
    assert(acc === Account(address), 'expected account to be passed by Value')
    return [asset, app, acc]
  }
}

class C2C extends Contract {
  testCallToIndex(account: Account, appId: Application) {
    const { returnValue: res1 } = abiCall(ByIndex.prototype.testExplicitIndex, {
      appId,
      args: [account],
    })

    assert(res1 === account.balance)
  }
  testCallToValue(account: Account, appId: Application) {
    const { returnValue: res1 } = abiCall(ByValue.prototype.testExplicitValue, {
      appId,
      args: [account],
    })

    assert(res1 === account.balance)
  }

  testCallToEchoResource() {
    const compiled = compileArc4(EchoResource)

    const appId = compiled.bareCreate().createdApp
    const asset = itxn
      .assetConfig({
        total: 1,
        unitName: 'T',
        assetName: 'TEST',
      })
      .submit().createdAsset

    const { returnValue: indexes } = compiled.call.echoResourceByIndex({
      args: [asset, Global.currentApplicationId, Txn.sender],
      appId,
    })
    assertMatch(indexes, [asset, Global.currentApplicationId, Txn.sender])

    const { returnValue: resources } = compiled.call.echoResourceByValue({
      args: [asset, Global.currentApplicationId, Txn.sender],
      appId,
    })

    assertMatch(resources, [asset, Global.currentApplicationId, Txn.sender])
  }
}
