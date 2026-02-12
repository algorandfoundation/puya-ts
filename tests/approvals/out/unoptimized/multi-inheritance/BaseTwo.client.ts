// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class BaseTwo extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  methodTwo(): arc4.Str {
    err('stub only')
  }

  /**
   * Because CommonBase implements this method, and MRO for polytype is depth first; this method
   * should not be accessible from MultiBases as the MRO should be `BaseOne => CommonBase => BaseTwo => CommonBase`
   * and since CommonBase provides an implementation, this one should not be used
   */
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  b2CantOverride(): arc4.Str {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  methodCommon(): arc4.Str {
    err('stub only')
  }
}
