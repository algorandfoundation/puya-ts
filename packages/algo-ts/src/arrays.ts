import { NoImplementation } from './internal/errors'
import { uint64, Uint64Compat } from './primitives'

/**
 * A fixed sized array
 * @typeParam TItem The type of a single item in the array
 * @typeParam TLength The fixed length of the array
 */
export class FixedArray<TItem, TLength extends number> implements ConcatArray<TItem> {
  /**
   * Create a new FixedArray instance
   */
  constructor()
  /**
   * Create a new FixedArray instance with the specified items
   * @param items The initial items for the array
   */
  constructor(...items: TItem[] & { length: TLength })
  constructor(...items: TItem[] & { length: TLength }) { }

  /**
   * Returns a new array containing all items from _this_ array, and _other_ array
   * @param items Another array to concat with this one
   */
  concat(...items: (TItem | ConcatArray<TItem>)[]): TItem[] {
    throw new NoImplementation()
  }

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

  /** @deprecated Array slicing is not yet supported in Algorand TypeScript
   * Create a new Dynamic array with all items from this array
   */
  slice(): Array<TItem>
  /** @deprecated Array slicing is not yet supported in Algorand TypeScript
   * Create a new DynamicArray with all items up till `end`.
   * Negative indexes are taken from the end.
   * @param end An index in which to stop copying items.
   */
  slice(end: Uint64Compat): Array<TItem>
  /** @deprecated Array slicing is not yet supported in Algorand TypeScript
   * Create a new DynamicArray with items from `start`, up until `end`
   * Negative indexes are taken from the end.
   * @param start An index in which to start copying items.
   * @param end An index in which to stop copying items
   */
  slice(start: Uint64Compat, end: Uint64Compat): Array<TItem>
  slice(start?: Uint64Compat, end?: Uint64Compat): Array<TItem> {
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
  entries(): ArrayIterator<readonly [uint64, TItem]> {
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
   * Creates a string by concatenating all the items in the array delimited by the
   * specified separator (or ',' by default)
   * @param separator
   * @deprecated Join is not supported in Algorand TypeScript
   */
  join(separator?: string): string {
    throw new NoImplementation()
  }
}
