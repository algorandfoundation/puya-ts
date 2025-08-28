import type { Application, uint64 } from '@algorandfoundation/algorand-typescript'
import { baremethod, Contract } from '@algorandfoundation/algorand-typescript'
import { abiCall } from '@algorandfoundation/algorand-typescript/arc4'

class MyContract extends Contract {
  test(appId: Application) {
    // @expect-error subroutine does not appear to be a contract method. Ensure you are calling a function defined on a contract class...
    abiCall<typeof subroutine>({ appId })

    // @expect-error approvalProgram is not an ABI method. Only ABI compatible methods can be called with this helper.
    abiCall<typeof OtherContract.prototype.approvalProgram>({ appId })

    // @expect-error sneakyBare is not an ABI method. Only ABI compatible methods can be called with this helper.
    abiCall<typeof OtherContract.prototype.sneakyBare>({ appId })

    // No error, this is fine
    abiCall({
      method: OtherContract.prototype.deleteApplication,
      appId,
    })
  }
}

function subroutine(): uint64 {
  return 123
}

class OtherContract extends Contract {
  override approvalProgram(): boolean {
    return super.approvalProgram()
  }

  @baremethod({ allowActions: 'OptIn' })
  sneakyBare() {}

  deleteApplication() {}
}
