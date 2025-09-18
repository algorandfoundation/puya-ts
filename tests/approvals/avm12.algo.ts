import {
  abimethod,
  arc4,
  assert,
  Bytes,
  contract,
  Contract,
  itxn,
  OnCompleteAction,
  op,
  Txn,
} from '@algorandfoundation/algorand-typescript'

@contract({ avmVersion: 12 })
class Avm12Contract extends Contract {
  testFalconVerify() {
    assert(!op.falconVerify(Bytes(), Bytes(), op.bzero(1793).toFixed({ length: 1793 })))
  }

  testRejectVersion() {
    const compiledV0 = arc4.compileArc4(ContractV0)
    const v0Txn = compiledV0.bareCreate()
    const app = v0Txn.createdApp
    assert(app.version === 0, 'should be version 0')

    const compiledV1 = arc4.compileArc4(ContractV1)

    const v1Txn = compiledV0.call.update({
      rejectVersion: 1,
      appId: app,
      onCompletion: OnCompleteAction.UpdateApplication,
      approvalProgram: compiledV1.approvalProgram,
      clearStateProgram: compiledV1.clearStateProgram,
      extraProgramPages: compiledV1.extraProgramPages,
    })
    assert(v1Txn.itxn.appId.version === 1, 'should be version 1')

    itxn
      .applicationCall({
        appArgs: [arc4.methodSelector(ContractV1.prototype.delete)],
        onCompletion: OnCompleteAction.DeleteApplication,
        appId: app,
        rejectVersion: 2,
      })
      .submit()
  }
}

@contract({ avmVersion: 12 })
class ContractV0 extends Contract {
  @abimethod({ allowActions: 'UpdateApplication' })
  update() {
    assert(Txn.rejectVersion === 1, 'can only update if caller expects this to be currently be v0')
  }
}

@contract({ avmVersion: 12 })
class ContractV1 extends Contract {
  @abimethod({ allowActions: 'DeleteApplication' })
  delete() {
    assert(Txn.rejectVersion === 2, 'can only update if caller expects this to be currently be v1')
  }
}
