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
 * A GlobalMap proxy
 * @typeParam TKey The type of the value used to key each global state value.
 * @typeParam TValue The type of the data stored in the global state.
 */
export type GlobalMap<TKey, TValue> = {
  /**
   * Get the bytes used to prefix each key
   */
  readonly keyPrefix: bytes

  /**
   * Get a GlobalState proxy for a single item in the GlobalMap
   * @param key The key of the global state value to retrieve a proxy for
   */
  (key: TKey): GlobalState<TValue>
}

/**
 * Options for creating a GlobalMap proxy
 */
interface CreateGlobalMapOptions {
  /**
   * The bytes which prefix each key of the global map.
   *
   * Defaults to the name of the property this proxy is assigned to
   */
  keyPrefix?: bytes | string
}

/**
 * Creates a GlobalMap proxy object offering methods of getting and setting a set of values stored in individual global state fields indexed by a common key type
 * Adequate space must be allocated for the application on creation (see options parameter of contract decorator).
 * @param options Options for creating the GlobalMap proxy
 * @typeParam TKey The type of the value used to key each global state value. This key will be encoded to bytes and prefixed with `keyPrefix`
 * @typeParam TValue The type of the data stored in the global state. This value will be encoded to bytes when stored and decoded on retrieval.
 */
export function GlobalMap<TKey, TValue>(options?: CreateGlobalMapOptions): GlobalMap<TKey, TValue> {
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
