import type { Account, Application, Asset, bytes, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import {
  abimethod,
  assert,
  Contract,
  GlobalState,
  log,
  LogicSig,
  op,
  TemplateVar,
  TransactionType,
} from '@algorandfoundation/algorand-typescript'

abstract class HelloBase extends Contract {
  greeting = GlobalState({ initialValue: '' })

  @abimethod({ allowActions: 'DeleteApplication' })
  delete() {}

  @abimethod({ allowActions: 'UpdateApplication' })
  update() {}

  greet(name: string): string {
    return `${this.greeting.value} ${name}`
  }
}

export class Hello extends HelloBase {
  @abimethod({ name: 'helloCreate', onCreate: 'require' })
  create(greeting: string) {
    this.greeting.value = greeting
  }
}

export class HelloTemplate extends HelloBase {
  constructor() {
    super()
    this.greeting.value = TemplateVar<string>('GREETING')
  }

  @abimethod({ onCreate: 'require' })
  create() {}
}

export class HelloTemplateCustomPrefix extends HelloBase {
  constructor() {
    super()
    this.greeting.value = TemplateVar<string>('GREETING', 'PRFX_')
  }

  @abimethod({ onCreate: 'require' })
  create() {}
}

function getBigBytes() {
  return op.bzero(4096)
}

export class LargeProgram extends Contract {
  getBigBytesLength() {
    return getBigBytes().length
  }

  @abimethod({ allowActions: 'DeleteApplication' })
  delete() {}
}

/**
 * This logic sig can be used to create a custodial account that will allow any transaction to transfer its
 * funds/assets.
 */
export class TerribleCustodialAccount extends LogicSig {
  program() {
    return true
  }
}

export class ReceivesTxns extends Contract {
  getOne(): uint64 {
    return 1
  }

  receivesAnyTxn(txn: gtxn.Transaction): uint64 {
    switch (txn.type) {
      case TransactionType.AssetConfig:
        return txn.createdAsset.id || txn.configAsset.id
      case TransactionType.ApplicationCall:
        return txn.createdApp.id || txn.appId.id
      default:
        return 0
    }
  }

  receivesAssetConfig(assetCfg: gtxn.AssetConfigTxn): bytes {
    return assetCfg.txnId
  }
  receivesAssetConfigAndPay(assetCfg: gtxn.AssetConfigTxn, payTxn: gtxn.PaymentTxn): void {
    assert(assetCfg.type === TransactionType.AssetConfig)
    assert(payTxn.type === TransactionType.Payment)
  }
}

export class ReceivesReferenceTypes extends Contract {
  receivesReferenceTypes(app: Application, acc: Account, asset: Asset) {
    log(app.address)
    log(acc.bytes)
    log(asset.name)
  }
}
