import { Account, Application, Bytes, bytes, internal, op, Uint64, uint64 } from '@algorandfoundation/algo-ts'
import { lazyContext } from '../context-helpers/internal-context'
import {
  DEFAULT_ACCOUNT_MIN_BALANCE,
  DEFAULT_ASSET_CREATE_MIN_BALANCE,
  DEFAULT_ASSET_OPT_IN_MIN_BALANCE,
  DEFAULT_GLOBAL_GENESIS_HASH,
  DEFAULT_MAX_TXN_LIFE,
  MIN_TXN_FEE,
  ZERO_ADDRESS,
} from '../constants'
import { asBigInt, getObjectReference } from '../util'
import algosdk from 'algosdk'

export class GlobalData {
  minTxnFee: uint64
  minBalance: uint64
  maxTxnLife: uint64
  zeroAddress: Account
  logicSigVersion?: uint64
  round?: uint64
  latestTimestamp?: uint64
  groupId?: bytes
  callerApplicationId: uint64
  assetCreateMinBalance: uint64
  assetOptInMinBalance: uint64
  genesisHash: bytes
  opcodeBudget?: uint64

  constructor() {
    this.minTxnFee = Uint64(MIN_TXN_FEE)
    this.minBalance = Uint64(DEFAULT_ACCOUNT_MIN_BALANCE)
    this.maxTxnLife = Uint64(DEFAULT_MAX_TXN_LIFE)
    this.zeroAddress = Account(ZERO_ADDRESS)
    this.callerApplicationId = Uint64(0)
    this.assetCreateMinBalance = Uint64(DEFAULT_ASSET_CREATE_MIN_BALANCE)
    this.assetOptInMinBalance = Uint64(DEFAULT_ASSET_OPT_IN_MIN_BALANCE)
    this.genesisHash = DEFAULT_GLOBAL_GENESIS_HASH
  }
}
const getGlobalData = (): GlobalData => {
  return lazyContext.ledger.globalData
}

const getMissingValueErrorMessage = (name: keyof GlobalData) =>
  `'algopy.Global' object has no value set for attribute named '${name}'. Use \`context.ledger.patchGlobalData({${name}: your_value})\` to set the value in your test setup."`

export const Global: internal.opTypes.GlobalType = {
  /**
   * microalgos
   */
  get minTxnFee(): uint64 {
    return getGlobalData().minTxnFee
  },

  /**
   * microalgos
   */
  get minBalance(): uint64 {
    return getGlobalData().minBalance
  },

  /**
   * rounds
   */
  get maxTxnLife(): uint64 {
    return getGlobalData().maxTxnLife
  },

  /**
   * 32 byte address of all zero bytes
   */
  get zeroAddress(): Account {
    return getGlobalData().zeroAddress
  },

  /**
   * Number of transactions in this atomic transaction group. At least 1
   */
  get groupSize(): uint64 {
    const currentTransactionGroup = lazyContext.activeGroup.transactions
    return Uint64(currentTransactionGroup.length)
  },

  /**
   * Maximum supported version
   */
  get logicSigVersion(): uint64 {
    const data = getGlobalData()
    if (data.logicSigVersion !== undefined) return data.logicSigVersion
    throw new internal.errors.InternalError(getMissingValueErrorMessage('logicSigVersion'))
  },

  /**
   * Current round number. Application mode only.
   */
  get round(): uint64 {
    const data = getGlobalData()
    if (data.round !== undefined) return data.round
    return Uint64(lazyContext.txn.groups.length + 1)
  },

  /**
   * Last confirmed block UNIX timestamp. Fails if negative. Application mode only.
   */
  get latestTimestamp(): uint64 {
    const data = getGlobalData()
    if (data.latestTimestamp !== undefined) return data.latestTimestamp
    return Uint64(lazyContext.activeGroup.latestTimestamp)
  },

  /**
   * ID of current application executing. Application mode only.
   */
  get currentApplicationId(): Application {
    return lazyContext.activeApplication
  },

  /**
   * Address of the creator of the current application. Application mode only.
   */
  get creatorAddress(): Account {
    const app = lazyContext.activeApplication
    return app.creator
  },

  /**
   * Address that the current application controls. Application mode only.
   */
  get currentApplicationAddress(): Account {
    const appAddress = algosdk.getApplicationAddress(asBigInt(this.currentApplicationId.id))
    return Account(Bytes(appAddress))
  },

  /**
   * ID of the transaction group. 32 zero bytes if the transaction is not part of a group.
   */
  get groupId(): bytes {
    const data = getGlobalData()
    if (data.groupId !== undefined) return data.groupId
    const reference = getObjectReference(lazyContext.activeGroup)
    const referenceBytes = Bytes(internal.encodingUtil.bigIntToUint8Array(reference))
    return op.sha256(referenceBytes)
  },

  /**
   * The remaining cost that can be spent by opcodes in this program.
   */
  get opcodeBudget(): uint64 {
    const data = getGlobalData()
    if (data.opcodeBudget !== undefined) return data.opcodeBudget
    throw new internal.errors.InternalError(getMissingValueErrorMessage('opcodeBudget'))
  },

  /**
   * The application ID of the application that called this application. 0 if this application is at the top-level. Application mode only.
   */
  get callerApplicationId(): uint64 {
    return getGlobalData().callerApplicationId
  },

  /**
   * The application address of the application that called this application. ZeroAddress if this application is at the top-level. Application mode only.
   */
  get callerApplicationAddress(): Account {
    const appAddress = algosdk.getApplicationAddress(asBigInt(this.callerApplicationId))
    return Account(Bytes(appAddress))
  },

  /**
   * The additional minimum balance required to create (and opt-in to) an asset.
   */
  get assetCreateMinBalance(): uint64 {
    return getGlobalData().assetCreateMinBalance
  },

  /**
   * The additional minimum balance required to opt-in to an asset.
   */
  get assetOptInMinBalance(): uint64 {
    return getGlobalData().assetOptInMinBalance
  },

  /**
   * The Genesis Hash for the network.
   */
  get genesisHash(): bytes {
    return getGlobalData().genesisHash
  },
}
