// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class ContractOne extends Contract {
  @abimethod({ onCreate: 'require' })
  test(): arc4.Bool {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  someMethod(): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  testReferenceTypes(): void {
    err('stub only')
  }
}
