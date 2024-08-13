export enum AVMType {
  bytes = 1 << 0,
  uint64 = 1 << 1,
  any = AVMType.bytes | AVMType.uint64,
}

export class WType {
  constructor(props: { name: string; immutable?: boolean; scalarType: AVMType | undefined; ephemeral?: boolean }) {
    this.name = props.name
    this.immutable = props.immutable ?? true
    this.scalarType = props.scalarType
    this.ephemeral = props.ephemeral ?? false
  }

  readonly name: string
  readonly immutable: boolean
  /**
   * ephemeral types are not suitable for naive storage / persistence,
   *      even if their underlying type is a simple stack value
   */
  readonly ephemeral: boolean
  /**
   * The AVM stack type of this type (if any)
   */
  readonly scalarType: AVMType | undefined

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
  scalarType: undefined,
})
export const boolWType = new WType({
  name: 'bool',
  scalarType: AVMType.uint64,
})
export const uint64WType = new WType({
  name: 'uint64',
  scalarType: AVMType.uint64,
})
export const bytesWType = new WType({
  name: 'bytes',
  scalarType: AVMType.bytes,
})
export const stateKeyWType = new WType({
  name: 'state_key',
  scalarType: AVMType.bytes,
})
export const boxKeyWType = new WType({
  name: 'box_key',
  scalarType: AVMType.bytes,
})
export const stringWType = new WType({
  name: 'string',
  scalarType: AVMType.bytes,
})
export const biguintWType = new WType({
  name: 'biguint',
  scalarType: AVMType.bytes,
})
export const assetWType = new WType({
  name: 'asset',
  scalarType: AVMType.uint64,
})

export const accountWType = new WType({
  name: 'account',
  scalarType: AVMType.bytes,
})
export const applicationWType = new WType({
  name: 'application',
  scalarType: AVMType.uint64,
})

export abstract class ARC4Type extends WType {}

export class WStructType extends WType {}
export class WInnerTransactionFields extends WType {}

export class WTuple extends WType {
  items: WType[]
  constructor(props: { items: WType[]; immutable: boolean }) {
    super({
      name: 'WTuple',
      scalarType: undefined,
      immutable: props.immutable,
    })
    this.items = props.items
  }

  toString(): string {
    return `${this.immutable ? 'readonly' : ''}tuple[${this.items.join(', ')}]`
  }
}
export class WArray extends WType {
  itemType: WType
  constructor(props: { itemType: WType; immutable: boolean }) {
    super({
      name: 'WArray',
      scalarType: undefined,
      immutable: props.immutable,
    })
    this.itemType = props.itemType
  }
}

export class ARC4UIntN extends ARC4Type {
  readonly n: bigint
  constructor({ n }: { n: bigint }) {
    super({
      name: `arc4.uint${n}`,
      scalarType: AVMType.bytes,
    })
    this.n = n
  }
}
export class ARC4UFixedNxM extends ARC4Type {}

export class ARC4Struct extends ARC4Type {}

export abstract class ARC4Array extends ARC4Type {}
