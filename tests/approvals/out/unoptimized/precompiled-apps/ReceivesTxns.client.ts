// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4, type gtxn } from '@algorandfoundation/algorand-typescript'

export abstract class ReceivesTxns extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  getOne(): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  receivesAnyTxn(txn: gtxn.Transaction): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  receivesAssetConfig(assetCfg: gtxn.AssetConfigTxn): arc4.DynamicBytes {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  receivesAssetConfigAndPay(
    assetCfg: gtxn.AssetConfigTxn,
    payTxn: gtxn.PaymentTxn,
  ): void {
    err('stub only')
  }
}
