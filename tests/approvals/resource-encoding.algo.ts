import type { Account, Application, Asset } from '@algorandfoundation/algorand-typescript'
import { abimethod, assert, assertMatch, Contract, Global, itxn, op, Txn } from '@algorandfoundation/algorand-typescript'
import { abiCall, compileArc4 } from '@algorandfoundation/algorand-typescript/arc4'

class Foreign extends Contract {
  @abimethod({ resourceEncoding: 'foreign_index' })
  testExplicitForeign(account: Account) {
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
  @abimethod({ resourceEncoding: 'value' })
  testExplicitValue(account: Account) {
    return account.balance
  }
}

class EchoResource extends Contract {
  @abimethod({ resourceEncoding: 'foreign_index' })
  echoResourceByForeignIndex(asset: Asset, app: Application, acc: Account) {
    const assetIdx = op.btoi(Txn.applicationArgs(1))
    assert(asset === Txn.assets(assetIdx), 'expected asset to be passed by foreign_index')
    const appIdx = op.btoi(Txn.applicationArgs(2))
    assert(app === Txn.applications(appIdx), 'expected application to be passed by foreign_index')
    const accIdx = op.btoi(Txn.applicationArgs(3))
    assert(acc === Txn.accounts(accIdx), 'expected account to be passed by foreign_index')
    return [assetIdx, appIdx, accIdx] as const
  }

  @abimethod({ resourceEncoding: 'value' })
  echoResourceByValue(asset: Asset, app: Application, acc: Account): [Asset, Application, Account] {
    const assetId = op.btoi(Txn.applicationArgs(1))
    assert(asset.id === assetId, 'expected asset to be passed by value')
    const appId = op.btoi(Txn.applicationArgs(2))
    assert(app.id === appId, 'expected application to be passed by value')
    const address = Txn.applicationArgs(3)
    assert(acc.bytes === address, 'expected account to be passed by value')
    return [asset, app, acc]
  }
}

class C2C extends Contract {
  testCallToForeign(account: Account, appId: Application) {
    const { returnValue: res1 } = abiCall(Foreign.prototype.testExplicitForeign, {
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

    const { returnValue: indexes } = compiled.call.echoResourceByForeignIndex({
      args: [asset, Global.currentApplicationId, Txn.sender],
      appId,
    })
    assertMatch(indexes, [0, 1, 1])

    const { returnValue: resources } = compiled.call.echoResourceByValue({
      args: [asset, Global.currentApplicationId, Txn.sender],
      appId,
    })

    assertMatch(resources, [asset, Global.currentApplicationId, Txn.sender])
  }
}
