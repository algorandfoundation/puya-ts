import { invariant } from '../util'

export enum AVMType {
  bytes = 1 << 0,
  uint64 = 1 << 1,
  any = AVMType.bytes | AVMType.uint64,
}

export class WType {
  constructor(props: { name: string; immutable?: boolean; scalarType: AVMType | undefined; ephemeral?: boolean }) {
    this.name = props.name
    this.immutable = props.immutable ?? true
    this.scalarType = props.scalarType ?? null
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
  readonly scalarType: AVMType | null

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

export abstract class ARC4Type extends WType {
  readonly decodeType: WType | undefined
  readonly arc4Name: string
  readonly otherEncodeableTypes: WType[]
  constructor({
    decodeType,
    arc4Name,
    otherEncodeableTypes,
    ...rest
  }: {
    decodeType: WType | undefined
    arc4Name: string
    otherEncodeableTypes: WType[]
    name: string
    immutable?: boolean
    scalarType: AVMType | undefined
    ephemeral?: boolean
  }) {
    super(rest)
    this.arc4Name = arc4Name
    this.decodeType = decodeType
    this.otherEncodeableTypes = otherEncodeableTypes
  }
}

export class WStructType extends WType {}
export class WInnerTransactionFields extends WType {}

export class WTuple extends WType {
  types: WType[]
  constructor(props: { types: WType[]; immutable: boolean }) {
    super({
      name: 'WTuple',
      scalarType: undefined,
      immutable: props.immutable,
    })
    invariant(props.types.length, 'Tuple length cannot be zero')
    this.types = props.types
  }

  toString(): string {
    return `${this.immutable ? 'readonly' : ''}tuple[${this.types.join(', ')}]`
  }
}
export class WArray extends WType {
  readonly itemType: WType
  constructor(props: { itemType: WType; immutable: boolean }) {
    super({
      name: 'WArray',
      scalarType: undefined,
      immutable: props.immutable,
    })
    this.itemType = props.itemType
  }
}

export class WEnumeration extends WType {
  readonly sequenceType: WType
  constructor(props: { sequenceType: WType }) {
    super({
      name: 'WArray',
      scalarType: undefined,
      immutable: true,
    })
    this.sequenceType = props.sequenceType
  }
}
export class WGroupTransaction extends WType {}

export class ARC4UIntN extends ARC4Type {
  readonly n: bigint
  constructor({ n }: { n: bigint }) {
    super({
      name: `arc4.uint${n}`,
      scalarType: AVMType.bytes,
      decodeType: n <= 64 ? uint64WType : biguintWType,
      arc4Name: `uint${n}`,
      otherEncodeableTypes: [uint64WType, biguintWType, boolWType],
    })
    this.n = n
  }
}
export class ARC4UFixedNxM extends ARC4Type {}

export class ARC4Struct extends ARC4Type {}

export abstract class ARC4Array extends ARC4Type {}
