// This file is auto-generated, do not modify
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class TestArc4 extends Contract {
  @abimethod
  setState(
    key: arc4.Str,
    value: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod
  deleteState(key: arc4.Str): void {
    err('stub only')
  }
}
