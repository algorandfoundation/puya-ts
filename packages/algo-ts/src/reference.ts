import { NoImplementation } from './internal/errors'
import { bytes, uint64 } from './primitives'

export type Account = {
  readonly bytes: bytes

  /**
   * Account balance in microalgos
   *
   * Account must be an available resource
   */
  readonly balance: uint64

  /**
   * Minimum required balance for account, in microalgos
   *
   * Account must be an available resource
   */
  readonly minBalance: uint64

  /**
   * Address the account is rekeyed to
   *
   * Account must be an available resource
   */
  readonly authAddress: Account

  /**
   * The total number of uint64 values allocated by this account in Global and Local States.
   *
   * Account must be an available resource
   */
  readonly totalNumUint: uint64

  /**
   * The total number of byte array values allocated by this account in Global and Local States.
   *
   * Account must be an available resource
   */
  readonly totalNumByteSlice: uint64

  /**
   * The number of extra app code pages used by this account.
   *
   * Account must be an available resource
   */
  readonly totalExtraAppPages: uint64

  /**
   * The number of existing apps created by this account.
   *
   * Account must be an available resource
   */
  readonly totalAppsCreated: uint64

  /**
   * The number of apps this account is opted into.
   *
   * Account must be an available resource
   */
  readonly totalAppsOptedIn: uint64

  /**
   * The number of existing ASAs created by this account.
   *
   * Account must be an available resource
   */
  readonly totalAssetsCreated: uint64

  /**
   * The numbers of ASAs held by this account (including ASAs this account created).
   *
   * Account must be an available resource
   */
  readonly totalAssets: uint64

  /**
   * The number of existing boxes created by this account's app.
   *
   * Account must be an available resource
   */
  readonly totalBoxes: uint64

  /**
   * The total number of bytes used by this account's app's box keys and values.
   *
   * Account must be an available resource
   */
  readonly totalBoxBytes: uint64

  /**
   * Returns true if this account is opted in to the specified Asset or Application.
   * Note: Account and Asset/Application must be an available resource
   *
   * @param assetOrApp
   */
  isOptedIn(assetOrApp: Asset | Application): boolean
}

export function Account(): Account
export function Account(address: bytes): Account
export function Account(address?: bytes): Account {
  throw new NoImplementation()
}

export function Asset(): Asset
export function Asset(assetId: uint64): Asset
export function Asset(assetId?: uint64): Asset {
  throw new NoImplementation()
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
   * @see AssetParams.decimals
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

export function Application(): Application
export function Application(applicationId: uint64): Application
export function Application(applicationId?: uint64): Application {
  throw new NoImplementation()
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
