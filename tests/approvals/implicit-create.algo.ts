import { abimethod, Contract } from '@algorandfoundation/algorand-typescript'
import { baremethod } from '@algorandfoundation/algorand-typescript/arc4'

export class NoBare extends Contract {
  @abimethod({ allowActions: 'NoOp' })
  public handleNoop() {}
}
export class NoNoOp extends Contract {
  @baremethod({ allowActions: 'UpdateApplication' })
  public handleUpdate() {}
}

class BaseWithBareCreate extends Contract {
  @baremethod({ onCreate: 'require' })
  public create() {}
}
class BaseWithAbiCreate extends Contract {
  @abimethod({ onCreate: 'require' })
  public create() {}
}
export class ExplicitBareCreateFromBase extends BaseWithBareCreate {}

export class ExplicitAbiCreateFromBase extends BaseWithAbiCreate {}
