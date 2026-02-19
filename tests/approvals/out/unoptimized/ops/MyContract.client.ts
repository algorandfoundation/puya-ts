// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class MyContract extends Contract {
  @abimethod
  test(): void {
    err('stub only')
  }

  @abimethod
  test2(size: arc4.Uint<64>): void {
    err('stub only')
  }
}
