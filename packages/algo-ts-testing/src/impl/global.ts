import { Account, Application, bytes, internal, Uint64, uint64 } from '@algorandfoundation/algo-ts'
import { getTestExecutionContext } from '../util'

export const Global: internal.opTypes.GlobalType = {
  /**
   * microalgos
   */
  get minTxnFee(): uint64 {
    throw new Error('TODO')
  },

  /**
   * microalgos
   */
  get minBalance(): uint64 {
    throw new Error('TODO')
  },

  /**
   * rounds
   */
  get maxTxnLife(): uint64 {
    throw new Error('TODO')
  },

  /**
   * 32 byte address of all zero bytes
   */
  get zeroAddress(): Account {
    throw new Error('TODO')
  },

  /**
   * Number of transactions in this atomic transaction group. At least 1
   */
  get groupSize(): uint64 {
    const context = getTestExecutionContext()
    const currentTransactionGroup = context.txn.activeGroup.transactions
    return Uint64(currentTransactionGroup.length)
  },

  /**
   * Maximum supported version
   */
  get logicSigVersion(): uint64 {
    throw new Error('TODO')
  },

  /**
   * Current round number. Application mode only.
   */
  get round(): uint64 {
    throw new Error('TODO')
  },

  /**
   * Last confirmed block UNIX timestamp. Fails if negative. Application mode only.
   */
  get latestTimestamp(): uint64 {
    throw new Error('TODO')
  },

  /**
   * ID of current application executing. Application mode only.
   */
  get currentApplicationId(): Application {
    throw new Error('TODO')
  },

  /**
   * Address of the creator of the current application. Application mode only.
   */
  get creatorAddress(): Account {
    throw new Error('TODO')
  },

  /**
   * Address that the current application controls. Application mode only.
   */
  get currentApplicationAddress(): Account {
    throw new Error('TODO')
  },

  /**
   * ID of the transaction group. 32 zero bytes if the transaction is not part of a group.
   */
  get groupId(): bytes {
    throw new Error('TODO')
  },

  /**
   * The remaining cost that can be spent by opcodes in this program.
   */
  get opcodeBudget(): uint64 {
    throw new Error('TODO')
  },

  /**
   * The application ID of the application that called this application. 0 if this application is at the top-level. Application mode only.
   */
  get callerApplicationId(): uint64 {
    throw new Error('TODO')
  },

  /**
   * The application address of the application that called this application. ZeroAddress if this application is at the top-level. Application mode only.
   */
  get callerApplicationAddress(): Account {
    throw new Error('TODO')
  },

  /**
   * The additional minimum balance required to create (and opt-in to) an asset.
   */
  get assetCreateMinBalance(): uint64 {
    throw new Error('TODO')
  },

  /**
   * The additional minimum balance required to opt-in to an asset.
   */
  get assetOptInMinBalance(): uint64 {
    throw new Error('TODO')
  },

  /**
   * The Genesis Hash for the network.
   */
  get genesisHash(): bytes {
    throw new Error('TODO')
  },
}
