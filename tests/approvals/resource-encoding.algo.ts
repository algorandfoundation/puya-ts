import type { Account, Application, Asset } from '@algorandfoundation/algorand-typescript'
import { abimethod, assert, Contract, Global, itxn, op, Txn } from '@algorandfoundation/algorand-typescript'
import { abiCall, compileArc4 } from '@algorandfoundation/algorand-typescript/arc4'

class BaseForeign extends Contract {
  /**
   * Should inherit encoding from contract decorator
   * @param account
   */
  @abimethod({ resourceEncoding: 'foreign_index' })
  testBaseForeign(account: Account) {
    return account.balance
  }
}

class BaseValue extends Contract {
  /**
   * Should inherit encoding from contract decorator
   * @param account
   */
  @abimethod({ resourceEncoding: 'value' })
  testBaseValue(account: Account) {
    return account.balance
  }
}

class Foreign extends BaseForeign {
  @abimethod({ resourceEncoding: 'foreign_index' })
  testExplicitForeign(account: Account) {
    return account.balance
  }

  /**
   * Should implicitly use 'value' encoding inherited from the compiler options (and not inherit from the base contract)
   * @param account
   */
  testImplicitValue(account: Account) {
    return account.balance
  }
}

class ByValue extends BaseValue {
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
  }

  @abimethod({ resourceEncoding: 'value' })
  echoResourceByValue(asset: Asset, app: Application, acc: Account) {
    const assetId = op.btoi(Txn.applicationArgs(1))
    assert(asset.id === assetId, 'expected asset to be passed by value')
    const appId = op.btoi(Txn.applicationArgs(2))
    assert(app.id === appId, 'expected application to be passed by value')
    const address = Txn.applicationArgs(3)
    assert(acc.bytes === address, 'expected account to be passed by value')
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

    compiled.call.echoResourceByForeignIndex({
      args: [asset, Global.currentApplicationId, Txn.sender],
      appId,
    })

    compiled.call.echoResourceByValue({
      args: [asset, Global.currentApplicationId, Txn.sender],
      appId,
    })
  }
}
