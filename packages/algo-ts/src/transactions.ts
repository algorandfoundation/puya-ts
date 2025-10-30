/**
 * The different transaction types available in a transaction
 */
export enum TransactionType {
  /**
   * A Payment transaction
   */
  Payment = 1,
  /**
   * A Key Registration transaction
   */
  KeyRegistration = 2,
  /**
   * An Asset Config transaction
   */
  AssetConfig = 3,
  /**
   * An Asset Transfer transaction
   */
  AssetTransfer = 4,
  /**
   * An Asset Freeze transaction
   */
  AssetFreeze = 5,
  /**
   * An Application Call transaction
   */
  ApplicationCall = 6,
}
