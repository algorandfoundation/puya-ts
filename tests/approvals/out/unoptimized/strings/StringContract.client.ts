// This file is auto-generated, do not modify
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class StringContract extends Contract {
  @abimethod()
  join(
    a: arc4.Str,
    b: arc4.Str,
  ): arc4.Str {
    err('stub only')
  }

  @abimethod()
  interpolate(a: arc4.Str): arc4.Str {
    err('stub only')
  }
}
