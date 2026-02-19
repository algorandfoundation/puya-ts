// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class BaseOne extends Contract {
  @abimethod({ onCreate: 'require' })
  methodOne(): arc4.Str {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  methodCommon(): arc4.Str {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  b2CantOverride(): arc4.Str {
    err('stub only')
  }
}
