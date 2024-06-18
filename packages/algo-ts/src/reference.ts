import { uint64, bytes, BytesBacked, BytesCompat, Bytes } from './primitives'
import { ctxMgr } from './execution-context'

export type Account = {
  readonly bytes: bytes
}
export function Account(): Account
export function Account(address: bytes): Account
export function Account(address?: bytes): Account {
  return ctxMgr.instance.account(address)
}

export function Asset(): Asset
export function Asset(assetId: uint64): Asset
export function Asset(assetId?: uint64): Asset {
  return ctxMgr.instance.asset(assetId)
}
/**
 * An Asset on the Algorand network.
 */
export type Asset = {
  /**
   * Returns the id of the Asset
   */
  readonly id: uint64

  /**
   * Total number of units of this asset
   */
  readonly total: uint64

  /**
   * @see AssetParams.Decimals
   */
  readonly decimals: uint64

  /**
   * Frozen by default or not
   */
  readonly defaultFrozen: boolean

  /**
   * Asset unit name
   */
  readonly unitName: bytes

  /**
   * Asset name
   */
  readonly name: bytes

  /**
   * URL with additional info about the asset
   */
  readonly url: bytes

  /**
   * Arbitrary commitment
   */
  readonly metadataHash: bytes

  /**
   * Manager address
   */
  readonly manager: Account

  /**
   * Reserve address
   */
  readonly reserve: Account

  /**
   * Freeze address
   */
  readonly freeze: Account

  /**
   * Clawback address
   */
  readonly clawback: Account

  /**
   * Creator address
   */
  readonly creator: Account

  /**
   * Amount of the asset unit held by this account. Fails if the account has not
   * opted in to the asset.
   * Asset and supplied Account must be an available resource
   * @param account Account
   * @return balance: uint64
   */
  balance(account: Account): uint64

  /**
   * Is the asset frozen or not. Fails if the account has not
   * opted in to the asset.
   * Asset and supplied Account must be an available resource
   * @param account Account
   * @return isFrozen: boolean
   */
  frozen(account: Account): boolean
}
export function Application(applicationId: uint64): Application {
  return ctxMgr.instance.application(applicationId)
}

/**
 * An Application on the Algorand network.
 */
export type Application = {
  /**
   * The id of this application on the current network
   */
  readonly id: uint64
  /**
   * Bytecode of Approval Program
   */
  readonly approvalProgram: bytes

  /**
   * Bytecode of Clear State Program
   */
  readonly clearStateProgram: bytes

  /**
   * Number of uint64 values allowed in Global State
   */
  readonly globalNumUint: uint64

  /**
   * Number of byte array values allowed in Global State
   */
  readonly globalNumBytes: uint64

  /**
   * Number of uint64 values allowed in Local State
   */
  readonly localNumUint: uint64

  /**
   * Number of byte array values allowed in Local State
   */
  readonly localNumBytes: uint64

  /**
   * Number of Extra Program Pages of code space
   */
  readonly extraProgramPages: uint64

  /**
   * Creator address
   */
  readonly creator: Account

  /**
   * Address for which this application has authority
   */
  readonly address: Account
}
