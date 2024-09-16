import { Account, arc4, assert, Asset, bytes, op, Txn, uint64 } from '@algorandfoundation/algo-ts';

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

  @arc4.abimethod()
  public verify_asset_params_get_decimals(a: Asset): uint64 {
    const [value, exists] = op.AssetParams.assetDecimals(a)
    const [value_index, exists_index] = op.AssetParams.assetDecimals(get_1st_ref_index())
    assert(value == value_index, "expected value by index to match")
    assert(exists == exists_index, "expected exists by index to match")
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_default_frozen(a: Asset): boolean {
    const [value, exists] = op.AssetParams.assetDefaultFrozen(a)
    const [value_index, exists_index] = op.AssetParams.assetDefaultFrozen(get_1st_ref_index())
    assert(value == value_index, "expected value by index to match")
    assert(exists == exists_index, "expected exists by index to match")
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_unit_name(a: Asset): bytes {
    const [value, exists] = op.AssetParams.assetUnitName(a)
    const [value_index, exists_index] = op.AssetParams.assetUnitName(get_1st_ref_index())
    assert(value == value_index, "expected value by index to match")
    assert(exists == exists_index, "expected exists by index to match")
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_name(a: Asset): bytes {
    const [value, exists] = op.AssetParams.assetName(a)
    const [value_index, exists_index] = op.AssetParams.assetName(get_1st_ref_index())
    assert(value == value_index, "expected value by index to match")
    assert(exists == exists_index, "expected exists by index to match")
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_url(a: Asset): bytes {
    const [value, exists] = op.AssetParams.assetUrl(a)
    const [value_index, exists_index] = op.AssetParams.assetUrl(get_1st_ref_index())
    assert(value == value_index, "expected value by index to match")
    assert(exists == exists_index, "expected exists by index to match")
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_metadata_hash(a: Asset): bytes {
    const [value, exists] = op.AssetParams.assetMetadataHash(a)
    const [value_index, exists_index] = op.AssetParams.assetMetadataHash(get_1st_ref_index())
    assert(value == value_index, "expected value by index to match")
    assert(exists == exists_index, "expected exists by index to match")
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_manager(a: Asset): Account {
    const [value, exists] = op.AssetParams.assetManager(a)
    const [value_index, exists_index] = op.AssetParams.assetManager(get_1st_ref_index())
    assert(value == value_index, "expected value by index to match")
    assert(exists == exists_index, "expected exists by index to match")
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_reserve(a: Asset): Account {
    const [value, exists] = op.AssetParams.assetReserve(a)
    const [value_index, exists_index] = op.AssetParams.assetReserve(get_1st_ref_index())
    assert(value == value_index, "expected value by index to match")
    assert(exists == exists_index, "expected exists by index to match")
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_freeze(a: Asset): Account {
    const [value, exists] = op.AssetParams.assetFreeze(a)
    const [value_index, exists_index] = op.AssetParams.assetFreeze(get_1st_ref_index())
    assert(value == value_index, "expected value by index to match")
    assert(exists == exists_index, "expected exists by index to match")
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_clawback(a: Asset): Account {
    const [value, exists] = op.AssetParams.assetClawback(a)
    const [value_index, exists_index] = op.AssetParams.assetClawback(get_1st_ref_index())
    assert(value == value_index, "expected value by index to match")
    assert(exists == exists_index, "expected exists by index to match")
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_creator(a: Asset): Account {
    const [value, exists] = op.AssetParams.assetCreator(a)
    const [value_index, exists_index] = op.AssetParams.assetCreator(get_1st_ref_index())
    assert(value == value_index, "expected value by index to match")
    assert(exists == exists_index, "expected exists by index to match")
    return value
  }

}
