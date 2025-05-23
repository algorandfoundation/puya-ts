import { invariant } from '../util'
import { TransactionKind } from './models'
import type { SourceLocation } from './source-location'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace wtypes {
  export class WType {
    constructor(props: { name: string; immutable?: boolean }) {
      this.name = props.name
      this.immutable = props.immutable ?? true
    }

    readonly name: string
    readonly immutable: boolean

    equals(other: WType): boolean {
      return other instanceof this.constructor && other.name === this.name
    }

    toString(): string {
      return this.name
    }
  }

  export const voidWType = new WType({
    name: 'void',
  })
  export const boolWType = new WType({
    name: 'bool',
  })
  export const uint64WType = new WType({
    name: 'uint64',
  })
  export const uint64RangeWType = new WType({
    name: 'uint64_range',
  })

  export const stateKeyWType = new WType({
    name: 'state_key',
  })
  export const boxKeyWType = new WType({
    name: 'box_key',
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

  export class BytesWType extends WType {
    readonly length: bigint | null

    constructor(args?: { length: bigint | null }) {
      const length = args?.length ?? null
      super({
        name: length === null ? 'bytes' : `bytes[${length}]`,
        immutable: true,
      })
      this.length = length
    }
  }
  export const bytesWType = new BytesWType()

  export class ARC4Type extends WType {
    readonly arc4Alias: string
    constructor({ arc4Alias, ...rest }: { arc4Alias: string; name: string; immutable?: boolean }) {
      super({ ...rest })
      this.arc4Alias = arc4Alias
    }
  }

  export class WTuple extends WType {
    types: WType[]
    names: string[] | undefined
    constructor(props: { names?: string[]; types: WType[]; immutable?: boolean; name?: string }) {
      super({
        name: props.name ?? 'tuple',
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
      const displayName = this.name.split('::').at(-1) ?? this.name
      if (this.names) {
        return `${displayName}{ ${this.names.map((n, i) => `${n}: ${this.types[i]}`).join(', ')} }`
      }
      return `${this.immutable ? 'readonly' : ''}${displayName}[${this.types.join(', ')}]`
    }
  }
  export abstract class NativeArray extends WType {
    readonly elementType: WType
    readonly sourceLocation: SourceLocation | null
    protected constructor(props: { name: string; itemType: WType; sourceLocation?: SourceLocation }) {
      super({
        name: props.name,
      })
      this.elementType = props.itemType
      this.sourceLocation = props.sourceLocation ?? null
    }
  }

  export class StackArray extends NativeArray {
    readonly immutable = true
    constructor(props: { itemType: WType; immutable: boolean; sourceLocation?: SourceLocation }) {
      super({
        name: `stack_array<${props.itemType.name}>`,
        ...props,
      })
    }
  }
  export class ReferenceArray extends NativeArray {
    readonly immutable = false
    constructor(props: { itemType: WType; immutable: boolean; sourceLocation?: SourceLocation }) {
      super({
        name: `ref_array<${props.itemType.name}>`,
        ...props,
      })
    }
  }

  export class WEnumeration extends WType {
    readonly sequenceType: WType
    constructor(props: { sequenceType: WType }) {
      super({
        name: `enumeration<${props.sequenceType.name}>`,
        immutable: true,
      })
      this.sequenceType = props.sequenceType
    }
  }
  export class WGroupTransaction extends WType {
    transactionType: TransactionKind | null
    arc4Alias: string
    constructor({ transactionType }: { transactionType?: TransactionKind }) {
      super({
        name: transactionType === undefined ? 'group_transaction' : `group_transaction_${TransactionKind[transactionType]}`,
      })
      this.transactionType = transactionType ?? null
      this.arc4Alias = transactionType ? TransactionKind[transactionType] : 'txn'
    }
  }
  export class WInnerTransaction extends WType {
    transactionType: TransactionKind | null
    constructor({ transactionType }: { transactionType?: TransactionKind }) {
      super({
        name: transactionType === undefined ? 'inner_transaction' : `inner_transaction_${TransactionKind[transactionType]}`,
      })
      this.transactionType = transactionType ?? null
    }
  }
  export class WInnerTransactionFields extends WType {
    transactionType: TransactionKind | null
    constructor({ transactionType }: { transactionType?: TransactionKind }) {
      super({
        name: transactionType === undefined ? 'inner_transaction_fields' : `inner_transaction_fields_${TransactionKind[transactionType]}`,
      })
      this.transactionType = transactionType ?? null
    }
  }

  export class ARC4UIntN extends ARC4Type {
    readonly n: bigint
    constructor({ n, arc4Name }: { n: bigint; arc4Name?: string }) {
      super({
        name: arc4Name ? `arc4.${arc4Name}` : `arc4.uint${n}`,
        arc4Alias: arc4Name ?? `uint${n}`,
      })
      invariant(n >= 8n && n <= 512n, 'Invalid uint: n must be between 8 and 512')
      invariant(n % 8n === 0n, 'Invalid uint: n must be multiple of 8')
      this.n = n
    }
  }

  export class ARC4UFixedNxM extends ARC4Type {
    readonly n: bigint
    readonly m: bigint
    constructor({ n, m }: { n: bigint; m: bigint }) {
      super({
        name: `arc4.ufixed${n}x${m}`,
        arc4Alias: `ufixed${n}x${m}`,
      })

      invariant(n >= 8n && n <= 512n, 'Invalid ufixed: n must be between 8 and 512')
      invariant(n % 8n === 0n, 'Invalid ufixed: n must be multiple of 8')
      invariant(m >= 0n && m <= 160n, 'Invalid ufixed: m must be between 0 and 160')
      this.n = n
      this.m = m
    }
  }

  export class ARC4Struct extends ARC4Type {
    fields: Record<string, WType>
    sourceLocation: SourceLocation | null
    frozen: boolean
    desc: string | null

    constructor({
      fields,
      sourceLocation,
      name,
      desc,
      frozen,
    }: {
      frozen: boolean
      name: string
      desc: string | null
      fields: Record<string, WType>
      sourceLocation?: SourceLocation
    }) {
      super({
        arc4Alias: `(${Object.values(fields)
          .map((f) => (f instanceof ARC4Type ? f.arc4Alias : f.name))
          .join(',')})`,
        name,
        immutable: frozen && Object.values(fields).every((t) => t.immutable),
      })
      this.sourceLocation = sourceLocation ?? null
      this.fields = fields
      this.frozen = frozen
      this.desc = desc
    }

    toString(): string {
      if (!this.name) return this.arc4Alias
      return super.toString()
    }
  }
  export class ARC4Tuple extends ARC4Type {
    readonly types: WType[]
    readonly sourceLocation: SourceLocation | null

    constructor({ types, sourceLocation }: { types: WType[]; sourceLocation?: SourceLocation }) {
      const typesStr = types.map((t) => (t instanceof ARC4Type ? t.arc4Alias : t.name)).join(',')
      super({
        name: `arc4.tuple<${typesStr}>`,
        arc4Alias: `(${typesStr})`,
      })
      this.sourceLocation = sourceLocation ?? null
      this.types = types
    }
  }

  export abstract class ARC4Array extends ARC4Type {
    readonly elementType: WType
    protected constructor(props: { arc4Alias: string; name: string; elementType: WType; immutable?: boolean }) {
      super({
        ...props,
        immutable: props.immutable ?? false,
      })
      this.elementType = props.elementType
    }
  }

  export class ARC4DynamicArray extends ARC4Array {
    readonly sourceLocation: SourceLocation | null
    constructor({
      elementType,
      sourceLocation,
      arc4Alias,
      immutable,
    }: {
      elementType: WType
      sourceLocation?: SourceLocation
      arc4Alias?: string
      immutable?: boolean
    }) {
      super({
        elementType,
        name: `arc4.dynamic_array<${elementType.name}>`,
        arc4Alias: arc4Alias ?? `${elementType instanceof ARC4Type ? elementType.arc4Alias : elementType.name}[]`,
        immutable,
      })
      this.sourceLocation = sourceLocation ?? null
    }
  }
  export class ARC4StaticArray extends ARC4Array {
    readonly sourceLocation: SourceLocation | null
    readonly arraySize: bigint
    constructor({
      elementType,
      sourceLocation,
      arraySize,
      arc4Alias,
      immutable,
    }: {
      arraySize: bigint
      elementType: WType
      sourceLocation?: SourceLocation
      arc4Alias?: string
      immutable?: boolean
    }) {
      super({
        elementType,
        name: `arc4.static_array<${elementType.name}>`,
        arc4Alias: arc4Alias ?? `${elementType instanceof ARC4Type ? elementType.arc4Alias : elementType.name}[${arraySize}]`,
        immutable,
      })
      this.sourceLocation = sourceLocation ?? null
      this.arraySize = arraySize
    }
  }

  export const arc4ByteAliasWType = new ARC4UIntN({
    n: 8n,
    arc4Name: 'byte',
  })
  export const arc4AddressAliasWType = new ARC4StaticArray({
    arraySize: 32n,
    immutable: true,
    elementType: arc4ByteAliasWType,
    arc4Alias: 'address',
  })

  export const arc4BooleanWType = new ARC4Type({
    name: 'arc4.bool',
    arc4Alias: 'bool',
    immutable: true,
  })

  export const arc4StringAliasWType = new ARC4DynamicArray({
    arc4Alias: 'string',
    elementType: arc4ByteAliasWType,
    immutable: true,
  })
}
