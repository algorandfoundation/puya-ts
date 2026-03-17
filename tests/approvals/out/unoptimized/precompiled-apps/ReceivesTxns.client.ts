// This file is auto-generated, do not modify
/* eslint-disable */
import type { arc4, gtxn } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class ReceivesTxns extends Contract {
  @abimethod()
  getOne(): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod()
  receivesAnyTxn(txn: gtxn.Transaction): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod()
  receivesAssetConfig(assetCfg: gtxn.AssetConfigTxn): arc4.DynamicBytes {
    err('stub only')
  }

  @abimethod()
  receivesAssetConfigAndPay(
    assetCfg: gtxn.AssetConfigTxn,
    payTxn: gtxn.PaymentTxn,
  ): void {
    err('stub only')
  }
}
