// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class AbiDecorators extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  justNoop(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  createMethod(): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  allActions(): void {
    err('stub only')
  }

  @abimethod({ readonly: true, allowActions: ['NoOp'], onCreate: 'require' })
  overrideReadonlyName(): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  methodWithDefaults(
    a: arc4.Uint<64>,
    b: arc4.Uint<64>,
    c: arc4.Uint<64>,
  ): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ readonly: true, allowActions: ['NoOp'], onCreate: 'require' })
  readonlyAlt(): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ readonly: true, allowActions: ['NoOp', 'NoOp'], onCreate: 'allow' })
  readonlyAlt2(): arc4.Uint<64> {
    err('stub only')
  }
}
