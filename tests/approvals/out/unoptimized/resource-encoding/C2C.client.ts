// This file is auto-generated, do not modify
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class C2C extends Contract {
  @abimethod
  testCallToIndex(
    account: arc4.Address,
    appId: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod
  testCallToValue(
    account: arc4.Address,
    appId: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod
  testCallToEchoResource(): void {
    err('stub only')
  }
}
