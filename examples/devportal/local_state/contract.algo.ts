import type { Account, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import {
  abimethod,
  Application,
  assert,
  Asset,
  Bytes,
  contract,
  Contract,
  Global,
  LocalMap,
  LocalState,
  Txn,
  Uint64,
} from '@algorandfoundation/algorand-typescript'

export class LocalStorage extends Contract {
  // example: INIT_LOCAL_STORAGE
  localInt = LocalState<uint64>()
  localBytes = LocalState<bytes>()
  localBool = LocalState<boolean>()
  localAsset = LocalState<Asset>()
  localApplication = LocalState<Application>()
  localAccount = LocalState<Account>()
  // example: INIT_LOCAL_STORAGE

  @abimethod({ allowActions: 'OptIn' })
  public optIn(): void {
    this.localInt(Txn.sender).value = 10
    this.localBytes(Txn.sender).value = Bytes('Hello')
    this.localBool(Txn.sender).value = true
    this.localAsset(Txn.sender).value = Asset(10)
    this.localApplication(Txn.sender).value = Application(10)
    this.localAccount(Txn.sender).value = Global.zeroAddress
  }

  // example: CONTAIN_PROPERTY_LOCAL_STATE
  public containsLocalData(forAccount: Account): boolean {
    // `state(account).hasValue` is true if the account has a value at this slot.
    return this.localInt(forAccount).hasValue
  }

  // example: CONTAIN_PROPERTY_LOCAL_STATE

  // example: CONTAIN_PROPERTY_LOCAL_STATE_EXAMPLES
  public containsLocalDataExample(forAccount: Account): boolean {
    assert(this.localInt(forAccount).hasValue)
    assert(this.localBytes(forAccount).hasValue)
    assert(this.localBool(forAccount).hasValue)
    assert(this.localAsset(forAccount).hasValue)
    assert(this.localApplication(forAccount).hasValue)
    assert(this.localAccount(forAccount).hasValue)
    return true
  }

  // example: CONTAIN_PROPERTY_LOCAL_STATE_EXAMPLES

  // example: READ_LOCAL_STATE
  public getItemLocalData(forAccount: Account): uint64 {
    // `state(account).value` returns the stored value; fails if the account has none.
    return this.localInt(forAccount).value
  }

  public getLocalDataWithDefaultInt(forAccount: Account): uint64 {
    return this.localInt(forAccount).hasValue ? this.localInt(forAccount).value : Uint64(0)
  }

  public maybeLocalData(forAccount: Account): readonly [uint64, boolean] {
    const exists = this.localInt(forAccount).hasValue
    const result: uint64 = exists ? this.localInt(forAccount).value : Uint64(0)
    return [result, exists] as const
  }

  // example: READ_LOCAL_STATE

  // example: READ_LOCAL_STATE_EXAMPLES
  public getItemLocalDataExample(forAccount: Account): boolean {
    assert(this.localInt(forAccount).value === 10)
    assert(this.localBytes(forAccount).value === Bytes('Hello'))
    assert(this.localBool(forAccount).value)
    assert(this.localAsset(forAccount).value === Asset(10))
    assert(this.localApplication(forAccount).value === Application(10))
    assert(this.localAccount(forAccount).value === Global.zeroAddress)
    return true
  }

  public getLocalDataWithDefault(forAccount: Account): boolean {
    assert((this.localInt(forAccount).hasValue ? this.localInt(forAccount).value : Uint64(0)) === 10)
    assert((this.localBytes(forAccount).hasValue ? this.localBytes(forAccount).value : Bytes('Default Value')) === Bytes('Hello'))
    assert(this.localBool(forAccount).hasValue ? this.localBool(forAccount).value : false)
    assert((this.localAsset(forAccount).hasValue ? this.localAsset(forAccount).value : Asset(0)) === Asset(10))
    assert((this.localApplication(forAccount).hasValue ? this.localApplication(forAccount).value : Application(0)) === Application(10))
    assert((this.localAccount(forAccount).hasValue ? this.localAccount(forAccount).value : Global.zeroAddress) === Global.zeroAddress)
    return true
  }

  public maybeLocalDataExample(forAccount: Account): boolean {
    assert(this.localInt(forAccount).hasValue, 'no data for account')
    assert(this.localInt(forAccount).value === 10)
    return true
  }

  // example: READ_LOCAL_STATE_EXAMPLES

  // example: WRITE_LOCAL_STATE
  public setLocalInt(forAccount: Account, value: uint64): void {
    // `state(account).value = value` writes the per-account slot.
    this.localInt(forAccount).value = value
  }

  // example: WRITE_LOCAL_STATE

  // example: WRITE_LOCAL_STATE_EXAMPLES
  public setLocalDataExample(
    forAccount: Account,
    valueAsset: Asset,
    valueAccount: Account,
    valueApp: Application,
    valueBytes: bytes,
    valueBool: boolean,
  ): boolean {
    this.localBytes(forAccount).value = valueBytes
    assert(this.localBytes(forAccount).value === valueBytes)

    this.localBool(forAccount).value = valueBool
    assert(this.localBool(forAccount).value === valueBool)

    this.localAsset(forAccount).value = valueAsset
    assert(this.localAsset(forAccount).value === valueAsset)

    this.localApplication(forAccount).value = valueApp
    assert(this.localApplication(forAccount).value === valueApp)

    this.localAccount(forAccount).value = valueAccount
    assert(this.localAccount(forAccount).value === valueAccount)
    return true
  }

  // example: WRITE_LOCAL_STATE_EXAMPLES

  // example: DELETE_LOCAL_STATE
  public deleteLocalData(forAccount: Account): void {
    // `state(account).delete()` removes the per-account value.
    this.localInt(forAccount).delete()
  }

  // example: DELETE_LOCAL_STATE

  // example: DELETE_LOCAL_STATE_EXAMPLES
  public deleteLocalDataExample(forAccount: Account): boolean {
    this.localInt(forAccount).delete()
    this.localBytes(forAccount).delete()
    this.localBool(forAccount).delete()
    this.localAsset(forAccount).delete()
    this.localApplication(forAccount).delete()
    this.localAccount(forAccount).delete()
    return true
  }

  // example: DELETE_LOCAL_STATE_EXAMPLES

  public passProxyToSubroutine(forAccount: Account): uint64 {
    // LocalState proxies can be passed to subroutines like any value.
    return readLocalIntPlus1(this.localInt, forAccount)
  }
}

// A LocalState<T> proxy can be passed to and read from a subroutine.
function readLocalIntPlus1(state: LocalState<uint64>, account: Account): uint64 {
  return state(account).value + 1
}

@contract({ stateTotals: { localUints: 16 } })
export class LocalStorageMap extends Contract {
  // example: INIT_LOCAL_MAP
  balances = LocalMap<string, uint64>()
  flags = LocalMap<uint64, boolean>({ keyPrefix: 'flag' })
  // example: INIT_LOCAL_MAP

  @abimethod({ allowActions: 'OptIn' })
  public optIn(): void {
    this.balances('USD', Txn.sender).value = 100
    this.flags(0, Txn.sender).value = true
  }

  // example: READ_LOCAL_MAP
  public getBalance(account: Account, currency: string): uint64 {
    // Indexing reads the slot for `(account, key)`; fails if not present.
    return this.balances(currency, account).value
  }

  public getBalanceOrDefault(account: Account, currency: string): uint64 {
    return this.balances(currency, account).hasValue ? this.balances(currency, account).value : Uint64(0)
  }

  public maybeBalance(account: Account, currency: string): readonly [uint64, boolean] {
    const exists = this.balances(currency, account).hasValue
    const result: uint64 = exists ? this.balances(currency, account).value : Uint64(0)
    return [result, exists] as const
  }

  public hasFlag(account: Account, key: uint64): boolean {
    // `map(key, account).hasValue` is true if the slot has a stored value.
    return this.flags(key, account).hasValue
  }

  // example: READ_LOCAL_MAP

  // example: WRITE_LOCAL_MAP
  public setBalance(account: Account, currency: string, value: uint64): void {
    this.balances(currency, account).value = value
  }

  public setFlag(account: Account, key: uint64, value: boolean): void {
    this.flags(key, account).value = value
  }

  // example: WRITE_LOCAL_MAP

  // example: DELETE_LOCAL_MAP
  public deleteBalance(account: Account, currency: string): void {
    this.balances(currency, account).delete()
  }

  // example: DELETE_LOCAL_MAP

  public getSlotProxy(account: Account, currency: string): uint64 {
    const slot = this.balances(currency)
    return slot(account).value
  }
}
