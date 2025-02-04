import { NoImplementation } from './internal/errors'
import { uint64, Uint64Compat } from './primitives'

export class MutableArray<TItem> {
  constructor(...items: TItem[]) {}

  /**
   * Returns the current length of this array
   */
  get length(): uint64 {
    throw new NoImplementation()
  }

  /**
   * Returns the item at the given index.
   * Negative indexes are taken from the end.
   * @param index The index of the item to retrieve
   */
  at(index: Uint64Compat): TItem {
    throw new NoImplementation()
  }

  /**
   * Create a new Dynamic array with all items from this array
   * @internal Not supported yet
   */
  slice(): MutableArray<TItem>
  /**
   * Create a new MutableArray with all items up till `end`.
   * Negative indexes are taken from the end.
   * @param end An index in which to stop copying items.
   * @internal Not supported yet
   */
  slice(end: Uint64Compat): MutableArray<TItem>
  /**
   * Create a new MutableArray with items from `start`, up until `end`
   * Negative indexes are taken from the end.
   * @param start An index in which to start copying items.
   * @param end An index in which to stop copying items
   * @internal Not supported yet
   */
  slice(start: Uint64Compat, end: Uint64Compat): MutableArray<TItem>
  slice(start?: Uint64Compat, end?: Uint64Compat): MutableArray<TItem> {
    throw new NoImplementation()
  }

  /**
   * Returns an iterator for the items in this array
   */
  [Symbol.iterator](): IterableIterator<TItem> {
    throw new NoImplementation()
  }

  /**
   * Returns an iterator for a tuple of the indexes and items in this array
   */
  entries(): IterableIterator<readonly [uint64, TItem]> {
    throw new NoImplementation()
  }

  /**
   * Returns an iterator for the indexes in this array
   */
  keys(): IterableIterator<uint64> {
    throw new NoImplementation()
  }

  /**
   * Get or set the item at the specified index.
   * Negative indexes are not supported
   */
  [index: uint64]: TItem

  /**
   * Push a number of items into this array
   * @param items The items to be added to this array
   */
  push(...items: TItem[]): void {
    throw new NoImplementation()
  }

  /**
   * Pop a single item from this array
   */
  pop(): TItem {
    throw new NoImplementation()
  }

  copy(): MutableArray<TItem> {
    throw new NoImplementation()
  }
}
