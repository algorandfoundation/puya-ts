import { invariant } from '../util'
import { TransactionKind } from './models'
import type { SourceLocation } from './source-location'

export enum AVMType {
  bytes = 1 << 0,
  uint64 = 1 << 1,
  any = AVMType.bytes | AVMType.uint64,
}

export class WType {
  readonly puyaTypeName: string
  constructor(props: { name: string; immutable?: boolean; scalarType: AVMType | null; ephemeral?: boolean }) {
    this.name = props.name
    this.immutable = props.immutable ?? true
    this.scalarType = props.scalarType
    this.ephemeral = props.ephemeral ?? false
    this.puyaTypeName = this.constructor.name
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
    return other instanceof this.constructor && other.name === this.name
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

export class ARC4WType extends WType {
  readonly puyaTypeName: string = 'ARC4Type'
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
    otherEncodeableTypes?: WType[]
    name: string
    immutable?: boolean
    scalarType?: AVMType | null
    ephemeral?: boolean
  }) {
    super({ ...rest, scalarType: rest.scalarType ?? AVMType.bytes })
    this.arc4Name = arc4Name
    this.decodeType = decodeType
    this.otherEncodeableTypes = otherEncodeableTypes ?? []
  }
}

export class WStructType extends WType {
  fields: Record<string, WType>

  constructor({ fields, name }: { fields: Record<string, WType>; name: string }) {
    super({
      name,
      scalarType: null,
      immutable: true,
    })
    this.fields = fields
  }
}

export class WTuple extends WType {
  types: WType[]
  names: string[] | undefined
  constructor(props: { names?: string[]; types: WType[]; immutable?: boolean; name?: string }) {
    super({
      name: props.name ?? 'tuple',
      scalarType: null,
      immutable: props.immutable ?? true,
    })
    invariant(props.types.length, 'Tuple length cannot be zero')
    this.types = props.types
    if (props.names) {
      invariant(props.names.length === props.types.length, 'If names is provided, length must match types')
      this.names = props.names
    }
  }

  equals(other: WType): boolean {
    if (other instanceof WTuple) {
      return (
        this.name === other.name &&
        this.types.every((t, i) => t.equals(other.types[i])) &&
        (this.names?.every((n, i) => n === other.names?.[i]) ?? this.names === other.names)
      )
    }
    return false
  }

  toString(): string {
    if (this.names) {
      return `${this.name ?? ''}{ ${this.names.map((n, i) => `${n}: ${this.types[i]}`).join(', ')} }`
    }
    return `${this.immutable ? 'readonly' : ''}${this.name ?? ''}[${this.types.join(', ')}]`
  }
}
export class WArray extends WType {
  readonly elementType: WType
  constructor(props: { itemType: WType; immutable: boolean }) {
    super({
      name: 'WArray',
      scalarType: null,
      immutable: props.immutable,
    })
    this.elementType = props.itemType
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
      name: transactionType === undefined ? 'group_transaction' : `group_transaction_${TransactionKind[transactionType]}`,
    })
    this.transactionType = transactionType ?? null
  }
}
export class WInnerTransaction extends WType {
  transactionType: TransactionKind | null
  constructor({ transactionType }: { transactionType?: TransactionKind }) {
    super({
      scalarType: null,
      name: transactionType === undefined ? 'inner_transaction' : `inner_transaction_${TransactionKind[transactionType]}`,
    })
    this.transactionType = transactionType ?? null
  }
}
export class WInnerTransactionFields extends WType {
  transactionType: TransactionKind | null
  constructor({ transactionType }: { transactionType?: TransactionKind }) {
    super({
      scalarType: null,
      name: transactionType === undefined ? 'inner_transaction_fields' : `inner_transaction_fields_${TransactionKind[transactionType]}`,
    })
    this.transactionType = transactionType ?? null
  }
}

export class ARC4UIntNWType extends ARC4WType {
  readonly puyaTypeName = 'ARC4UIntN'
  readonly n: bigint
  constructor({ n, arc4Name }: { n: bigint; arc4Name?: string }) {
    super({
      name: arc4Name ? `arc4.${arc4Name}` : `arc4.uint${n}`,
      scalarType: AVMType.bytes,
      decodeType: n <= 64 ? uint64WType : biguintWType,
      arc4Name: arc4Name ?? `uint${n}`,
      otherEncodeableTypes: [uint64WType, biguintWType, boolWType],
    })
    this.n = n
  }
}

export class ARC4UFixedNxM extends ARC4WType {}

export class ARC4StructWType extends ARC4WType {
  readonly puyaTypeName = 'ARC4Struct'

  fields: Record<string, ARC4WType>
  sourceLocation: SourceLocation | null

  constructor({ fields, sourceLocation, name }: { name: string; fields: Record<string, ARC4WType>; sourceLocation?: SourceLocation }) {
    super({
      arc4Name: Object.values(fields)
        .map((f) => f.arc4Name)
        .join(','),
      name,
      decodeType: null,
    })
    this.sourceLocation = sourceLocation ?? null
    this.fields = fields
  }
}
export class ARC4TupleWType extends ARC4WType {
  readonly puyaTypeName = 'ARC4Tuple'
  readonly types: ARC4WType[]
  readonly sourceLocation: SourceLocation | null

  constructor({ types, sourceLocation }: { types: ARC4WType[]; sourceLocation?: SourceLocation }) {
    const typesStr = types.map((t) => t.arc4Name).join(',')
    super({
      name: `arc4.tuple<${typesStr}>`,
      arc4Name: `(${typesStr})`,
      decodeType: null,
    })
    this.sourceLocation = sourceLocation ?? null
    this.types = types
  }
}

export abstract class ARC4ArrayWType extends ARC4WType {
  readonly elementType: ARC4WType
  protected constructor(props: {
    arc4Name: string
    otherEncodeableTypes: WType[]
    name: string
    elementType: ARC4WType
    decodeType?: WType
    immutable?: boolean
  }) {
    super({ ...props, scalarType: AVMType.bytes, immutable: props.immutable ?? false, decodeType: props.decodeType ?? null })
    this.elementType = props.elementType
  }
}

export class ARC4DynamicArrayWType extends ARC4ArrayWType {
  readonly puyaTypeName = 'ARC4DynamicArray'

  readonly sourceLocation: SourceLocation | null
  constructor({
    elementType,
    sourceLocation,
    arc4Name,
    decodeType,
    immutable,
  }: {
    elementType: ARC4WType
    sourceLocation?: SourceLocation
    arc4Name?: string
    decodeType?: WType
    immutable?: boolean
  }) {
    super({
      elementType,
      name: `arc4.dynamic_array<${elementType.name}>`,
      arc4Name: arc4Name ?? `${elementType.arc4Name}[]`,
      otherEncodeableTypes: [],
      decodeType,
      immutable,
    })
    this.sourceLocation = sourceLocation ?? null
  }
}
export class ARC4StaticArrayWType extends ARC4ArrayWType {
  readonly puyaTypeName = 'ARC4StaticArray'
  readonly sourceLocation: SourceLocation | null
  readonly arraySize: bigint
  constructor({
    elementType,
    sourceLocation,
    arraySize,
    arc4Name,
    decodeType,
    immutable,
  }: {
    arraySize: bigint
    elementType: ARC4WType
    sourceLocation?: SourceLocation
    arc4Name?: string
    decodeType?: WType
    immutable?: boolean
  }) {
    super({
      elementType,
      name: `arc4.static_array<${elementType.name}>`,
      arc4Name: arc4Name ?? `${elementType.arc4Name}[${arraySize}]`,
      decodeType,
      otherEncodeableTypes: [],
      immutable,
    })
    this.sourceLocation = sourceLocation ?? null
    this.arraySize = arraySize
  }
}

export const arc4ByteAliasWType = new ARC4UIntNWType({
  n: 8n,
  arc4Name: 'byte',
})

export const arc4BooleanWType = new ARC4WType({
  name: 'arc4.bool',
  arc4Name: 'bool',
  immutable: true,
  decodeType: boolWType,
})

export const arc4StringAliasWType = new ARC4DynamicArrayWType({
  arc4Name: 'string',
  elementType: arc4ByteAliasWType,
  decodeType: stringWType,
  immutable: true,
})
