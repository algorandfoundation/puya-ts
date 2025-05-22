import { NoImplementation } from './internal/errors'
import { DeliberateAny } from './internal/typescript-helpers'
import { bytes, BytesBacked } from './primitives'

/**
 * The base type for mutable objects
 */
class MutableObjectBase<T> implements BytesBacked {
  /**
   * Retrieve the encoded bytes for this type
   */
  get bytes(): bytes {
    throw new NoImplementation()
  }

  /**
   * Returns a deep copy of this object
   */
  copy(): this {
    throw new NoImplementation()
  }
}

/**
 * Type alias for the Mutable Object constructor function
 * @typeParam T The shape of the mutable object
 */
type MutableObjectConstructor = {
  new <T extends Record<string, DeliberateAny>>(initial: T): MutableObjectBase<T> & T
}

/**
 * The base type of mutable object
 *
 * Usage:
 * ```
 * class MyMutableObject extends MutableObject<{ x: uint64, y: string, z: bytes }> {}
 * ```
 */
export const MutableObject = MutableObjectBase as unknown as MutableObjectConstructor
