import { DeliberateAny } from '../typescript-helpers'
import { it } from 'vitest'

export type WTypeClass = { new (...args: DeliberateAny[]): WType }

export class WType {
  constructor(props: { name: string; immutable?: boolean; scalar?: boolean }) {
    this.name = props.name
    this.immutable = props.immutable ?? true
    this.scalar = props.scalar ?? true
  }

  readonly name: string
  readonly immutable: boolean
  readonly scalar: boolean

  equals(other: WType): boolean {
    return other.name === this.name
  }

  toString(): string {
    return this.name
  }

  get id() {
    return this.name
  }
}

export const voidWType = new WType({
  name: 'void',
  scalar: false,
})
export const boolWType = new WType({
  name: 'bool',
})
export const uint64WType = new WType({
  name: 'uint64',
})
export const bytesWType = new WType({
  name: 'bytes',
})
export const stringWType = new WType({
  name: 'string',
})
export const biguintWType = new WType({
  name: 'biguint',
})
export const assetWType = new WType({
  name: 'asset',
})

export const accountWType = new WType({
  name: 'account',
})
export const applicationWType = new WType({
  name: 'application',
})

export abstract class ARC4Type extends WType {}

export class WStructType extends WType {}
export class WInnerTransactionFields extends WType {}

export class WTuple extends WType {
  items: WType[]
  constructor(props: { items: WType[]; immutable: boolean }) {
    super({
      name: 'WTuple',
      scalar: false,
      immutable: props.immutable,
    })
    this.items = props.items
  }
}
export class WArray extends WType {}

export class ARC4UFixedNxM extends ARC4Type {}

export class ARC4Struct extends ARC4Type {}

export abstract class ARC4Array extends ARC4Type {}
