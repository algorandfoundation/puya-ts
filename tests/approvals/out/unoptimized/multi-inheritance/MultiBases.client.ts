// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class MultiBases extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  methodMulti(): arc4.Str {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  methodCallsSuper(): arc4.Str {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  callB2CantOverride(): arc4.Str {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  callB2Common(): arc4.Str {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  methodOne(): arc4.Str {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  methodCommon(): arc4.Str {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  b2CantOverride(): arc4.Str {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  methodTwo(): arc4.Str {
    err('stub only')
  }
}
