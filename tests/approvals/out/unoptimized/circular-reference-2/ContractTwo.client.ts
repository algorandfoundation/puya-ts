// This file is auto-generated, do not modify
/* eslint-disable */
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class ContractTwo extends Contract {
  @abimethod()
  test(appId: arc4.Uint<64>): void {
    err('stub only')
  }

  @abimethod()
  test2(): arc4.StaticArray<arc4.Byte, 4> {
    err('stub only')
  }

  @abimethod()
  test3(appId: arc4.Uint<64>): void {
    err('stub only')
  }
}
