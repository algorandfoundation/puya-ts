/**
 * Example 08 — Key-Value Store
 * Tier: 2 — State & Data
 *
 * Features demonstrated:
 *   - Box<bytes> — single named box for raw byte storage
 *   - BoxMap<string, bytes> — key-prefixed map of boxes
 *   - Box CRUD — .create(), .delete(), .exists, .value
 *   - Box slicing — .extract(), .replace(), .splice()
 *   - Box utilities — .length, .get() with default, .maybe(), .resize()
 *   - @contract({ stateTotals: {...} }) — explicit state allocation
 *   - GlobalState with dynamic key access
 */
import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
// Contract: ABI-routed base; contract: class decorator for stateTotals;
// Box/BoxMap: box storage proxies; GlobalState: global state proxy;
// Bytes: bytes factory; Uint64: uint64 factory; assert: runtime assertion; abimethod: method decorator
import {
  abimethod,
  assert,
  Box,
  BoxMap,
  Bytes,
  Contract,
  contract,
  GlobalState,
  Uint64,
} from '@algorandfoundation/algorand-typescript'

// @contract decorator with stateTotals: reserves extra global uint slots
// for dynamic GlobalState access (keys not known at compile time)
@contract({ stateTotals: { globalUints: 4, globalBytes: 0, localUints: 0, localBytes: 0 } })
export class KeyValueStore extends Contract {
  // Box<bytes>: a single named box holding raw bytes
  singleBox = Box<bytes>({ key: 'single' })

  // BoxMap<string, bytes>: a map of boxes keyed by string, prefixed with 'kv/'
  kvMap = BoxMap<string, bytes>({ keyPrefix: 'kv/' })

  // GlobalState<uint64>: tracks total number of entries written via the map
  entryCount = GlobalState<uint64>({ initialValue: Uint64(0) })

  // createApplication: called once on deploy
  @abimethod({ allowActions: 'NoOp', onCreate: 'require' })
  public createApplication(): void {
    // entryCount is auto-initialized to 0 via initialValue above
  }

  // --- Single Box CRUD ---

  // Demonstrate Box.create() — allocates storage for the box
  public createSingleBox(size: uint64): boolean {
    // .create({ size }): create a box of the given byte length; returns true if newly created
    const created = this.singleBox.create({ size })
    return created
  }

  // Demonstrate Box .value setter and .exists check
  public setSingleBox(data: bytes): void {
    // .exists: boolean indicating whether the box has been created
    if (!this.singleBox.exists) {
      // .create(): create with size matching the data length
      this.singleBox.create({ size: Uint64(data.length) })
    }
    // .value = ...: write the full contents of the box
    this.singleBox.value = data
  }

  // Demonstrate Box .value getter and .get() with default
  public getSingleBox(): bytes {
    // .get({ default }): return the box value, or the default if box doesn't exist
    return this.singleBox.get({ default: Bytes('') })
  }

  // Demonstrate Box .delete()
  public deleteSingleBox(): boolean {
    // .delete(): remove the box; returns true if it existed
    return this.singleBox.delete()
  }

  // Demonstrate Box .maybe() — returns [value, exists] tuple
  public checkSingleBox(): boolean {
    // .maybe(): returns readonly [bytes, boolean] — value and existence flag
    const [, exists] = this.singleBox.maybe()
    return exists
  }

  // --- Box byte-level operations ---

  // Demonstrate .extract() — read a slice of bytes from a box
  public extractFromBox(start: uint64, length: uint64): bytes {
    // .extract(start, length): read `length` bytes starting at `start`
    return this.singleBox.extract(start, length)
  }

  // Demonstrate .replace() — overwrite bytes at a given offset
  public replaceInBox(start: uint64, data: bytes): void {
    // .replace(start, value): overwrite bytes starting at `start` with `data`
    this.singleBox.replace(start, data)
  }

  // Demonstrate .splice() — insert/remove bytes at a given offset
  public spliceBox(start: uint64, length: uint64, data: bytes): void {
    // .splice(start, length, value): remove `length` bytes at `start`, insert `data` in their place
    this.singleBox.splice(start, length, data)
  }

  // Demonstrate .resize() — grow or shrink a box
  public resizeBox(newSize: uint64): void {
    // .resize(newSize): change box size — pads with zero bytes or truncates
    this.singleBox.resize(newSize)
  }

  // Demonstrate .length — get the byte length of a box
  public getBoxLength(): uint64 {
    // .length: current byte length of the box (errors if box doesn't exist)
    return this.singleBox.length
  }

  // --- BoxMap CRUD ---

  // Demonstrate BoxMap write — set a key-value pair
  public setEntry(key: string, value: bytes): void {
    // BoxMap is callable: kvMap(key) returns a Box<bytes> proxy for that key
    this.kvMap(key).value = value
    // Increment the entry counter in global state
    const count: uint64 = this.entryCount.value + 1
    this.entryCount.value = count
  }

  // Demonstrate BoxMap read — get a value by key
  public getEntry(key: string): bytes {
    // .get({ default }): return value or default if the keyed box doesn't exist
    return this.kvMap(key).get({ default: Bytes('') })
  }

  // Demonstrate BoxMap .exists check
  public hasEntry(key: string): boolean {
    // .exists: check if a keyed box exists in the map
    return this.kvMap(key).exists
  }

  // Demonstrate BoxMap .delete()
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

  // Demonstrate BoxMap .length on a specific entry
  public getEntryLength(key: string): uint64 {
    // .length: byte length of the keyed box
    return this.kvMap(key).length
  }

  // --- Dynamic GlobalState via stateTotals ---

  // Demonstrate dynamic GlobalState creation using runtime keys
  // This requires stateTotals to reserve slots since keys aren't known at compile time
  public setDynamicState(key: string, value: uint64): void {
    // GlobalState<uint64>({ key }): create a proxy for a dynamic global state key
    const proxy = GlobalState<uint64>({ key })
    // .value = ...: write the value to global state under that key
    proxy.value = value
  }

  // Read a dynamic global state value
  public getDynamicState(key: string): uint64 {
    // GlobalState<uint64>({ key }): create proxy; .value: read the stored value
    const proxy = GlobalState<uint64>({ key })
    return proxy.value
  }

  // Delete a dynamic global state key
  public deleteDynamicState(key: string): void {
    // .delete(): remove the key from global state
    GlobalState<uint64>({ key }).delete()
  }

  // --- Integration: Box + assertions ---

  // End-to-end test combining multiple box operations with assertions
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
