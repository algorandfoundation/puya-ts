// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class C2C extends Contract {
  @abimethod({ onCreate: 'require' })
  testCallToIndex(
    account: arc4.Address,
    appId: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  testCallToValue(
    account: arc4.Address,
    appId: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  testCallToEchoResource(): void {
    err('stub only')
  }
}
