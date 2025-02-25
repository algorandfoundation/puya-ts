import { NoImplementation } from './internal/errors'
import { bytes, uint64 } from './primitives'

/**
 * A Box proxy
 * @typeParam TValue The type of the data stored in the box.
 */
export type Box<TValue> = {
  /**
   * Get the key used by this box proxy
   */
  readonly key: bytes
  /**
   * Get or set the value stored in the box
   *
   * Get will error if the box does not exist
   */
  value: TValue
  /**
   * Get a boolean indicating if the box exists or not
   */
  readonly exists: boolean
  /**
   * Get the value stored in the box, or return a specified default value if the box does not exist
   * @param options Options to specify a default value to be returned if no other value exists
   * @returns The value if the box exists, else the default value
   */
  get(options: { default: TValue }): TValue
  /**
   * Delete the box associated with this proxy if it exists.
   * @returns True if the box existed and was deleted, else false
   */
  delete(): boolean
  /**
   * Get the value stored in the box if available, and a boolean indicating if the box exists.
   *
   * If the box does not exist, the value returned at position 0 should not be relied on to have a valid value.
   * @returns A tuple with the first item being the box value, and the second item being a boolean indicating if the box exists.
   */
  maybe(): readonly [TValue, boolean]
  /**
   * Returns the length of the box, or error if the box does not exist
   */
  readonly length: uint64
}
/**
 * A BoxMap proxy
 * @typeParam TKey The type of the value used to key each box.
 * @typeParam TValue The type of the data stored in the box.
 */
export type BoxMap<TKey, TValue> = {
  /**
   * Get the bytes used to prefix each key
   */
  readonly keyPrefix: bytes
  /**
   * Get the value of a keyed box, error if the box does not exist
   * @param key The key of the box to retrieve
   * @returns The value
   */
  get(key: TKey): TValue
  /**
   * Get the value of a keyed box, or return `options.default` if the box does not exist
   * @param key The key of the box to retrieve
   * @param options Options to specify a default value to be returned if no other value exists
   * @returns The value if the box exists, else the default value
   */
  get(key: TKey, options: { default: TValue }): TValue
  /**
   * Set the value of a keyed box
   * @param key The key of the box to set
   * @param value The value to write to that box
   */
  set(key: TKey, value: TValue): void
  /**
   * Delete the box associated with a specific key
   * @param key The key of the box to delete
   * @returns True if the box existed and was deleted, else false
   */
  delete(key: TKey): boolean
  /**
   * Returns a boolean indicating if a box associated with the specified key exists
   * @param key The key of the box to check
   * @returns True if the box exists, else false
   */
  has(key: TKey): boolean
  /**
   * Get the value of a keyed box if available, and a boolean indicating if the box exists.
   *
   * If the box does not exist, the value returned at position 0 should not be relied on to have a valid value.
   * @param key The key of the box to check
   * @returns A tuple with the first item being the box value, and the second item being a boolean indicating if the box exists.
   */
  maybe(key: TKey): readonly [TValue, boolean]
  /**
   * Get the length of a keyed box, or error if the box does not exist
   * @param key The key of the box to check
   * @returns The length of the box
   */
  length(key: TKey): uint64
}

/**
 * A BoxRef proxy
 */
export type BoxRef = {
  /**
   * Get the key used by this box proxy
   */
  readonly key: bytes
  /**
   * Get a boolean indicating if the box exists or not
   */
  readonly exists: boolean
  /**
   * Get the value of the box. Error if this value is larger than what the `bytes` type supports
   */
  value: bytes
  /**
   * Get the value stored in the box, or return a specified default value if the box does not exist
   * @param options Options to specify a default value to be returned if no other value exists
   * @returns The value if the box exists, else the default value
   */
  get(options: { default: bytes }): bytes
  /**
   * Puts the specified bytes into the box replacing any existing value.
   *
   * Creates the box if it does not exist
   * Errors if the box exists, but the length does not match the length of `value`
   * @param value The value to put into the box
   */
  put(value: bytes): void
  /**
   * Splice the specified bytes into the box starting at `start`, removing `length` bytes
   * from the existing value and replacing them with `value` before appending the remainder of the original box value.
   *
   * If the resulting byte value is larger than length, bytes will be trimmed from the end
   * If the resulting byte value is smaller than length, zero bytes will be appended to the end
   * Error if the box does not exist
   * @param start The index to start inserting the value
   * @param length The number of bytes after `start` to be omitted
   * @param value The value to be inserted
   */
  splice(start: uint64, length: uint64, value: bytes): void
  /**
   * Replace bytes in a box starting at `start`.
   *
   * Error if the box does not exist
   * Error if `start` + `value.length` is greater than the box size
   * @param start The index to start replacing
   * @param value The value to be written
   */
  replace(start: uint64, value: bytes): void
  /**
   * Extract a slice of bytes from the box
   *
   * Error if the box does not exist
   * Error if `start` + `length` is greater than the box size
   * @param start The index to start extracting
   * @param length The number of bytes to extract
   * @returns The extracted bytes
   */
  extract(start: uint64, length: uint64): bytes
  /**
   * Delete the box associated with this proxy if it exists.
   * @returns True if the box existed and was deleted, else false
   */
  delete(): boolean
  /**
   * Create the box for this proxy with the specified size if it does not exist
   *
   * No op if the box already exists
   * @param options The size of the box to create
   * @returns True if the box was created, false if it already existed
   */
  create(options: { size: uint64 }): boolean
  /**
   * Resize the box to the specified size.
   *
   * Adds zero bytes to the end if the new size is larger
   * Removes end bytes if the new size is smaller
   * Error if the box does not exist
   * @param newSize The new size for the box
   */
  resize(newSize: uint64): void
  /**
   * Get the value stored in the box if available, and a boolean indicating if the box exists.
   *
   * If the box does not exist, the value returned at position 0 will be an empty byte array.
   * @returns A tuple with the first item being the box value, and the second item being a boolean indicating if the box exists.
   */
  maybe(): readonly [bytes, boolean]
  /**
   * Returns the length of the box, or error if the box does not exist
   */
  readonly length: uint64
}

/**
 * Options for creating a Box proxy
 */
interface CreateBoxOptions {
  /**
   * The bytes which make up the key of the box
   */
  key: bytes | string
}

/**
 * Creates a Box proxy object offering methods of getting and setting the value stored in a single box.
 * @param options Options for creating the Box proxy
 * @typeParam TValue The type of the data stored in the box. This value will be encoded to bytes when stored and decoded on retrieval.
 */
export function Box<TValue>(options: CreateBoxOptions): Box<TValue> {
  throw new NoImplementation()
}

/**
 * Options for creating a BoxMap proxy
 */
interface CreateBoxMapOptions {
  /**
   * The bytes which prefix each key of the box map
   */
  keyPrefix: bytes | string
}

/**
 * Creates a BoxMap proxy object offering methods of getting and setting a set of values stored in individual boxes indexed by a common key type
 * @param options Options for creating the BoxMap proxy
 * @typeParam TKey The type of the value used to key each box. This key will be encoded to bytes and prefixed with `keyPrefix`
 * @typeParam TValue The type of the data stored in the box. This value will be encoded to bytes when stored and decoded on retrieval.
 */
export function BoxMap<TKey, TValue>(options: CreateBoxMapOptions): BoxMap<TKey, TValue> {
  throw new NoImplementation()
}

/**
 * Options for creating a BoxRef proxy
 */
interface CreateBoxRefOptions {
  /**
   * The bytes which make up the key of the box
   */
  key: bytes | string
}

/**
 * Creates a BoxRef proxy object offering methods for getting and setting binary data in a box under a single key. This proxy is particularly
 * relevant when dealing with binary data that is larger than what the AVM can handle in a single value.
 * @param options The options for creating the BoxRef proxy
 */
export function BoxRef(options: CreateBoxRefOptions): BoxRef {
  throw new NoImplementation()
}
