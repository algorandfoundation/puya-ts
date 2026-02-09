import { NoImplementation } from './internal/errors'
import { bytes, uint64 } from './primitives'

/**
 * A Box proxy
 * @typeParam TValue The type of the data stored in the box.
 */
export type Box<TValue> = {
  /**
   * Create the box for this proxy with a bzero value.
   *  - If options.size is specified, the box will be created with that length
   *  - Otherwise the box will be created with storage size of TValue. Errors if the size of TValue is not fixed
   *
   * No op if the box already exists with the same size
   * Errors if the box already exists with a different size.
   * Errors if the specified size is greater than the max box size (32,768)
   * @returns True if the box was created, false if it already existed
   */
  create(options?: { size?: uint64 }): boolean
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
   * Resize the box to the specified size.
   *
   * Adds zero bytes to the end if the new size is larger
   * Removes end bytes if the new size is smaller
   * Error if the box does not exist
   * @param newSize The new size for the box
   */
  resize(newSize: uint64): void
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
   * Get a Box proxy for a single item in the BoxMap
   * @param key The key of the box to retrieve a proxy for
   */
  (key: TKey): Box<TValue>
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
