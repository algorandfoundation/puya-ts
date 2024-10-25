import { Contract } from '@algorandfoundation/algorand-typescript'
import { baremethod } from '@algorandfoundation/algorand-typescript/arc4'

// @expect-error Non-abstract ARC4 contract has no methods which can be called to create the contract...
export class CantCreate extends Contract {
  @baremethod({ allowActions: 'NoOp' })
  public handleBare() {}
}

abstract class CantCreateAbstract extends Contract {
  @baremethod({ allowActions: 'NoOp' })
  public handleBare() {}
}

// @expect-error Non-abstract ARC4 contract has no methods which can be called to create the contract...
export class CantCreateBecauseBase extends CantCreateAbstract {}
