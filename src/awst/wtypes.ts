import { invariant } from '../util'
import type { SourceLocation } from './source-location'
import type { TransactionKind } from './models'

export enum AVMType {
  bytes = 1 << 0,
  uint64 = 1 << 1,
  any = AVMType.bytes | AVMType.uint64,
}

export class WType {
  constructor(props: { name: string; immutable?: boolean; scalarType: AVMType | null; ephemeral?: boolean }) {
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
  scalarType: null,
})
export const boolWType = new WType({
  name: 'bool',
  scalarType: AVMType.uint64,
})
export const uint64WType = new WType({
  name: 'uint64',
  scalarType: AVMType.uint64,
})
export const uint64RangeWType = new WType({
  name: 'uint64_range',
  scalarType: null,
  immutable: true,
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
  readonly decodeType: WType | null
  readonly arc4Name: string
  readonly otherEncodeableTypes: WType[]
  constructor({
    decodeType,
    arc4Name,
    otherEncodeableTypes,
    ...rest
  }: {
    decodeType: WType | null
    arc4Name: string
    otherEncodeableTypes: WType[]
    name: string
    immutable?: boolean
    scalarType: AVMType | null
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
      scalarType: null,
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
      scalarType: null,
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
      scalarType: null,
      immutable: true,
    })
    this.sequenceType = props.sequenceType
  }
}
export class WGroupTransaction extends WType {
  transactionType: TransactionKind | null
  constructor({ transactionType }: { transactionType?: TransactionKind }) {
    super({
      scalarType: AVMType.uint64,
      name: transactionType === undefined ? 'group_transaction' : `group_transaction_${transactionType}`,
    })
    this.transactionType = transactionType ?? null
  }
}

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

export abstract class ARC4Array extends ARC4Type {
  readonly elementType: ARC4Type
  protected constructor(props: { arc4Name: string; otherEncodeableTypes: WType[]; name: string; elementType: ARC4Type }) {
    super({ decodeType: null, scalarType: AVMType.bytes, immutable: false, ...props })
    this.elementType = props.elementType
  }
}

export class ARC4DynamicArray extends ARC4Array {
  readonly sourceLocation: SourceLocation | null
  constructor({ elementType, sourceLocation }: { elementType: ARC4Type; sourceLocation?: SourceLocation }) {
    super({ elementType, name: `arc4.dynamic_array<${elementType.name}>`, arc4Name: `${elementType.arc4Name}[]`, otherEncodeableTypes: [] })
    this.sourceLocation = sourceLocation ?? null
  }
}
export class ARC4StaticArray extends ARC4Array {
  readonly sourceLocation: SourceLocation | null
  readonly arraySize: bigint
  constructor({ elementType, sourceLocation, arraySize }: { arraySize: bigint; elementType: ARC4Type; sourceLocation?: SourceLocation }) {
    super({
      elementType,
      name: `arc4.static_array<${elementType.name}>`,
      arc4Name: `${elementType.arc4Name}[${arraySize}]`,
      otherEncodeableTypes: [],
    })
    this.sourceLocation = sourceLocation ?? null
    this.arraySize = arraySize
  }
}
