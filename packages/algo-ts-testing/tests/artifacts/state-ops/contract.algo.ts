import { Account, Application, arc4, assert, Asset, bytes, op, Txn, uint64 } from '@algorandfoundation/algo-ts'

function get_1st_ref_index(): uint64 {
  return op.btoi(Txn.applicationArgs(1))
}

export class StateAcctParamsGetContract extends arc4.Contract {
  @arc4.abimethod()
  public verify_acct_balance(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctBalance(a)
    const [value_index, funded_index] = op.AcctParams.acctBalance(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(funded == funded_index, 'expected funded by index to match')
    assert(value == a.balance, 'expected Account balance to match')
    assert(value == op.balance(a), 'expected op.balance to match')
    assert(value == op.balance(get_1st_ref_index()), 'expected op.balance by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_min_balance(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctMinBalance(a)
    const [value_index, funded_index] = op.AcctParams.acctMinBalance(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(funded == funded_index, 'expected funded by index to match')
    assert(value == a.minBalance, 'expected Account min_balance to match')
    assert(value == op.minBalance(a), 'expected op.min_balance to match')
    assert(value == op.minBalance(get_1st_ref_index()), 'expected op.min_balance by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_auth_addr(a: Account): Account {
    const [value, funded] = op.AcctParams.acctAuthAddr(a)
    const [value_index, funded_index] = op.AcctParams.acctAuthAddr(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(funded == funded_index, 'expected funded by index to match')
    // TODO: return arc4.Address(value)
    return value
  }

  @arc4.abimethod()
  public verify_acct_total_num_uint(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctTotalNumUint(a)
    const [value_index, funded_index] = op.AcctParams.acctTotalNumUint(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(funded == funded_index, 'expected funded by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_total_num_byte_slice(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctTotalNumByteSlice(a)
    const [value_index, funded_index] = op.AcctParams.acctTotalNumByteSlice(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(funded == funded_index, 'expected funded by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_total_extra_app_pages(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctTotalExtraAppPages(a)
    const [value_index, funded_index] = op.AcctParams.acctTotalExtraAppPages(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(funded == funded_index, 'expected funded by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_total_apps_created(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctTotalAppsCreated(a)
    const [value_index, funded_index] = op.AcctParams.acctTotalAppsCreated(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(funded == funded_index, 'expected funded by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_total_apps_opted_in(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctTotalAppsOptedIn(a)
    const [value_index, funded_index] = op.AcctParams.acctTotalAppsOptedIn(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(funded == funded_index, 'expected funded by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_total_assets_created(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctTotalAssetsCreated(a)
    const [value_index, funded_index] = op.AcctParams.acctTotalAssetsCreated(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(funded == funded_index, 'expected funded by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_total_assets(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctTotalAssets(a)
    const [value_index, funded_index] = op.AcctParams.acctTotalAssets(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(funded == funded_index, 'expected funded by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_total_boxes(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctTotalBoxes(a)
    const [value_index, funded_index] = op.AcctParams.acctTotalBoxes(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(funded == funded_index, 'expected funded by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_total_box_bytes(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctTotalBoxBytes(a)
    const [value_index, funded_index] = op.AcctParams.acctTotalBoxBytes(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(funded == funded_index, 'expected funded by index to match')
    return value
  }
}

export class StateAssetHoldingContract extends arc4.Contract {
  @arc4.abimethod()
  public verify_asset_holding_get(a: Account, b: Asset): uint64 {
    const [balance, _val] = op.AssetHolding.assetBalance(a, b)
    return balance
  }

  @arc4.abimethod()
  public verify_asset_frozen_get(a: Account, b: Asset): boolean {
    const [frozen, _val] = op.AssetHolding.assetFrozen(a, b)
    return frozen
  }
}

export class StateAssetParamsContract extends arc4.Contract {
  @arc4.abimethod()
  public verify_asset_params_get_total(a: Asset): uint64 {
    const [value, exists] = op.AssetParams.assetTotal(a)
    const [value_index, exists_index] = op.AssetParams.assetTotal(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_decimals(a: Asset): uint64 {
    const [value, exists] = op.AssetParams.assetDecimals(a)
    const [value_index, exists_index] = op.AssetParams.assetDecimals(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_default_frozen(a: Asset): boolean {
    const [value, exists] = op.AssetParams.assetDefaultFrozen(a)
    const [value_index, exists_index] = op.AssetParams.assetDefaultFrozen(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_unit_name(a: Asset): bytes {
    const [value, exists] = op.AssetParams.assetUnitName(a)
    const [value_index, exists_index] = op.AssetParams.assetUnitName(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_name(a: Asset): bytes {
    const [value, exists] = op.AssetParams.assetName(a)
    const [value_index, exists_index] = op.AssetParams.assetName(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_url(a: Asset): bytes {
    const [value, exists] = op.AssetParams.assetUrl(a)
    const [value_index, exists_index] = op.AssetParams.assetUrl(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_metadata_hash(a: Asset): bytes {
    const [value, exists] = op.AssetParams.assetMetadataHash(a)
    const [value_index, exists_index] = op.AssetParams.assetMetadataHash(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_manager(a: Asset): Account {
    const [value, exists] = op.AssetParams.assetManager(a)
    const [value_index, exists_index] = op.AssetParams.assetManager(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    // TODO: return arc4.Address(value)
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_reserve(a: Asset): Account {
    const [value, exists] = op.AssetParams.assetReserve(a)
    const [value_index, exists_index] = op.AssetParams.assetReserve(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    // TODO: return arc4.Address(value)
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_freeze(a: Asset): Account {
    const [value, exists] = op.AssetParams.assetFreeze(a)
    const [value_index, exists_index] = op.AssetParams.assetFreeze(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    // TODO: return arc4.Address(value)
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_clawback(a: Asset): Account {
    const [value, exists] = op.AssetParams.assetClawback(a)
    const [value_index, exists_index] = op.AssetParams.assetClawback(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    // TODO: return arc4.Address(value)
    return value
  }

  @arc4.abimethod()
  public verify_asset_params_get_creator(a: Asset): Account {
    const [value, exists] = op.AssetParams.assetCreator(a)
    const [value_index, exists_index] = op.AssetParams.assetCreator(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    // TODO: return arc4.Address(value)
    return value
  }
}

export class StateAppParamsContract extends arc4.Contract {
  @arc4.abimethod()
  public verify_app_params_get_approval_program(a: Application): bytes {
    const [value, exists] = op.AppParams.appApprovalProgram(a)
    const [value_index, exists_index] = op.AppParams.appApprovalProgram(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_app_params_get_clear_state_program(a: Application): bytes {
    const [value, exists] = op.AppParams.appClearStateProgram(a)
    const [value_index, exists_index] = op.AppParams.appClearStateProgram(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_app_params_get_global_num_uint(a: Application): uint64 {
    const [value, exists] = op.AppParams.appGlobalNumUint(a)
    const [value_index, exists_index] = op.AppParams.appGlobalNumUint(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_app_params_get_global_num_byte_slice(a: Application): uint64 {
    const [value, exists] = op.AppParams.appGlobalNumByteSlice(a)
    const [value_index, exists_index] = op.AppParams.appGlobalNumByteSlice(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_app_params_get_local_num_uint(a: Application): uint64 {
    const [value, exists] = op.AppParams.appLocalNumUint(a)
    const [value_index, exists_index] = op.AppParams.appLocalNumUint(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_app_params_get_local_num_byte_slice(a: Application): uint64 {
    const [value, exists] = op.AppParams.appLocalNumByteSlice(a)
    const [value_index, exists_index] = op.AppParams.appLocalNumByteSlice(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_app_params_get_extra_program_pages(a: Application): uint64 {
    const [value, exists] = op.AppParams.appExtraProgramPages(a)
    const [value_index, exists_index] = op.AppParams.appExtraProgramPages(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_app_params_get_creator(a: Application): Account {
    const [value, exists] = op.AppParams.appCreator(a)
    const [value_index, exists_index] = op.AppParams.appCreator(get_1st_ref_index())
    assert(value == value_index, 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    // TODO: return arc4.Address(value)
    return value
  }

  @arc4.abimethod()
  public verify_app_params_get_address(a: Application): Account {
    const [value, exists] = op.AppParams.appAddress(a)
    const [value_index, exists_index] = op.AppParams.appAddress(get_1st_ref_index())
    // TODO: recompile when puya ts is ready
    assert(value.bytes.toString() == value_index.bytes.toString(), 'expected value by index to match')
    assert(exists == exists_index, 'expected exists by index to match')
    // TODO: return arc4.Address(value)
    return value
  }
}
