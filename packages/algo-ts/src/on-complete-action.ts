/**
 * The possible on complete actions a method can handle, represented as a string
 */
export type OnCompleteActionStr = 'NoOp' | 'OptIn' | 'ClearState' | 'CloseOut' | 'UpdateApplication' | 'DeleteApplication'

/**
 * The possible on complete actions a method can handle, represented as an integer
 */
export enum OnCompleteAction {
  /**
   * Do nothing after the transaction has completed
   */
  NoOp = 0,
  /**
   * Opt the calling user into the contract
   */
  OptIn = 1,
  /**
   * Close the calling user out of the contract
   */
  CloseOut = 2,
  /**
   * Run the clear state program and forcibly close the user out of the contract
   */
  ClearState = 3,
  /**
   * Replace the application's approval and clear state programs with the bytes from this transaction
   */
  UpdateApplication = 4,
  /**
   * Delete the application
   */
  DeleteApplication = 5,
}
