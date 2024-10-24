import { abimethod, Contract } from '@algorandfoundation/algorand-typescript'
import { baremethod } from '@algorandfoundation/algorand-typescript/arc4'

// @expect-error Non-abstract ARC4 contract has no methods which can be called to create the contract...
export class CantCreate extends Contract {
  @baremethod({ allowActions: 'NoOp' })
  public handleBare() {}
}

export abstract class CantCreateAbstract extends Contract {
  @baremethod({ allowActions: 'NoOp' })
  public handleBare() {}
}

export abstract class NoBare extends Contract {
  @abimethod({ allowActions: 'NoOp' })
  public handleNoop() {}
}
export abstract class NoNoOp extends Contract {
  @baremethod({ allowActions: 'UpdateApplication' })
  public handleUpdate() {}
}
