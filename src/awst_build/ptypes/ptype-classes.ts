import { wtypes } from '../../awst'
import { codeInvariant } from '../../util'
import { WTuple, WType } from '../../awst/wtypes'
import { Constants } from '../../constants'
import { GlobalState } from '../../../packages/algo-ts'

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

  get fullName() {
    return `${this.module}::${this.name}`
  }

  get wtypeOrThrow(): wtypes.WType {
    codeInvariant(this.wtype, `${this.fullName} does not have a wtype`)
    return this.wtype
  }

  equals(other: PType): boolean {
    return this.fullName === other.fullName
  }

  toString(): string {
    return this.name
  }
}

export class SimpleType extends PType {
  readonly wtype: wtypes.WType | undefined
  readonly name: string
  readonly module: string

  constructor({ name, module, wtype }: { name: string; module: string; wtype: wtypes.WType }) {
    super()
    this.name = name
    this.wtype = wtype
    this.module = module
  }
}
export class LiteralValueType extends PType {
  readonly wtype: undefined = undefined
  readonly name: string
  readonly module: string

  constructor({ name, module }: { name: string; module: string }) {
    super()
    this.name = name
    this.module = module
  }
}
export class LibFunctionType extends PType {
  readonly wtype: undefined
  readonly name: string
  readonly module: string

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

  constructor({ name }: { name: string }) {
    super()
    this.name = name
  }
}
export class IntrinsicFunctionType extends PType {
  readonly wtype: undefined
  readonly name: string
  readonly module: string = Constants.opModuleName

  constructor({ name }: { name: string }) {
    super()
    this.name = name
  }
}

export class NamespaceType extends PType {
  readonly wtype: undefined
  readonly name: string
  readonly factory: undefined
  readonly module: string

  constructor({ name, module }: { name: string; module: string }) {
    super()
    this.name = name
    this.module = module
  }

  get fullName() {
    return `${this.module}::*`
  }
}

export class IntrinsicEnumType extends PType {
  readonly wtype: undefined
  readonly name: string
  readonly factory: undefined
  readonly module: string
  readonly members: Array<[string, string]>

  constructor({ name, module, members }: { name: string; module: string; members: Array<[string, string]> }) {
    super()
    this.members = members
    this.name = name
    this.module = module
  }
}

export class FunctionType extends PType {
  readonly wtype: undefined
  readonly name: string
  readonly module: string
  readonly returnType: PType
  readonly parameters: PType[]

  constructor(props: { name: string; module: string; returnType: PType; parameters: PType[] }) {
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
  static parametise(typeArgs: PType[]): GlobalStateType {
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

export class ContractClassType extends PType {
  readonly wtype = undefined
  readonly name: string
  readonly module: string
  readonly properties: Record<string, PType>
  readonly methods: Record<string, FunctionType>

  constructor(props: { module: string; name: string; properties: Record<string, AppStorageType>; methods: Record<string, FunctionType> }) {
    super()
    this.name = props.name
    this.module = props.module
    this.properties = props.properties
    this.methods = props.methods
  }
}
