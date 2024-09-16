import { biguint, BigUintCompat, Bytes, bytes, BytesBacked, StringCompat, uint64, Uint64Compat } from '../primitives'
import { ctxMgr } from '../execution-context'
import { err } from '../util'
import { Account } from '../reference'

export type BitSize = 8 | 16 | 32 | 64 | 128 | 256 | 512
type NativeForArc4Int<N extends BitSize> = N extends 8 | 16 | 32 | 64 ? uint64 : biguint
type CompatForArc4Int<N extends BitSize> = N extends 8 | 16 | 32 | 64 ? Uint64Compat : BigUintCompat

abstract class AbiEncoded implements BytesBacked {
  get bytes(): bytes {
    throw new Error('todo')
  }
}

export class Str extends AbiEncoded {
  constructor(s: StringCompat) {
    super()
  }
  get native(): string {
    throw new Error('TODO')
  }
}
export class UintN<N extends BitSize> extends AbiEncoded {
  constructor(v?: CompatForArc4Int<N>) {
    super()
  }
  get native(): NativeForArc4Int<N> {
    throw new Error('TODO')
  }
}
export class UFixedNxM<N extends BitSize, M extends number> {
  constructor(v: `${number}:${number}`, n?: N, m?: M) {}

  get native(): NativeForArc4Int<N> {
    throw new Error('TODO')
  }
}

export class Byte extends UintN<8> {
  constructor(v: Uint64Compat) {
    super(v)
  }
  get native(): uint64 {
    throw new Error('TODO')
  }
}
export class Bool {
  #v: boolean
  constructor(v: boolean) {
    this.#v = v
  }

  get native(): boolean {
    return this.#v
  }
}

abstract class Arc4Array<TItem> extends AbiEncoded {
  protected constructor(protected items: TItem[]) {
    super()
  }
  get length(): uint64 {
    throw new Error('TODO')
  }
  at(index: Uint64Compat): TItem {
    return ctxMgr.instance.arrayAt(this.items, index)
  }
  slice(start: Uint64Compat, end: Uint64Compat): DynamicArray<TItem> {
    return new DynamicArray(...ctxMgr.instance.arraySlice(this.items, start, end))
  }
  [Symbol.iterator](): IterableIterator<TItem> {
    return this.items[Symbol.iterator]()
  }
  entries(): IterableIterator<readonly [uint64, TItem]> {
    throw new Error('TODO')
  }
  keys(): IterableIterator<uint64> {
    throw new Error('TODO')
  }
}

export class StaticArray<TItem, TLength extends number> extends Arc4Array<TItem> {
  constructor()
  constructor(...items: TItem[] & { length: TLength })
  constructor(...items: TItem[] & { length: TLength }) {
    super(items)
  }
}

export class DynamicArray<TItem> extends Arc4Array<TItem> {
  constructor(...items: TItem[]) {
    super(items)
  }
  push(...items: TItem[]): void {}
  pop(): TItem {
    throw new Error('Not implemented')
  }
}

type ItemAt<TTuple extends unknown[], TIndex extends number> = undefined extends TTuple[TIndex] ? never : TTuple[TIndex]

export class Tuple<TTuple extends unknown[]> {
  #items: TTuple
  constructor(...items: TTuple) {
    this.#items = items
  }

  at<TIndex extends number>(index: TIndex): ItemAt<TTuple, TIndex> {
    return (this.#items[index] ?? err('Index out of bounds')) as ItemAt<TTuple, TIndex>
  }

  get native(): TTuple {
    return this.#items
  }
}

export class Address extends StaticArray<Byte, 32> {
  constructor(value: Account | string | bytes) {
    super()
  }

  get native(): Account {
    throw new Error('TODO')
  }
}
