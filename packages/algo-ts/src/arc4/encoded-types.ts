import { avmError, avmInvariant } from '../impl/errors'
import { arrayUtil, BytesCls, getNumber, getUint8Array, isBytes, isUint64 } from '../impl/primitives'
import { biguint, BigUintCompat, Bytes, bytes, BytesBacked, StringCompat, Uint64, uint64, Uint64Compat } from '../primitives'
import { Account } from '../reference'
import { err } from '../util'

export type BitSize = 8 | 16 | 32 | 64 | 128 | 256 | 512
type NativeForArc4Int<N extends BitSize> = N extends 8 | 16 | 32 | 64 ? uint64 : biguint
type CompatForArc4Int<N extends BitSize> = N extends 8 | 16 | 32 | 64 ? Uint64Compat : BigUintCompat

abstract class AbiEncoded implements BytesBacked {
  abstract __type?: string
  get bytes(): bytes {
    throw new Error('todo')
  }

  equals(other: this): boolean {
    return this.bytes.equals(other.bytes)
  }
}

export class Str extends AbiEncoded {
  __type?: 'arc4.Str'
  #value: string
  constructor(s?: StringCompat) {
    super()
    this.#value = s ?? ''
  }
  get native(): string {
    return this.#value
  }
}
export class UintN<N extends BitSize> extends AbiEncoded {
  __type?: `arc4.UintN<${N}>`

  constructor(v?: CompatForArc4Int<N>) {
    super()
  }
  get native(): NativeForArc4Int<N> {
    throw new Error('TODO')
  }
}
export class UFixedNxM<N extends BitSize, M extends number> extends AbiEncoded {
  __type?: `arc4.UFixedNxM<${N}x${M}>`
  constructor(v: `${number}.${number}`, n?: N, m?: M) {
    super()
  }

  get native(): NativeForArc4Int<N> {
    throw new Error('TODO')
  }
}

export class Byte extends UintN<8> {
  constructor(v?: Uint64Compat) {
    super(v)
  }
}
export class Bool {
  __type?: `arc4.Bool`
  #v: boolean
  constructor(v?: boolean) {
    this.#v = v ?? false
  }

  get native(): boolean {
    return this.#v
  }
}

abstract class Arc4ReadonlyArray<TItem extends AbiEncoded> extends AbiEncoded {
  protected items: TItem[]
  protected constructor(items: TItem[]) {
    super()
    this.items = items.slice()
    return new Proxy(this, {
      get(target, prop) {
        if (isUint64(prop)) {
          const idx = getNumber(prop)
          if (idx < target.items.length) return target.items[idx]
          avmError('Index out of bounds')
        }
        return Reflect.get(target, prop)
      },
      set(target, prop, value) {
        if (isUint64(prop)) {
          const idx = getNumber(prop)
          if (idx < target.items.length) {
            target.items[idx] = value
            return true
          }
          avmError('Index out of bounds')
        }
        avmError('Property is not writable')
      },
    })
  }

  /**
   * Returns the current length of this array
   */
  get length(): uint64 {
    return Uint64(this.items.length)
  }

  /**
   * Returns the item at the given index.
   * Negative indexes are taken from the end.
   * @param index The index of the item to retrieve
   */
  at(index: Uint64Compat): TItem {
    return arrayUtil.arrayAt(this.items, index)
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
    return new DynamicArray(...arrayUtil.arraySlice(this.items, start, end))
  }

  /**
   * Returns an iterator for the items in this array
   */
  [Symbol.iterator](): IterableIterator<TItem> {
    return this.items[Symbol.iterator]()
  }

  /**
   * Returns an iterator for a tuple of the indexes and items in this array
   */
  *entries(): IterableIterator<readonly [uint64, TItem]> {
    for (const [idx, item] of this.items.entries()) {
      yield [Uint64(idx), item]
    }
  }

  /**
   * Returns an iterator for the indexes in this array
   */
  *keys(): IterableIterator<uint64> {
    for (const idx of this.items.keys()) {
      yield Uint64(idx)
    }
  }

  /**
   * Get or set the item at the specified index.
   * Negative indexes are not supported
   */
  [index: uint64]: TItem
}

export class StaticArray<TItem extends AbiEncoded, TLength extends number> extends Arc4ReadonlyArray<TItem> {
  __type?: `arc4.StaticArray<${TItem['__type']}, ${TLength}>`
  constructor()
  constructor(...items: TItem[] & { length: TLength })
  constructor(...items: TItem[])
  constructor(...items: TItem[] & { length: TLength }) {
    super(items)
  }

  copy(): StaticArray<TItem, TLength> {
    return new StaticArray<TItem, TLength>(...this.items)
  }
}

export class DynamicArray<TItem extends AbiEncoded> extends Arc4ReadonlyArray<TItem> {
  __type?: `arc4.DynamicArray<${TItem['__type']}>`
  constructor(...items: TItem[]) {
    super(items)
  }

  /**
   * Push a number of items into this array
   * @param items The items to be added to this array
   */
  push(...items: TItem[]): void {
    this.items.push(...items)
  }

  /**
   * Pop a single item from this array
   */
  pop(): TItem {
    const item = this.items.pop()
    if (item === undefined) avmError('The array is empty')
    return item
  }

  copy(): DynamicArray<TItem> {
    return new DynamicArray<TItem>(...this.items)
  }
}
type ExpandTupleType<T extends AbiEncoded[]> = T extends [infer T1 extends AbiEncoded, ...infer TRest extends AbiEncoded[]]
  ? TRest extends []
    ? `${T1['__type']}`
    : `${T1['__type']},${ExpandTupleType<TRest>}`
  : ''

export class Tuple<TTuple extends [AbiEncoded, ...AbiEncoded[]]> extends AbiEncoded {
  __type?: `arc4.Tuple<${ExpandTupleType<TTuple>}>`
  #items: TTuple
  constructor(...items: TTuple) {
    super()
    this.#items = items
  }

  at<TIndex extends keyof TTuple>(index: TIndex): TTuple[TIndex] {
    return this.#items[index] ?? err('Index out of bounds')
  }

  get length(): TTuple['length'] & uint64 {
    return this.#items.length
  }

  get native(): TTuple {
    return this.#items
  }
}

export class Address extends Arc4ReadonlyArray<Byte> {
  __type?: `arc4.Address`
  constructor(value?: Account | string | bytes) {
    let byteValues: Uint8Array
    if (value === undefined) {
      byteValues = new Uint8Array(32)
    } else if (typeof value === 'string') {
      // Interpret as base 32
      byteValues = BytesCls.fromBase32(value).asUint8Array()
    } else if (isBytes(value)) {
      byteValues = getUint8Array(value)
    } else {
      byteValues = getUint8Array(value.bytes)
    }
    avmInvariant(byteValues.length === 32, 'Addresses should be 32 bytes')
    super(Array.from(byteValues).map((b) => new Byte(b)))
  }

  get native(): Account {
    return Account(Bytes(this.items.map((i) => i.native)))
  }
}
