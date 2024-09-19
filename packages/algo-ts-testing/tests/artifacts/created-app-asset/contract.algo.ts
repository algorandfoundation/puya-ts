import { arc4, assert, gtxn, op, uint64 } from '@algorandfoundation/algo-ts';

export class AppExpectingEffects extends arc4.Contract {
  @arc4.abimethod()
  public create_group(assetCreate: gtxn.AssetConfigTxn, appCreate: gtxn.ApplicationTxn): readonly [uint64, uint64] {
    assert(assetCreate.createdAsset.id, "expected asset created")
    assert(op.gaid(assetCreate.groupIndex) == assetCreate.createdAsset.id, "expected correct asset id")
    assert(appCreate.createdApp.id, "expected app created")
    assert(op.gaid(appCreate.groupIndex) == appCreate.createdApp.id, "expected correct app id")

    return [assetCreate.createdAsset.id, appCreate.createdApp.id]
  }

  // TODO: uncomment when arc4 stubs are implemented
  // @arc4.abimethod()
  // public log_group(appCall: gtxn.ApplicationTxn): void {
  //   assert(appCall.appArgs(0) == arc4.arc4Signature("some_value()uint64"), "expected correct method called")
  //   assert(appCall.numLogs == 1, "expected logs")
  //   assert(arc4.UInt64.from_log(appCall.lastLog) == (appCall.groupIndex + 1) * Global.groupSize)
  // }
}


