import { NoImplementation } from '../internal/errors'
import { biguint, BigUintCompat, bytes, BytesBacked, NTuple, StringCompat, uint64, Uint64Compat } from '../primitives'
import { Account } from '../reference'

/**
 * Defines UintN bit sizes which are compatible with the uint64 type
 */
type UintBitSize = 8 | 16 | 24 | 32 | 40 | 48 | 56 | 64
/**
 * Defines UintN bit sizes which are only compatible with the biguint type
 */
type BigUintBitSize =
  | 72
  | 80
  | 88
  | 96
  | 104
  | 112
  | 120
  | 128
  | 136
  | 144
  | 152
  | 160
  | 168
  | 176
  | 184
  | 192
  | 200
  | 208
  | 216
  | 224
  | 232
  | 240
  | 248
  | 256
  | 264
  | 272
  | 280
  | 288
  | 296
  | 304
  | 312
  | 320
  | 328
  | 336
  | 344
  | 352
  | 360
  | 368
  | 376
  | 384
  | 392
  | 400
  | 408
  | 416
  | 424
  | 432
  | 440
  | 448
  | 456
  | 464
  | 472
  | 480
  | 488
  | 496
  | 504
  | 512
/**
 * Defines supported bit sizes for the UintN and UFixedNxM types
 */
export type BitSize = UintBitSize | BigUintBitSize
/**
 * Conditional type which returns the native equivalent type for a given UintN bit size
 */
type NativeForArc4Int<N extends BitSize> = N extends UintBitSize ? uint64 : biguint
/**
 * Conditional type which returns the compat type relevant to a given UintN bit size
 */
type CompatForArc4Int<N extends BitSize> = N extends UintBitSize ? Uint64Compat : BigUintCompat

/**
 * @hidden
 */
const TypeProperty = Symbol('ARC4Type')

/**
 * A base type for ARC4 encoded values
 */
export abstract class ARC4Encoded implements BytesBacked {
  /** @hidden */
  abstract [TypeProperty]?: string

  /**
   * Retrieve the encoded bytes for this type
   */
  get bytes(): bytes {
    throw new NoImplementation()
  }
}

/**
 * A utf8 encoded string prefixed with its length expressed as a 2 byte uint
 */
export class Str extends ARC4Encoded {
  /** @hidden */
  [TypeProperty]?: 'arc4.Str'

  /**
   * Create a new Str instance
   * @param s The native string to initialize this Str from
   */
  constructor(s?: StringCompat) {
    super()
  }

  /**
   * Retrieve the decoded native string
   */
  get native(): string {
    throw new NoImplementation()
  }
}

/**
 * A fixed bit size unsigned int
 */
export class UintN<N extends BitSize> extends ARC4Encoded {
  /** @hidden */
  [TypeProperty]?: `arc4.UintN<${N}>`

  /**
   * Create a new UintN instance
   * @param v The native uint64 or biguint value to initialize this UintN from
   */
  constructor(v?: CompatForArc4Int<N>) {
    super()
  }

  /**
   * Retrieve the decoded native uint64 or biguint
   */
  get native(): NativeForArc4Int<N> {
    throw new NoImplementation()
  }
}

/**
 * An alias for UintN<8>
 */
export class Byte extends UintN<8> {}

/**
 * An alias for UintN<8>
 */
export class UintN8 extends UintN<8> {}

/**
 * An alias for UintN<16>
 */
export class UintN16 extends UintN<16> {}

/**
 * An alias for UintN<32>
 */
export class UintN32 extends UintN<32> {}

/**
 * An alias for UintN<64>
 */
export class UintN64 extends UintN<64> {}

/**
 * An alias for UintN<128>
 */
export class UintN128 extends UintN<128> {}

/**
 * An alias for UintN<256>
 */
export class UintN256 extends UintN<256> {}

/**
 * A fixed bit size, fixed decimal unsigned value
 */
export class UFixedNxM<N extends BitSize, M extends number> extends ARC4Encoded {
  /** @hidden */
  [TypeProperty]?: `arc4.UFixedNxM<${N}x${M}>`

  /**
   * Create a new UFixedNxM value
   * @param v A string representing the integer and fractional portion of the number
   */
  constructor(v?: `${number}.${number}`) {
    super()
  }

  /**
   * Retrieve the decoded native uint64 or biguint where the returned integer represents the fixed decimal value * (10 ^ M)
   */
  get native(): NativeForArc4Int<N> {
    throw new NoImplementation()
  }
}

/**
 * A boolean value
 */
export class Bool extends ARC4Encoded {
  /** @hidden */
  [TypeProperty]?: `arc4.Bool`

  /**
   * Create a new Bool value
   * @param v The native boolean to initialize this value from
   */
  constructor(v?: boolean) {
    super()
  }

  /**
   * Get the decoded native boolean for this value
   */
  get native(): boolean {
    throw new NoImplementation()
  }
}

/**
 * A base type for arc4 array types
 */
abstract class Arc4ArrayBase<TItem extends ARC4Encoded> extends ARC4Encoded {
  protected constructor() {
    super()
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

  /** @internal
   * Create a new Dynamic array with all items from this array
   */
  slice(): DynamicArray<TItem>
  /** @internal
   * Create a new DynamicArray with all items up till `end`.
   * Negative indexes are taken from the end.
   * @param end An index in which to stop copying items.
   */
  slice(end: Uint64Compat): DynamicArray<TItem>
  /** @internal
   * Create a new DynamicArray with items from `start`, up until `end`
   * Negative indexes are taken from the end.
   * @param start An index in which to start copying items.
   * @param end An index in which to stop copying items
   */
  slice(start: Uint64Compat, end: Uint64Compat): DynamicArray<TItem>
  slice(start?: Uint64Compat, end?: Uint64Compat): DynamicArray<TItem> {
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
}

/**
 * A fixed sized array of arc4 items
 * @typeParam TItem The type of a single item in the array
 * @typeParam TLength The fixed length of the array
 */
export class StaticArray<TItem extends ARC4Encoded, TLength extends number> extends Arc4ArrayBase<TItem> {
  /** @hidden */
  [TypeProperty]?: `arc4.StaticArray<${TItem[typeof TypeProperty]}, ${TLength}>`

  /**
   * Create a new StaticArray instance
   */
  constructor()
  /**
   * Create a new StaticArray instance with the specified items
   * @param items The initial items for the array
   */
  constructor(...items: TItem[] & { length: TLength })
  constructor(...items: TItem[] & { length: TLength }) {
    super()
  }

  /**
   * Returns a copy of this array
   */
  copy(): StaticArray<TItem, TLength> {
    throw new NoImplementation()
  }

  /**
   * Returns a new array containing all items from _this_ array, and _other_ array
   * @param other Another array to concat with this one
   */
  concat(other: Arc4ArrayBase<TItem>): DynamicArray<TItem> {
    throw new NoImplementation()
  }

  /**
   * Return the array items as a native tuple
   */
  get native(): NTuple<TItem, TLength> {
    throw new NoImplementation()
  }

  /**
   * Returns the (compile-time) length of this array
   */
  get length(): uint64 {
    throw new NoImplementation()
  }
}

/**
 * A dynamic sized array of arc4 items
 * @typeParam TItem The type of a single item in the array
 */
export class DynamicArray<TItem extends ARC4Encoded> extends Arc4ArrayBase<TItem> {
  /** @hidden */
  [TypeProperty]?: `arc4.DynamicArray<${TItem[typeof TypeProperty]}>`

  /**
   * Create a new DynamicArray with the specified items
   * @param items The initial items for the array
   */
  constructor(...items: TItem[]) {
    super()
  }

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

  /**
   * Returns a copy of this array
   */
  copy(): DynamicArray<TItem> {
    throw new NoImplementation()
  }

  /**
   * Returns a new array containing all items from _this_ array, and _other_ array
   * @param other Another array to concat with this one
   */
  concat(other: Arc4ArrayBase<TItem>): DynamicArray<TItem> {
    throw new NoImplementation()
  }

  /**
   * Return the array items as a native immutable array
   */
  get native(): TItem[] {
    throw new NoImplementation()
  }
}

/**
 * @hidden
 */
type ExpandTupleType<T extends ARC4Encoded[]> = T extends [infer T1 extends ARC4Encoded, ...infer TRest extends ARC4Encoded[]]
  ? TRest extends []
    ? `${T1[typeof TypeProperty]}`
    : `${T1[typeof TypeProperty]},${ExpandTupleType<TRest>}`
  : ''

/**
 * An arc4 encoded tuple of values
 * @typeParam TTuple A type representing the native tuple of item types
 */
export class Tuple<TTuple extends [ARC4Encoded, ...ARC4Encoded[]]> extends ARC4Encoded {
  /** @hidden */
  [TypeProperty]?: `arc4.Tuple<${ExpandTupleType<TTuple>}>`

  /**
   * Create a new Tuple with the default zero values for items
   */
  constructor()
  /**
   * Create a new Tuple with the specified items
   * @param items The tuple items
   */
  constructor(...items: TTuple)
  constructor(...items: TTuple | []) {
    super()
  }

  /**
   * Returns the item at the specified index
   * @param index The index of the item to get. Must be a positive literal representing a tuple index
   */
  at<TIndex extends keyof TTuple>(index: TIndex): TTuple[TIndex] {
    throw new NoImplementation()
  }

  /**
   * Returns the length of this tuple
   */
  get length(): TTuple['length'] & uint64 {
    throw new NoImplementation()
  }

  /**
   * Returns the decoded native tuple (with arc4 encoded items)
   */
  get native(): TTuple {
    throw new NoImplementation()
  }
}

/**
 * A 32 byte Algorand Address
 */
export class Address extends Arc4ArrayBase<Byte> {
  /** @hidden */
  [TypeProperty]?: `arc4.Address`

  /**
   * Create a new Address instance
   * @param value An Account, base 32 address string, or the address bytes
   */
  constructor(value?: Account | string | bytes) {
    super()
  }

  /**
   * Returns an Account instance for this Address
   */
  get native(): Account {
    throw new NoImplementation()
  }
}

/**
 * The base type for arc4 structs
 */
class StructBase<T> extends ARC4Encoded {
  /** @hidden */
  [TypeProperty] = 'arc4.Struct'

  get native(): T {
    throw new NoImplementation()
  }

  /**
   * Returns a deep copy of this struct
   */
  copy(): this {
    throw new NoImplementation()
  }
}

/**
 * Type alias for the Struct constructor function
 * @typeParam T The shape of the arc4 struct
 */
type StructConstructor = {
  new <T extends Record<string, ARC4Encoded>>(initial: T): StructBase<T> & T
}

/**
 * The base type of arc4 structs
 *
 * Usage:
 * ```
 * class MyStruct extends Struct<{ x: UintN8, y: Str, z: DynamicBytes }> {}
 * ```
 */
export const Struct = StructBase as unknown as StructConstructor

/**
 * A variable length sequence of bytes prefixed with its length expressed as a 2 byte uint
 */
export class DynamicBytes extends Arc4ArrayBase<Byte> {
  /** @hidden */
  [TypeProperty]?: `arc4.DynamicBytes`

  /**
   * Create a new DynamicBytes instance
   * @param value The bytes or utf8 interpreted string to initialize this type
   */
  constructor(value?: bytes | string) {
    super()
  }

  /**
   * Get the native bytes value (excludes the length prefix)
   */
  get native(): bytes {
    throw new NoImplementation()
  }

  /**
   * Returns a dynamic bytes object containing all bytes from _this_ and _other_
   * @param other Another array of bytes to concat with this one
   */
  concat(other: Arc4ArrayBase<Byte>): DynamicBytes {
    throw new NoImplementation()
  }
}

/**
 * A fixed length sequence of bytes
 */
export class StaticBytes<TLength extends number = 0> extends Arc4ArrayBase<Byte> {
  /** @hidden */
  [TypeProperty]?: `arc4.StaticBytes<${TLength}>`

  /**
   * Create a new StaticBytes instance
   * @param value THe bytes or utf8 interpreted string to initialize this type
   */
  constructor(value?: bytes | string) {
    super()
  }

  /**
   * Get the native bytes value
   */
  get native(): bytes {
    throw new NoImplementation()
  }

  /**
   * Returns a dynamic bytes object containing all bytes from _this_ and _other_
   * @param other Another array of bytes to concat with this one
   */
  concat(other: Arc4ArrayBase<Byte>): DynamicBytes {
    throw new NoImplementation()
  }

  /**
   * Returns the (compile-time) length of this array
   */
  get length(): uint64 {
    throw new NoImplementation()
  }
}
