import { NoImplementation } from './internal/errors'
import { bytes } from './primitives'
import { Account } from './reference'

/**
 * A proxy for manipulating a global state field
 * @typeParam ValueType The type of the value being stored - must be a serializable type
 */
export type GlobalState<ValueType> = {
  /**
   * Get or set the value of this global state field
   */
  value: ValueType
  /**
   * Delete the stored value of this global state field
   */
  delete(): void
  /**
   * Gets a boolean value indicating if global state field currently has a value
   */
  readonly hasValue: boolean
}
/**
 * Options for declaring a global state field
 */
export type GlobalStateOptions<ValueType> = {
  /**
   * The key to be used for this global state field.
   *
   * Defaults to the name of the property this proxy is assigned to
   */
  key?: bytes | string
  /**
   * An initial value to assign to this global state field when the application is created
   */
  initialValue?: ValueType
}

/**
 * Creates a new proxy for manipulating a global state field
 * @param options Options for configuring this field
 * @typeParam ValueType The type of the value being stored - must be a serializable type
 */
export function GlobalState<ValueType>(options?: GlobalStateOptions<ValueType>): GlobalState<ValueType> {
  throw new NoImplementation()
}

/**
 * A proxy for manipulating a local state field for a single account
 */
export type LocalStateForAccount<ValueType> = {
  /**
   * Get or set the value of this local state field for a single account
   */
  value: ValueType
  /**
   * Delete the stored value of this local state field for a single account
   */
  delete(): void
  /**
   * Gets a boolean value indicating if local state field for a single account currently has a value
   */
  readonly hasValue: boolean
}

/**
 * A proxy for manipulating a local state field for any account
 */
export type LocalState<ValueType> = {
  /**
   * Gets the LocalState proxy for a specific account
   * @param account The account to read or write state for. This account must be opted into the contract
   */
  (account: Account): LocalStateForAccount<ValueType>
}
/**
 * Options for declaring a local state field
 */
export type LocalStateOptions = {
  /**
   * The key to be used for this local state field.
   *
   * Defaults to the name of the property this proxy is assigned to
   */
  key?: bytes | string
}

/**
 * Creates a new proxy for manipulating a local state field
 * @param options Options for configuring this field
 */
export function LocalState<ValueType>(options?: LocalStateOptions): LocalState<ValueType> {
  throw new NoImplementation()
}
