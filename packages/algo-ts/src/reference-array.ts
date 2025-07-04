import { NoImplementation } from './internal/errors'
import { uint64, Uint64Compat } from './primitives'

/**
 * An in memory mutable array which is passed by reference
 */
export class ReferenceArray<TItem> {
  /**
   * Create a new ReferenceArray with the specified items
   * @param items The initial items for the array
   */
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
   * @deprecated Array slicing is not yet supported in Algorand TypeScript
   * Create a new ReferenceArray with all items from this array
   */
  slice(): ReferenceArray<TItem>
  /**
   * @deprecated Array slicing is not yet supported in Algorand TypeScript
   * Create a new ReferenceArray with all items up till `end`.
   * Negative indexes are taken from the end.
   * @param end An index in which to stop copying items.
   */
  slice(end: Uint64Compat): ReferenceArray<TItem>
  /**
   * @deprecated Array slicing is not yet supported in Algorand TypeScript
   * Create a new ReferenceArray with items from `start`, up until `end`
   * Negative indexes are taken from the end.
   * @param start An index in which to start copying items.
   * @param end An index in which to stop copying items
   */
  slice(start: Uint64Compat, end: Uint64Compat): ReferenceArray<TItem>
  slice(start?: Uint64Compat, end?: Uint64Compat): ReferenceArray<TItem> {
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
}
