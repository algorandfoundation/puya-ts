// This file is auto-generated, do not modify
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class ContractOne extends Contract {
  @abimethod()
  test(): arc4.Bool {
    err('stub only')
  }

  @abimethod()
  someMethod(): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod()
  testReferenceTypes(): void {
    err('stub only')
  }
}
