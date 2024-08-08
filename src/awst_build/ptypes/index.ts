import { Constants } from '../../constants'
import { wtypes } from '../../awst'
import { codeInvariant, distinct, sortBy } from '../../util'
import type { WType } from '../../awst/wtypes'
import { WArray } from '../../awst/wtypes'
import { WTuple } from '../../awst/wtypes'
import { CodeError, InternalError, NotSupported } from '../../errors'
import { PType } from './base'
export * from './intrinsic-enum-type'
export * from './op-ptypes'
export * from './base'

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

export class BaseContractClassType extends ContractClassPType {
  readonly _isArc4: boolean
  get isARC4(): boolean {
    return this._isArc4
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
  static readonly baseName = 'GlobalState'
  static readonly baseFullName = `${Constants.stateModuleName}::${GlobalStateType.baseName}`
  readonly module: string = Constants.stateModuleName
  get name() {
    return `${GlobalStateType.baseName}<${this.contentType.name}>`
  }
  get fullName() {
    return `${GlobalStateType.baseFullName}<${this.contentType.fullName}>`
  }
  constructor(props: { content: PType }) {
    super({ ...props, keyWType: wtypes.stateKeyWType })
  }
  static parameterise(typeArgs: PType[]): GlobalStateType {
    codeInvariant(typeArgs.length === 1, 'GlobalState type expects exactly one type parameter')
    return new GlobalStateType({
      content: typeArgs[0],
    })
  }
}
export class LocalStateType extends StorageProxyPType {
  static readonly baseName = 'LocalState'
  static readonly baseFullName = `${Constants.stateModuleName}::${LocalStateType.baseName}`
  readonly module: string = Constants.stateModuleName
  get name() {
    return `${LocalStateType.baseName}<${this.contentType.name}>`
  }
  get fullName() {
    return `${LocalStateType.baseFullName}<${this.contentType.fullName}>`
  }
  constructor(props: { content: PType }) {
    super({ ...props, keyWType: wtypes.stateKeyWType })
  }
  static parameterise(typeArgs: PType[]): LocalStateType {
    codeInvariant(typeArgs.length === 1, 'LocalState type expects exactly one type parameter')
    return new LocalStateType({
      content: typeArgs[0],
    })
  }
}
export class BoxPType extends StorageProxyPType {
  static readonly baseName = 'Box'
  static readonly baseFullName = `${Constants.boxModuleName}::${BoxPType.baseName}`
  readonly module: string = Constants.boxModuleName
  get name() {
    return `${BoxPType.baseName}<${this.contentType.name}>`
  }
  get fullName() {
    return `${BoxPType.baseFullName}<${this.contentType.fullName}>`
  }
  constructor(props: { content: PType }) {
    super({ ...props, keyWType: wtypes.boxKeyWType })
  }
  static parameterise(typeArgs: PType[]): BoxPType {
    codeInvariant(typeArgs.length === 1, `${BoxPType.baseName} type expects exactly one type parameter`)
    return new BoxPType({
      content: typeArgs[0],
    })
  }
}
export class BoxMapPType extends StorageProxyPType {
  static readonly baseName = 'BoxMap'
  static readonly baseFullName = `${Constants.boxModuleName}::${BoxMapPType.baseName}`
  readonly module: string = Constants.boxModuleName
  get name() {
    return `${BoxMapPType.baseName}<${this.keyType.name}, ${this.contentType.name}>`
  }
  get fullName() {
    return `${BoxMapPType.baseFullName}<${this.keyType.name}, ${this.contentType.fullName}>`
  }
  readonly keyType: PType
  constructor(props: { content: PType; keyType: PType }) {
    super({ ...props, keyWType: wtypes.boxKeyWType })
    this.keyType = props.keyType
  }
  static parameterise(typeArgs: PType[]): BoxMapPType {
    codeInvariant(typeArgs.length === 2, `${BoxMapPType.baseName} type expects exactly two type parameters`)
    return new BoxMapPType({
      keyType: typeArgs[0],
      content: typeArgs[1],
    })
  }
}
export class BoxRefPType extends StorageProxyPType {
  readonly module = Constants.boxModuleName
  get name() {
    return 'BoxRef'
  }
  constructor() {
    super({ keyWType: wtypes.boxKeyWType, content: bytesPType })
  }
}
export type AppStorageType = GlobalStateType | LocalStateType

export function isAppStorageType(ptype: PType): ptype is AppStorageType {
  return ptype instanceof GlobalStateType || ptype instanceof LocalStateType
}

export class AnyPType extends PType {
  get wtype(): never {
    throw new CodeError('`any` is not valid as a variable, parameter, return, or property type.')
  }
  readonly name = 'any'
  readonly module = 'lib.d.ts'
  readonly singleton = false
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
  readonly module: string = 'lib.d.ts'
  get name() {
    return `Tuple<${this.items.map((i) => i.name).join(', ')}>`
  }
  get fullName() {
    return `${this.module}::Tuple<${this.items.map((i) => i.fullName).join(', ')}>`
  }

  readonly items: PType[]
  readonly singleton = false
  readonly immutable: boolean
  constructor(props: { items: PType[]; immutable: boolean }) {
    super()
    this.items = props.items
    this.immutable = props.immutable
  }

  get wtype(): WTuple {
    return new WTuple({
      items: this.items.map((i) => i.wtypeOrThrow),
      immutable: this.immutable,
    })
  }
}
export class ArrayPType extends PType {
  readonly module: string = 'lib.d.ts'
  readonly wtype: WType
  readonly itemType: PType
  readonly singleton = false

  get name() {
    return `Array<${this.itemType.name}>`
  }
  get fullName() {
    return `${this.module}::Array<${this.itemType.fullName}>`
  }
  constructor(props: { itemType: PType; immutable: boolean }) {
    super()
    this.itemType = props.itemType
    this.wtype = new WArray({
      itemType: props.itemType.wtypeOrThrow,
      immutable: props.immutable,
    })
  }
}

export class ObjectPType extends PType {
  #name: string
  readonly module: string
  readonly properties: Record<string, PType>
  readonly singleton = false

  constructor(props: { module?: string; name?: string; properties: Record<string, PType> }) {
    super()
    this.#name = props.name ?? ''
    this.module = props.module ?? ''
    this.properties = props.properties
  }

  static literal(props: Record<string, PType> | Array<[string, PType]>) {
    const properties = Array.isArray(props) ? Object.fromEntries(props) : props
    return new ObjectPType({
      properties,
    })
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

  hasProperty(name: string): boolean {
    return Object.hasOwn(this.properties, name)
  }

  hasPropertyOfType(name: string, type: PType) {
    return this.hasProperty(name) && this.properties[name].equals(type)
  }

  get name(): string {
    return `${this.#name}{${this.orderedProperties()
      .map((p) => `${p[0]}:${p[1].name}`)
      .join(',')}}`
  }

  get fullName(): string {
    const alias = [this.module, this.#name].filter(Boolean).join('::')
    return `${alias}{${this.orderedProperties()
      .map((p) => `${p[0]}:${p[1].fullName}`)
      .join(',')}}`
  }
}

function ptypesEqual(a: PType[], b: PType[]): boolean {
  const aSorted = a.filter(distinct((t) => t.fullName)).toSorted(sortBy((t) => t.fullName))
  const bSorted = b.filter(distinct((t) => t.fullName)).toSorted(sortBy((t) => t.fullName))
  return aSorted.length === bSorted.length && aSorted.every((aa, i) => aa.equals(bSorted[i]))
}

export const voidPType = new InstanceType({
  name: 'void',
  module: 'lib.d.ts',
  wtype: wtypes.voidWType,
})

export const nullPType = new UnsupportedType({
  name: 'null',
  module: 'lib.d.ts',
})
export const undefinedPType = new UnsupportedType({
  name: 'undefined',
  module: 'lib.d.ts',
})
export const anyPType = new AnyPType()

export const boolPType = new InstanceType({
  name: 'boolean',
  module: 'lib.d.ts',
  wtype: wtypes.boolWType,
})

export const BooleanFunction = new LibFunctionType({
  name: 'Boolean',
  module: 'typescript/lib/lib.es5.d.ts',
})

export const bigintPType = new TransientType({
  name: 'bigint',
  module: 'lib.d.ts',
  singleton: false,
  typeMessage:
    '`bigint` is not valid as a variable, parameter, return, or property type. Please use an algo-ts type such as `biguint` or `uint64`',
  expressionMessage:
    'Expression of type `bigint` must be explicitly converted to an algo-ts type, for example by wrapping the expression in `Uint64(...)`',
})
export const stringPType = new InstanceType({
  name: 'string',
  module: 'lib.d.ts',
  wtype: wtypes.stringWType,
})
export const StringFunction = new LibFunctionType({
  name: 'String',
  module: 'typescript/lib/lib.es5.d.ts',
})

export const uint64PType = new InstanceType({
  name: 'uint64',
  module: Constants.primitivesModuleName,
  wtype: wtypes.uint64WType,
})
export const biguintPType = new InstanceType({
  name: 'biguint',
  module: Constants.primitivesModuleName,
  wtype: wtypes.biguintWType,
})
export const numberPType = new TransientType({
  name: 'number',
  module: 'lib.d.ts',
  singleton: false,
  typeMessage:
    '`number` is not valid as a variable, parameter, return, or property type. Please use an algo-ts type such as `uint64` or `biguint`',
  expressionMessage:
    'Expression of type `number` must be explicitly converted to an algo-ts type, for example by wrapping the expression in `Uint64(...)`',
})
export const numberUint64Union = UnionPType.fromTypes([numberPType, uint64PType])
export const bigintBiguintUnion = UnionPType.fromTypes([bigintPType, biguintPType])
export const Uint64Function = new LibFunctionType({
  name: 'Uint64',
  module: Constants.primitivesModuleName,
})

export const BigUintFunction = new LibFunctionType({
  name: 'BigUint',
  module: Constants.primitivesModuleName,
})
export const bytesPType = new InstanceType({
  name: 'bytes',
  module: Constants.primitivesModuleName,
  wtype: wtypes.bytesWType,
})
export const BytesFunction = new LibFunctionType({
  name: 'Bytes',
  module: Constants.primitivesModuleName,
})

export const logFunction = new LibFunctionType({
  name: 'log',
  module: Constants.utilModuleName,
})
export const assertFunction = new LibFunctionType({
  name: 'assert',
  module: Constants.utilModuleName,
})

export const errFunction = new LibFunctionType({
  name: 'err',
  module: Constants.utilModuleName,
})

export const assetPType = new InstanceType({
  name: 'Asset',
  wtype: wtypes.assetWType,
  module: Constants.referenceModuleName,
})
export const AssetFunction = new LibFunctionType({
  name: 'Asset',
  module: Constants.referenceModuleName,
})
export const accountPType = new InstanceType({
  name: 'Account',
  wtype: wtypes.accountWType,
  module: Constants.referenceModuleName,
})
export const AccountFunction = new LibFunctionType({
  name: 'Account',
  module: Constants.referenceModuleName,
})
export const applicationPType = new InstanceType({
  name: 'Application',
  wtype: wtypes.applicationWType,
  module: Constants.referenceModuleName,
})
export const GlobalStateFunction = new LibFunctionType({
  name: 'GlobalState',
  module: Constants.stateModuleName,
})
export const LocalStateFunction = new LibFunctionType({
  name: 'LocalState',
  module: Constants.stateModuleName,
})
export const BoxFunction = new LibFunctionType({
  name: BoxPType.baseName,
  module: Constants.boxModuleName,
})
export const BoxMapFunction = new LibFunctionType({
  name: BoxMapPType.baseName,
  module: Constants.boxModuleName,
})
export const BoxRefFunction = new LibFunctionType({
  name: 'BoxRef',
  module: Constants.boxModuleName,
})
export const boxRefType = new BoxRefPType()

export const ClearStateProgram = new FunctionPType({
  name: Constants.clearStateProgramMethodName,
  module: Constants.baseContractModuleName,
  returnType: uint64PType,
  parameters: [],
})

export const ApprovalProgram = new FunctionPType({
  name: Constants.approvalProgramMethodName,
  module: Constants.arc4ModuleName,
  returnType: boolPType,
  parameters: [],
})

export const BaseContractType = new BaseContractClassType({
  module: Constants.baseContractModuleName,
  name: 'BaseContract',
  methods: {
    clearStateProgram: ClearStateProgram,
  },
  properties: {},
  baseType: undefined,
  isArc4: false,
})
export const ContractType = new BaseContractClassType({
  module: Constants.arc4ModuleName,
  name: 'Contract',
  methods: {
    approvalProgram: ApprovalProgram,
    clearStateProgram: ClearStateProgram,
  },
  properties: {},
  baseType: BaseContractType,
  isArc4: true,
})

export const arc4BareMethodDecorator = new LibFunctionType({
  module: Constants.arc4ModuleName,
  name: 'baremethod',
})
export const arc4AbiMethodDecorator = new LibFunctionType({
  module: Constants.arc4ModuleName,
  name: 'abimethod',
})
