import { NoImplementation } from '../internal/errors'
import { biguint, BigUintCompat, bytes, BytesBacked, BytesCompat, StringCompat, uint64, Uint64Compat } from '../primitives'
import { Account } from '../reference'

type UintBitSize = 8 | 16 | 24 | 32 | 40 | 48 | 56 | 64
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
export type BitSize = UintBitSize | BigUintBitSize
type NativeForArc4Int<N extends BitSize> = N extends UintBitSize ? uint64 : biguint
type CompatForArc4Int<N extends BitSize> = N extends UintBitSize ? Uint64Compat : BigUintCompat

const TypeProperty = Symbol('ARC4Type')

export abstract class ARC4Encoded implements BytesBacked {
  /** @hidden */
  abstract [TypeProperty]?: string
  get bytes(): bytes {
    throw new NoImplementation()
  }
}

export class Str extends ARC4Encoded {
  /** @hidden */
  [TypeProperty]?: 'arc4.Str'
  #value: string
  constructor(s?: StringCompat) {
    super()
    this.#value = s ?? ''
  }
  get native(): string {
    return this.#value
  }
}
export class UintN<N extends BitSize> extends ARC4Encoded {
  /** @hidden */
  [TypeProperty]?: `arc4.UintN<${N}>`

  constructor(v?: CompatForArc4Int<N>) {
    super()
  }
  get native(): NativeForArc4Int<N> {
    throw new NoImplementation()
  }
}
export class Byte extends UintN<8> {}
export class UintN8 extends UintN<8> {}
export class UintN16 extends UintN<16> {}
export class UintN32 extends UintN<32> {}
export class UintN64 extends UintN<64> {}
export class UintN128 extends UintN<128> {}
export class UintN256 extends UintN<256> {}
export class UFixedNxM<N extends BitSize, M extends number> extends ARC4Encoded {
  /** @hidden */
  [TypeProperty]?: `arc4.UFixedNxM<${N}x${M}>`
  constructor(v: `${number}.${number}`) {
    super()
  }

  get native(): NativeForArc4Int<N> {
    throw new NoImplementation()
  }
}
export class Bool extends ARC4Encoded {
  /** @hidden */
  [TypeProperty]?: `arc4.Bool`

  constructor(v?: boolean) {
    super()
  }

  get native(): boolean {
    throw new NoImplementation()
  }
}

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

export class StaticArray<TItem extends ARC4Encoded, TLength extends number> extends Arc4ArrayBase<TItem> {
  /** @hidden */
  [TypeProperty]?: `arc4.StaticArray<${TItem[typeof TypeProperty]}, ${TLength}>`
  constructor()
  constructor(...items: TItem[] & { length: TLength })
  constructor(...items: TItem[])
  constructor(...items: TItem[] & { length: TLength }) {
    super()
  }

  copy(): StaticArray<TItem, TLength> {
    throw new NoImplementation()
  }

  /**
   * Returns a new array containing all items from _this_ array, and _other_ array
   * @param other Another array to concat with this one
   */
  concat(other: Arc4ReadonlyArray<TItem>): DynamicArray<TItem> {
    throw new NoImplementation()
  }
}
export class DynamicArray<TItem extends ARC4Encoded> extends Arc4ArrayBase<TItem> {
  /** @hidden */
  [TypeProperty]?: `arc4.DynamicArray<${TItem[typeof TypeProperty]}>`
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

  copy(): DynamicArray<TItem> {
    throw new NoImplementation()
  }

  /**
   * Returns a new array containing all items from _this_ array, and _other_ array
   * @param other Another array to concat with this one
   */
  concat(other: Arc4ReadonlyArray<TItem>): DynamicArray<TItem> {
    throw new NoImplementation()
  }
}
type ExpandTupleType<T extends ARC4Encoded[]> = T extends [infer T1 extends ARC4Encoded, ...infer TRest extends ARC4Encoded[]]
  ? TRest extends []
    ? `${T1[typeof TypeProperty]}`
    : `${T1[typeof TypeProperty]},${ExpandTupleType<TRest>}`
  : ''

export class Tuple<TTuple extends [ARC4Encoded, ...ARC4Encoded[]]> extends ARC4Encoded {
  /** @hidden */
  [TypeProperty]?: `arc4.Tuple<${ExpandTupleType<TTuple>}>`
  constructor(...items: TTuple) {
    super()
  }

  at<TIndex extends keyof TTuple>(index: TIndex): TTuple[TIndex] {
    throw new NoImplementation()
  }

  get length(): TTuple['length'] & uint64 {
    throw new NoImplementation()
  }

  get native(): TTuple {
    throw new NoImplementation()
  }
}

export class Address extends Arc4ArrayBase<Byte> {
  /** @hidden */
  [TypeProperty]?: `arc4.Address`
  constructor(value?: Account | string | bytes) {
    super()
  }

  get native(): Account {
    throw new NoImplementation()
  }
}

type StructConstraint = Record<string, ARC4Encoded>

class StructBase extends ARC4Encoded {
  /** @hidden */
  [TypeProperty] = 'arc4.Struct'
}
class StructImpl<T extends StructConstraint> extends StructBase {
  constructor(initial: T) {
    super()
    for (const [prop, val] of Object.entries(initial)) {
      Object.defineProperty(this, prop, {
        value: val,
        writable: true,
        enumerable: true,
      })
    }
  }
}

type StructConstructor = new <T extends StructConstraint>(initial: T) => StructBase & Readonly<T>

export const Struct = StructImpl as StructConstructor

export class DynamicBytes extends Arc4ArrayBase<Byte> {
  /** @hidden */
  [TypeProperty]?: `arc4.DynamicBytes`

  constructor(value?: bytes | string) {
    super()
  }

  get native(): bytes {
    throw new NoImplementation()
  }

  /**
   * Returns a dynamic bytes object containing all bytes from _this_ and _other_
   * @param other Another array of bytes to concat with this one
   */
  concat(other: Arc4ReadonlyArray<Byte>): DynamicBytes {
    throw new NoImplementation()
  }
}

export class StaticBytes<TLength extends number = 0> extends Arc4ArrayBase<Byte> {
  /** @hidden */
  [TypeProperty]?: `arc4.StaticBytes<${TLength}>`

  constructor(value?: bytes | string) {
    super()
  }

  get native(): bytes {
    throw new NoImplementation()
  }

  /**
   * Returns a dynamic bytes object containing all bytes from _this_ and _other_
   * @param other Another array of bytes to concat with this one
   */
  concat(other: Arc4ReadonlyArray<Byte>): DynamicBytes {
    throw new NoImplementation()
  }
}

/**
 * Interpret the provided bytes as an ARC4 encoded type with no validation
 * @param bytes An arc4 encoded bytes value
 * @param prefix The prefix (if any), present in the bytes value. This prefix will be validated and removed
 */
export function interpretAsArc4<T extends ARC4Encoded>(bytes: BytesCompat, prefix: 'none' | 'log' = 'none'): T {
  throw new NoImplementation()
}

/**
 * Decode the provided bytes to a native Algorand TypeScript value
 * @param bytes An arc4 encoded bytes value
 * @param prefix The prefix (if any), present in the bytes value. This prefix will be validated and removed
 */
export function decodeArc4<T>(bytes: BytesCompat, prefix: 'none' | 'log' = 'none'): T {
  throw new NoImplementation()
}

/**
 * Encode the provided Algorand TypeScript value as ARC4 bytes
 * @param value Any native Algorand TypeScript value with a supported ARC4 encoding
 */
export function encodeArc4<T>(value: T): bytes {
  throw new NoImplementation()
}
