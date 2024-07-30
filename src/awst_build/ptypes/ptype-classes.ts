import { wtypes } from '../../awst'
import { codeInvariant, distinct, sortBy } from '../../util'
import { WTuple, WType } from '../../awst/wtypes'
import { Constants } from '../../constants'
import { CodeError, InternalError, NotSupported } from '../../errors'
import { bigintPType, biguintPType, numberPType, uint64PType } from './index'

/**
 * Represents a public type visible to a developer of AlgoTS
 */
export abstract class PType {
  /**
   * Get the associated wtype for this ptype if applicable
   */
  abstract readonly wtype: wtypes.WType | undefined

  /**
   * Get the unaliased name of this ptype
   */
  abstract readonly name: string

  /**
   * Get the declaring module of this ptype
   */
  abstract readonly module: string

  abstract readonly singleton: boolean

  get fullName() {
    return `${this.module}::${this.name}`
  }

  get wtypeOrThrow(): wtypes.WType {
    codeInvariant(this.wtype, `${this.fullName} does not have a wtype`)
    return this.wtype
  }

  equals(other: PType): boolean {
    return other instanceof this.constructor && this.fullName === other.fullName
  }

  toString(): string {
    return this.name
  }
}

export class InstanceType extends PType {
  readonly wtype: wtypes.WType
  readonly name: string
  readonly module: string
  readonly singleton = false

  constructor({ name, module, wtype }: { name: string; module: string; wtype: wtypes.WType }) {
    super()
    this.name = name
    this.wtype = wtype
    this.module = module
  }
}

/**
 * Transient types can appear in expressions but should not be used as variable or return types
 */
export class TransientType extends PType {
  readonly wtype: undefined = undefined
  readonly name: string
  readonly module: string
  readonly singleton: boolean
  readonly typeMessage: string
  readonly expressionMessage: string

  constructor({
    name,
    module,
    singleton,
    typeMessage,
    expressionMessage,
  }: {
    name: string
    module: string
    singleton: boolean
    typeMessage: string
    expressionMessage: string
  }) {
    super()
    this.name = name
    this.module = module
    this.singleton = singleton
    this.typeMessage = typeMessage
    this.expressionMessage = expressionMessage
  }

  get wtypeOrThrow(): WType {
    throw new CodeError(this.typeMessage)
  }
}

export class LibFunctionType extends PType {
  readonly wtype: undefined
  readonly name: string
  readonly module: string
  readonly singleton = true

  constructor({ name, module }: { name: string; module: string }) {
    super()
    this.name = name
    this.module = module
  }
}
export class IntrinsicFunctionGroupType extends PType {
  readonly wtype: undefined
  readonly name: string
  readonly module: string = Constants.opModuleName
  readonly singleton = true

  constructor({ name }: { name: string }) {
    super()
    this.name = name
  }
}
export class IntrinsicFunctionType extends PType {
  readonly wtype: undefined
  readonly name: string
  readonly module: string = Constants.opModuleName
  readonly singleton = true

  constructor({ name }: { name: string }) {
    super()
    this.name = name
  }
}

export class NamespacePType extends PType {
  readonly wtype: undefined
  readonly name: string
  readonly factory: undefined
  readonly module: string
  readonly singleton = true

  constructor({ name, module }: { name: string; module: string }) {
    super()
    this.name = name
    this.module = module
  }

  get fullName() {
    return `${this.module}::*`
  }

  toString(): string {
    return this.module
  }
}

export class IntrinsicEnumType extends PType {
  readonly wtype: undefined
  readonly name: string
  readonly factory: undefined
  readonly module: string
  readonly members: Array<[string, string]>
  readonly singleton = true

  constructor({ name, module, members }: { name: string; module: string; members: Array<[string, string]> }) {
    super()
    this.members = members
    this.name = name
    this.module = module
  }
}

export class FunctionPType extends PType {
  readonly wtype: undefined
  readonly name: string
  readonly module: string
  readonly returnType: PType
  readonly parameters: Array<readonly [string, PType]>
  readonly singleton = true

  constructor(props: { name: string; module: string; returnType: PType; parameters: Array<readonly [string, PType]> }) {
    super()
    this.name = props.name
    this.module = props.module
    this.returnType = props.returnType
    this.parameters = props.parameters
  }
}
export class TuplePType extends PType {
  readonly wtype: WType
  readonly name: string = 'Tuple'
  readonly module: string = 'lib.d.ts'
  readonly items: PType[]
  readonly singleton = false

  constructor(props: { items: PType[]; immutable: boolean }) {
    super()
    this.items = props.items
    this.wtype = new WTuple({
      items: props.items.map((i) => i.wtypeOrThrow),
      immutable: props.immutable,
    })
  }
}

export abstract class StorageProxyPType extends PType {
  readonly wtype: WType
  readonly contentType: PType
  readonly singleton = false

  protected constructor(props: { content: PType; keyWType: WType }) {
    super()
    this.wtype = props.keyWType
    this.contentType = props.content
  }
}

export class GlobalStateType extends StorageProxyPType {
  readonly module: string = Constants.stateModuleName
  get name() {
    return `GlobalState<${this.contentType.name}>`
  }
  get fullName() {
    return `${this.module}::GlobalState<${this.contentType.fullName}>`
  }
  constructor(props: { content: PType }) {
    super({ ...props, keyWType: wtypes.stateKeyWType })
  }
  static get baseFullName(): string {
    return `${Constants.stateModuleName}::GlobalState`
  }
  static parameterise(typeArgs: PType[]): GlobalStateType {
    codeInvariant(typeArgs.length === 1, 'GlobalState type expects exactly one type parameter')
    return new GlobalStateType({
      content: typeArgs[0],
    })
  }
}
export class LocalStateType extends StorageProxyPType {
  readonly module: string = Constants.stateModuleName
  get name() {
    return `LocalState<${this.contentType.fullName}>`
  }
  constructor(props: { content: PType }) {
    super({ ...props, keyWType: wtypes.stateKeyWType })
  }
}
export type AppStorageType = GlobalStateType | LocalStateType

export function isAppStorageType(ptype: PType): ptype is AppStorageType {
  return ptype instanceof GlobalStateType || ptype instanceof LocalStateType
}

export class ContractClassPType extends PType {
  readonly wtype = undefined
  readonly name: string
  readonly module: string
  readonly properties: Record<string, PType>
  readonly methods: Record<string, FunctionPType>
  readonly singleton = true
  readonly baseType: ContractClassPType | undefined

  constructor(props: {
    module: string
    name: string
    properties: Record<string, AppStorageType>
    methods: Record<string, FunctionPType>
    baseType: ContractClassPType | undefined
  }) {
    super()
    this.name = props.name
    this.module = props.module
    this.properties = props.properties
    this.methods = props.methods
    this.baseType = props.baseType
  }

  get isARC4(): boolean {
    return this.baseType?.isARC4 === true
  }
}
export class ObjectPType extends PType {
  readonly name: string
  readonly module: string
  readonly properties: Record<string, PType>
  readonly singleton = false

  constructor(props: { module: string; name: string; properties: Record<string, PType> }) {
    super()
    this.name = props.name
    this.module = props.module
    this.properties = props.properties
  }

  get wtype(): WTuple {
    return new WTuple({
      items: this.orderedProperties().map(([_, ptype]) => ptype.wtypeOrThrow),
      immutable: false,
    })
  }

  orderedProperties() {
    return Object.entries(this.properties).toSorted(sortBy(([key]) => key))
  }

  getPropertyType(name: string): PType {
    if (Object.hasOwn(this.properties, name)) {
      return this.properties[name]
    }
    throw new CodeError(`${this} does not have property ${name}`)
  }
}

export class BaseContractClassType extends ContractClassPType {
  readonly _isArc4: boolean
  get isARC4(): boolean {
    return super.isARC4
  }

  constructor({
    isArc4,
    ...rest
  }: {
    isArc4: boolean
    module: string
    name: string
    properties: Record<string, AppStorageType>
    methods: Record<string, FunctionPType>
    baseType: ContractClassPType | undefined
  }) {
    super(rest)
    this._isArc4 = isArc4
  }
}

export class UnsupportedType extends PType {
  readonly wtype: undefined = undefined
  readonly name: string
  readonly module: string
  readonly singleton = false

  constructor({ name, module }: { name: string; module: string }) {
    super()
    this.name = name
    this.module = module
  }

  get wtypeOrThrow(): WType {
    throw new NotSupported(`The type ${this.fullName} is not supported`)
  }
}

function ptypesEqual(a: PType[], b: PType[]): boolean {
  const aSorted = a.filter(distinct((t) => t.fullName)).toSorted(sortBy((t) => t.fullName))
  const bSorted = b.filter(distinct((t) => t.fullName)).toSorted(sortBy((t) => t.fullName))
  return aSorted.length === bSorted.length && aSorted.every((aa, i) => aa.equals(bSorted[i]))
}

export class UnionPType extends TransientType {
  get fullName() {
    return this.types.map((t) => t.fullName).join(' | ')
  }
  readonly singleton = false
  readonly types: PType[]
  readonly wtype = undefined
  private constructor({ types }: { types: PType[] }) {
    let typeMessage: string
    let expressionMessage: string
    if (ptypesEqual(types, [uint64PType, numberPType])) {
      typeMessage = numberPType.typeMessage
      expressionMessage = numberPType.expressionMessage
    } else if (ptypesEqual(types, [biguintPType, bigintPType])) {
      typeMessage = bigintPType.typeMessage
      expressionMessage = bigintPType.expressionMessage
    } else {
      typeMessage = 'Union types are not valid as a variable, parameter, return, or property type.'
      expressionMessage = 'Union types are only valid in boolean expressions.'
    }
    const name = types.map((t) => t.name).join(' | ')
    super({
      name,
      module: 'lib.d.ts',
      singleton: false,
      typeMessage: `${typeMessage} Expression type is ${name}`,
      expressionMessage: `${expressionMessage} Expression type is ${name}`,
    })
    this.types = types
  }

  static fromTypes(types: PType[]) {
    if (types.length === 0) {
      throw new InternalError('Cannot create union of zero types')
    }
    const distinctTypes = types.filter(distinct((t) => t.fullName)).toSorted(sortBy((t) => t.fullName))
    if (distinctTypes.length === 1) {
      return distinctTypes[0]
    }
    return new UnionPType({
      types: distinctTypes,
    })
  }
}
