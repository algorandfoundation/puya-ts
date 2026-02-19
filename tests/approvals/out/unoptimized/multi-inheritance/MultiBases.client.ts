// This file is auto-generated, do not modify
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class MultiBases extends Contract {
  @abimethod
  methodMulti(): arc4.Str {
    err('stub only')
  }

  @abimethod
  methodCallsSuper(): arc4.Str {
    err('stub only')
  }

  @abimethod
  callB2CantOverride(): arc4.Str {
    err('stub only')
  }

  @abimethod
  callB2Common(): arc4.Str {
    err('stub only')
  }

  @abimethod
  methodOne(): arc4.Str {
    err('stub only')
  }

  @abimethod
  methodCommon(): arc4.Str {
    err('stub only')
  }

  @abimethod
  b2CantOverride(): arc4.Str {
    err('stub only')
  }

  @abimethod
  methodTwo(): arc4.Str {
    err('stub only')
  }
}
