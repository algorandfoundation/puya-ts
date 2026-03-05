/**
 * Example 06: Key-Value Store
 *
 * This example demonstrates Box and BoxMap storage with CRUD operations.
 *
 * Features:
 * - Box<bytes> — single named box for raw byte storage
 * - BoxMap<string, bytes> — key-prefixed map of boxes
 * - Box CRUD — .create(), .delete(), .exists, .value
 * - Box slicing — .extract(), .replace(), .splice()
 * - Box utilities — .length, .get() with default, .maybe(), .resize()
 * - @contract({ stateTotals: {...} }) — explicit state allocation
 * - GlobalState with dynamic key access
 *
 * Prerequisites: LocalNet
 *
 * @note Educational only — not audited for production use.
 */
import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
// Contract: ABI-routed base; contract: class decorator for stateTotals;
// Box/BoxMap: box storage proxies; GlobalState: global state proxy;
// Bytes: bytes factory; Uint64: uint64 factory; assert: runtime assertion
import { assert, Box, BoxMap, Bytes, Contract, contract, GlobalState, Uint64 } from '@algorandfoundation/algorand-typescript'

// @contract decorator with stateTotals: reserves extra global uint slots
// for dynamic GlobalState access (keys not known at compile time)
// example: KEY_VALUE_STORE
@contract({ stateTotals: { globalUints: 4, globalBytes: 0, localUints: 0, localBytes: 0 } })
export class KeyValueStore extends Contract {
  // Box<bytes>: a single named box holding raw bytes
  singleBox = Box<bytes>({ key: 'single' })

  // BoxMap<string, bytes>: a map of boxes keyed by string, prefixed with 'kv/'
  kvMap = BoxMap<string, bytes>({ keyPrefix: 'kv/' })

  // GlobalState<uint64>: tracks total number of entries written via the map
  entryCount = GlobalState<uint64>({ initialValue: Uint64(0) })

  /** Called once on deploy. */
  public createApplication(): void {
    // entryCount is auto-initialized to 0 via initialValue above
  }

  // --- Single Box CRUD ---

  /**
   * Demonstrate Box.create() — allocates storage for the box.
   * @param size - byte length for the new box
   * @returns true if the box was newly created
   */
  public createSingleBox(size: uint64): boolean {
    // .create({ size }): create a box of the given byte length; returns true if newly created
    const created = this.singleBox.create({ size })
    return created
  }

  /**
   * Demonstrate Box .value setter and .exists check.
   * @param data - raw bytes to store in the box
   */
  public setSingleBox(data: bytes): void {
    // .exists: boolean indicating whether the box has been created
    if (!this.singleBox.exists) {
      // .create(): create with size matching the data length
      this.singleBox.create({ size: Uint64(data.length) })
    }
    // .value = ...: write the full contents of the box
    this.singleBox.value = data
  }

  /**
   * Demonstrate Box .value getter and .get() with default.
   * @returns the box contents, or empty bytes if the box doesn't exist
   */
  public getSingleBox(): bytes {
    // .get({ default }): return the box value, or the default if box doesn't exist
    return this.singleBox.get({ default: Bytes('') })
  }

  /**
   * Demonstrate Box .delete().
   * @returns true if the box existed and was deleted
   */
  public deleteSingleBox(): boolean {
    // .delete(): remove the box; returns true if it existed
    return this.singleBox.delete()
  }

  /**
   * Demonstrate Box .maybe() — returns [value, exists] tuple.
   * @returns true if the box exists
   */
  public checkSingleBox(): boolean {
    // .maybe(): returns readonly [bytes, boolean] — value and existence flag
    const [, exists] = this.singleBox.maybe()
    return exists
  }

  // --- Box byte-level operations ---

  /**
   * Demonstrate .extract() — read a slice of bytes from a box.
   * @param start - byte offset to begin reading
   * @param length - number of bytes to read
   * @returns the extracted byte slice
   */
  public extractFromBox(start: uint64, length: uint64): bytes {
    // .extract(start, length): read `length` bytes starting at `start`
    return this.singleBox.extract(start, length)
  }

  /**
   * Demonstrate .replace() — overwrite bytes at a given offset.
   * @param start - byte offset to begin overwriting
   * @param data - replacement bytes
   */
  public replaceInBox(start: uint64, data: bytes): void {
    // .replace(start, value): overwrite bytes starting at `start` with `data`
    this.singleBox.replace(start, data)
  }

  /**
   * Demonstrate .splice() — insert/remove bytes at a given offset.
   * @param start - byte offset where splice begins
   * @param length - number of bytes to remove
   * @param data - bytes to insert at the splice point
   */
  public spliceBox(start: uint64, length: uint64, data: bytes): void {
    // .splice(start, length, value): remove `length` bytes at `start`, insert `data` in their place
    this.singleBox.splice(start, length, data)
  }

  /**
   * Demonstrate .resize() — grow or shrink a box.
   * @param newSize - desired byte length for the box
   */
  public resizeBox(newSize: uint64): void {
    // .resize(newSize): change box size — pads with zero bytes or truncates
    this.singleBox.resize(newSize)
  }

  /**
   * Demonstrate .length — get the byte length of a box.
   * @returns the current byte length of the box
   */
  public getBoxLength(): uint64 {
    // .length: current byte length of the box (errors if box doesn't exist)
    return this.singleBox.length
  }

  // --- BoxMap CRUD ---

  /**
   * Demonstrate BoxMap write — set a key-value pair.
   * @param key - the map key
   * @param value - raw bytes to store
   */
  public setEntry(key: string, value: bytes): void {
    // BoxMap is callable: kvMap(key) returns a Box<bytes> proxy for that key
    this.kvMap(key).value = value
    // Increment the entry counter in global state
    const count: uint64 = this.entryCount.value + 1
    this.entryCount.value = count
  }

  /**
   * Demonstrate BoxMap read — get a value by key.
   * @param key - the map key to look up
   * @returns the stored bytes, or empty bytes if the key doesn't exist
   */
  public getEntry(key: string): bytes {
    // .get({ default }): return value or default if the keyed box doesn't exist
    return this.kvMap(key).get({ default: Bytes('') })
  }

  /**
   * Demonstrate BoxMap .exists check.
   * @param key - the map key to check
   * @returns true if the key exists in the map
   */
  public hasEntry(key: string): boolean {
    // .exists: check if a keyed box exists in the map
    return this.kvMap(key).exists
  }

  /**
   * Demonstrate BoxMap .delete().
   * @param key - the map key to delete
   * @returns true if the key existed and was deleted
   */
  public deleteEntry(key: string): boolean {
    // .delete(): remove the keyed box; returns true if it existed
    const deleted = this.kvMap(key).delete()
    if (deleted) {
      // Decrement the entry counter
      const count: uint64 = this.entryCount.value - 1
      this.entryCount.value = count
    }
    return deleted
  }

  /**
   * Demonstrate BoxMap .length on a specific entry.
   * @param key - the map key to measure
   * @returns the byte length of the keyed box
   */
  public getEntryLength(key: string): uint64 {
    // .length: byte length of the keyed box
    return this.kvMap(key).length
  }

  // --- Dynamic GlobalState via stateTotals ---

  /**
   * Demonstrate dynamic GlobalState creation using runtime keys (requires stateTotals to reserve slots).
   * @param key - the global state key
   * @param value - the uint64 value to store
   */
  public setDynamicState(key: string, value: uint64): void {
    // GlobalState<uint64>({ key }): create a proxy for a dynamic global state key
    const proxy = GlobalState<uint64>({ key })
    // .value = ...: write the value to global state under that key
    proxy.value = value
  }

  /**
   * Read a dynamic global state value.
   * @param key - the global state key to read
   * @returns the stored uint64 value
   */
  public getDynamicState(key: string): uint64 {
    // GlobalState<uint64>({ key }): create proxy; .value: read the stored value
    const proxy = GlobalState<uint64>({ key })
    return proxy.value
  }

  /**
   * Delete a dynamic global state key.
   * @param key - the global state key to remove
   */
  public deleteDynamicState(key: string): void {
    // .delete(): remove the key from global state
    GlobalState<uint64>({ key }).delete()
  }

  // --- Integration: Box + assertions ---

  /**
   * End-to-end test combining multiple box operations with assertions.
   * @param data - raw bytes to round-trip through the box
   * @returns true if all assertions pass
   */
  public testBoxRoundTrip(data: bytes): boolean {
    // Create a box sized to fit the data
    this.singleBox.create({ size: Uint64(data.length) })
    // Write data into the box
    this.singleBox.value = data
    // .exists should be true after create + write
    assert(this.singleBox.exists)
    // .value should round-trip the data
    assert(this.singleBox.value === data)
    // .length should match the data length
    assert(this.singleBox.length === data.length)
    // Clean up: delete the box
    const deleted = this.singleBox.delete()
    // .delete() returns true when the box existed
    assert(deleted)
    // .exists should be false after delete
    assert(!this.singleBox.exists)
    return true
  }
}
// example: KEY_VALUE_STORE
