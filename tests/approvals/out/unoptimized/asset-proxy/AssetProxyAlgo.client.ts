// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class AssetProxyAlgo extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testAsset(asset: arc4.Uint<64>): void {
    err('stub only')
  }
}
