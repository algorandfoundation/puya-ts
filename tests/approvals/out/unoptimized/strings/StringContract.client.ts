// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class StringContract extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  join(
    a: arc4.Str,
    b: arc4.Str,
  ): arc4.Str {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  interpolate(a: arc4.Str): arc4.Str {
    err('stub only')
  }
}
