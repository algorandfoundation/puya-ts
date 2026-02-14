// This file is auto-generated, do not modify
import { Contract, abimethod, arc4, err } from '@algorandfoundation/algorand-typescript'

export class Object3B1036D9 extends arc4.Struct<{
  bytes: arc4.StaticArray<arc4.Byte, 32>
  balance: arc4.Uint<64>
  minBalance: arc4.Uint<64>
  authAddress: arc4.StaticArray<arc4.Byte, 32>
  totalNumUint: arc4.Uint<64>
  totalNumByteSlice: arc4.Uint<64>
  totalExtraAppPages: arc4.Uint<64>
  totalAppsCreated: arc4.Uint<64>
  totalAppsOptedIn: arc4.Uint<64>
  totalAssetsCreated: arc4.Uint<64>
  totalAssets: arc4.Uint<64>
  totalBoxes: arc4.Uint<64>
  totalBoxBytes: arc4.Uint<64>
  isOptInApp: arc4.Bool
  isOptInAsset: arc4.Bool
}> {}

export abstract class AccountsContract extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  getAccountInfo(
    account: arc4.Address,
    asset: arc4.Uint<64>,
  ): Object3B1036D9 {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  otherAccount(): void {
    err('stub only')
  }
}
