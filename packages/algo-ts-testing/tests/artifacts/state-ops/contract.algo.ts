import { arc4, assert, Asset, op, Txn, uint64 } from '@algorandfoundation/algo-ts';

function get_1st_ref_index(): uint64 {
  return op.btoi(Txn.applicationArgs(1))
}

export class StateAssetParamsContract extends arc4.Contract {
  @arc4.abimethod()
  public verify_asset_params_get_total(a: Asset): uint64 {
    const [value, exists] = op.AssetParams.assetTotal(a)
    const [value_index, exists_index] = op.AssetParams.assetTotal(get_1st_ref_index())
    assert(value == value_index, "expected value by index to match")
    assert(exists == exists_index, "expected exists by index to match")
    return value
  }
}
