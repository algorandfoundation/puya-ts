// This file is auto-generated, do not modify
/* eslint-disable */
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class AbiDecorators extends Contract {
  @abimethod()
  justNoop(): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  createMethod(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp', 'OptIn', 'CloseOut', 'UpdateApplication', 'DeleteApplication'] })
  allActions(): void {
    err('stub only')
  }

  @abimethod({ readonly: true })
  overrideReadonlyName(): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod()
  methodWithDefaults(
    a: arc4.Uint<64>,
    b: arc4.Uint<64>,
    c: arc4.Uint<64>,
  ): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ readonly: true })
  readonlyAlt(): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ readonly: true, onCreate: 'allow' })
  readonlyAlt2(): arc4.Uint<64> {
    err('stub only')
  }
}
