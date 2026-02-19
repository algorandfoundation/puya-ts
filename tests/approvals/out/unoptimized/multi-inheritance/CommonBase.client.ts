// This file is auto-generated, do not modify
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class CommonBase extends Contract {
  @abimethod()
  methodCommon(): arc4.Str {
    err('stub only')
  }

  @abimethod()
  b2CantOverride(): arc4.Str {
    err('stub only')
  }
}
