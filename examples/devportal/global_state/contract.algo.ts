import type { Account, Application, Asset, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { arc4, abimethod, assert, Bytes, clone, contract, Contract, GlobalMap, GlobalState, Uint64 } from '@algorandfoundation/algorand-typescript'

// example: GLOBAL_MAP_STRUCT
type Profile = {
  name: arc4.Str
  score: uint64
}

// example: GLOBAL_MAP_STRUCT

export class GlobalStorage extends Contract {
  // example: INIT_GLOBAL_STORAGE
  // Current puya-ts uses GlobalState proxies for both initialized and empty slots.
  globalIntFull = GlobalState({ initialValue: Uint64(50) })
  globalIntSimplified = GlobalState({ initialValue: Uint64(10) })
  globalIntNoDefault = GlobalState<uint64>()

  // example: INIT_BYTES
  globalBytesFull = GlobalState<bytes>({ initialValue: Bytes('Hello') })
  globalBytesSimplified = GlobalState<bytes>({ initialValue: Bytes('Hello') })
  globalBytesNoDefault = GlobalState<bytes>()
  // example: INIT_BYTES

  globalBoolSimplified = GlobalState({ initialValue: true })
  globalBoolNoDefault = GlobalState<boolean>()

  globalAsset = GlobalState<Asset>()
  globalApplication = GlobalState<Application>()
  globalAccount = GlobalState<Account>()
  // example: INIT_GLOBAL_STORAGE

  // example: READ_GLOBAL_STATE
  @abimethod()
  getGlobalState(): uint64 {
    // `hasValue ? value : default` mirrors Python's `.get(default=...)`.
    return this.globalIntNoDefault.hasValue ? this.globalIntNoDefault.value : Uint64(0)
  }

  @abimethod()
  maybeGlobalState(): readonly [uint64, boolean] {
    const exists = this.globalIntNoDefault.hasValue
    const value: uint64 = exists ? this.globalIntNoDefault.value : Uint64(0)
    return [value, exists] as const
  }

  @abimethod()
  getGlobalStateExample(): boolean {
    assert(this.globalIntFull.value === 50)
    assert(this.globalIntSimplified.value === 10)
    assert((this.globalIntNoDefault.hasValue ? this.globalIntNoDefault.value : Uint64(0)) === 0)
    assert(this.globalBytesFull.value === Bytes('Hello'))
    return true
  }

  // example: READ_GLOBAL_STATE

  // example: READ_GLOBAL_STATE_EXAMPLES
  @abimethod()
  maybeGlobalStateExample(): boolean {
    assert(this.globalIntFull.hasValue)
    assert(this.globalIntFull.value === 50)

    assert(this.globalBytesFull.hasValue)
    assert(this.globalBytesFull.value === Bytes('Hello'))

    assert(!this.globalAsset.hasValue)
    return true
  }

  // example: READ_GLOBAL_STATE_EXAMPLES

  // example: VALUE_PROPERTY_GLOBAL_STATE_EXAMPLES
  @abimethod()
  checkGlobalStateExample(): boolean {
    assert(this.globalIntFull.value === 50)
    assert(this.globalBytesFull.value === Bytes('Hello'))

    assert(this.globalIntSimplified.value === 10)
    assert(this.globalBytesSimplified.value === Bytes('Hello'))
    assert(this.globalBoolSimplified.value)

    assert(!this.globalIntNoDefault.hasValue)
    assert(!this.globalBytesNoDefault.hasValue)
    assert(!this.globalBoolNoDefault.hasValue)
    return true
  }

  // example: VALUE_PROPERTY_GLOBAL_STATE_EXAMPLES

  // example: WRITE_GLOBAL_STATE
  @abimethod()
  setGlobalState(value: bytes): void {
    this.globalBytesFull.value = value
  }

  // example: WRITE_GLOBAL_STATE

  // example: WRITE_GLOBAL_STATE_EXAMPLES
  @abimethod()
  setGlobalStateExample(
    valueBytes: bytes,
    valueAsset: Asset,
    valueApp: Application,
    valueAccount: Account,
    valueBool: boolean,
  ): void {
    this.globalBytesNoDefault.value = valueBytes
    assert(this.globalBytesNoDefault.value === valueBytes)

    this.globalBoolNoDefault.value = valueBool
    assert(this.globalBoolNoDefault.value === valueBool)

    this.globalAsset.value = valueAsset
    this.globalApplication.value = valueApp
    this.globalAccount.value = valueAccount

    this.globalIntSimplified.value = Uint64(99)
    assert(this.globalIntSimplified.value === 99)
  }

  // example: WRITE_GLOBAL_STATE_EXAMPLES

  // example: DELETE_GLOBAL_STATE
  @abimethod()
  delGlobalState(): boolean {
    this.globalIntFull.delete()
    assert(!this.globalIntFull.hasValue)
    return true
  }

  // example: DELETE_GLOBAL_STATE

  // example: DELETE_GLOBAL_STATE_EXAMPLES
  @abimethod()
  delGlobalStateExample(): boolean {
    this.globalBytesNoDefault.delete()
    this.globalBoolNoDefault.delete()
    this.globalAsset.delete()
    return true
  }

  // example: DELETE_GLOBAL_STATE_EXAMPLES

  @abimethod()
  passProxyToSubroutine(): uint64 {
    this.globalIntNoDefault.value = Uint64(44)
    return getGlobalStatePlus1(this.globalIntNoDefault)
  }

  @abimethod()
  dynamicKeyAccess(): readonly [uint64, bytes] {
    this.globalIntNoDefault.value = Uint64(7)
    this.globalBytesNoDefault.value = Bytes('hi')
    return [readGlobalUint64('globalIntNoDefault'), readGlobalBytes('globalBytesNoDefault')] as const
  }
}

function getGlobalStatePlus1(state: GlobalState<uint64>): uint64 {
  return state.value + 1
}

function readGlobalUint64(key: string): uint64 {
  return GlobalState<uint64>({ key }).value
}

function readGlobalBytes(key: string): bytes {
  return GlobalState<bytes>({ key }).value
}

@contract({ stateTotals: { globalUints: 16, globalBytes: 16 } })
export class GlobalStorageMap extends Contract {
  // example: INIT_GLOBAL_MAP
  scores = GlobalMap<string, uint64>()
  profiles = GlobalMap<uint64, Profile>({ keyPrefix: 'profile' })
  // example: INIT_GLOBAL_MAP

  // example: READ_GLOBAL_MAP
  @abimethod()
  getScore(name: string): uint64 {
    return this.scores(name).value
  }

  @abimethod()
  getScoreOrDefault(name: string): uint64 {
    return this.scores(name).hasValue ? this.scores(name).value : Uint64(0)
  }

  @abimethod()
  maybeScore(name: string): readonly [uint64, boolean] {
    const exists = this.scores(name).hasValue
    const value: uint64 = exists ? this.scores(name).value : Uint64(0)
    return [value, exists] as const
  }

  @abimethod()
  hasProfile(userId: uint64): boolean {
    return this.profiles(userId).hasValue
  }

  // example: READ_GLOBAL_MAP

  // example: WRITE_GLOBAL_MAP
  @abimethod()
  setScore(name: string, score: uint64): void {
    this.scores(name).value = score
  }

  @abimethod()
  setProfile(userId: uint64, profile: Profile): void {
    this.profiles(userId).value = clone(profile)
  }

  // example: WRITE_GLOBAL_MAP

  // example: DELETE_GLOBAL_MAP
  @abimethod()
  deleteScore(name: string): void {
    this.scores(name).delete()
  }

  // example: DELETE_GLOBAL_MAP

  @abimethod()
  getSlotProxy(name: string): uint64 {
    const slot = this.scores(name)
    return slot.value
  }
}
