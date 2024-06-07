import { uint64, bytes, BytesBacked, BytesCompat, Bytes } from './primitives'
import { ctxMgr } from './execution-context'

export class Account implements BytesBacked {
  #address: bytes
  constructor(address: bytes) {
    this.#address = address
  }

  get bytes(): bytes {
    return this.#address
  }

  static from_bytes(value: BytesCompat): Account {
    return new Account(Bytes(value))
  }
}
/**
 * An Asset on the Algorand network.
 */
export class Asset {
  #id: uint64
  constructor(assetId: uint64) {
    this.#id = assetId
  }
  /**
   * Returns the id of the Asset
   */
  get id(): uint64 {
    return this.#id
  }

  /**
   * Total number of units of this asset
   */
  get total(): uint64 {
    return ctxMgr.instance.asset(this.#id).total
  }

  /**
   * @see AssetParams.Decimals
   */
  get decimals(): uint64 {
    return ctxMgr.instance.asset(this.#id).decimals
  }

  /**
   * Frozen by default or not
   */
  get defaultFrozen(): boolean {
    return ctxMgr.instance.asset(this.#id).defaultFrozen
  }

  /**
   * Asset unit name
   */
  get unitName(): bytes {
    return ctxMgr.instance.asset(this.#id).unitName
  }

  /**
   * Asset name
   */
  get name(): bytes {
    return ctxMgr.instance.asset(this.#id).name
  }

  /**
   * URL with additional info about the asset
   */
  get url(): bytes {
    return ctxMgr.instance.asset(this.#id).url
  }

  /**
   * Arbitrary commitment
   */
  get metadataHash(): bytes {
    return ctxMgr.instance.asset(this.#id).metadataHash
  }

  /**
   * Manager address
   */
  get manager(): Account {
    return ctxMgr.instance.asset(this.#id).manager
  }

  /**
   * Reserve address
   */
  get reserve(): Account {
    return ctxMgr.instance.asset(this.#id).reserve
  }

  /**
   * Freeze address
   */
  get freeze(): Account {
    return ctxMgr.instance.asset(this.#id).freeze
  }

  /**
   * Clawback address
   */
  get clawback(): Account {
    return ctxMgr.instance.asset(this.#id).clawback
  }

  /**
   * Creator address
   */
  get creator(): Account {
    return ctxMgr.instance.asset(this.#id).creator
  }

  /**
   * Amount of the asset unit held by this account. Fails if the account has not
   * opted in to the asset.
   * Asset and supplied Account must be an available resource
   * @param account: Account
   * @return balance: uint64
   */
  balance(account: Account): uint64 {
    return ctxMgr.instance.asset(this.#id).balance(account)
  }

  /**
   * Is the asset frozen or not. Fails if the account has not
   * opted in to the asset.
   * Asset and supplied Account must be an available resource
   * @param account: Account
   * @return isFrozen: boolean
   */
  frozen(account: Account): boolean {
    return ctxMgr.instance.asset(this.#id).frozen(account)
  }
}
/**
 * An Application on the Algorand network.
 */
export class Application {
  #id: uint64
  constructor(applicationId: uint64) {
    this.#id = applicationId
  }
  get id(): uint64 {
    return this.#id
  }
  /**
   * Bytecode of Approval Program
   */
  get approvalProgram(): bytes {
    return ctxMgr.instance.application(this.#id).approvalProgram
  }

  /**
   * Bytecode of Clear State Program
   */
  get clearStateProgram(): bytes {
    return ctxMgr.instance.application(this.#id).clearStateProgram
  }

  /**
   * Number of uint64 values allowed in Global State
   */
  get globalNumUint(): uint64 {
    return ctxMgr.instance.application(this.#id).globalNumUint
  }

  /**
   * Number of byte array values allowed in Global State
   */
  get globalNumBytes(): uint64 {
    return ctxMgr.instance.application(this.#id).globalNumBytes
  }

  /**
   * Number of uint64 values allowed in Local State
   */
  get localNumUint(): uint64 {
    return ctxMgr.instance.application(this.#id).localNumUint
  }

  /**
   * Number of byte array values allowed in Local State
   */
  get localNumBytes(): uint64 {
    return ctxMgr.instance.application(this.#id).localNumBytes
  }

  /**
   * Number of Extra Program Pages of code space
   */
  get extraProgramPages(): uint64 {
    return ctxMgr.instance.application(this.#id).extraProgramPages
  }

  /**
   * Creator address
   */
  get creator(): Account {
    return ctxMgr.instance.application(this.#id).creator
  }

  /**
   * Address for which this application has authority
   */
  get address(): Account {
    return ctxMgr.instance.application(this.#id).address
  }
}
