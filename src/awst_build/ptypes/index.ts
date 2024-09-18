import { Constants } from '../../constants'
import { wtypes } from '../../awst'
import { codeInvariant, distinct, sortBy } from '../../util'
import type { WType } from '../../awst/wtypes'
import { WInnerTransaction, WInnerTransactionFields } from '../../awst/wtypes'
import { WEnumeration } from '../../awst/wtypes'
import { uint64WType, WArray, WGroupTransaction, WTuple } from '../../awst/wtypes'
import { CodeError, InternalError, NotSupported } from '../../errors'
import { PType } from './base'
import { TransactionKind } from '../../awst/models'

export * from './intrinsic-enum-type'
export * from './op-ptypes'
export * from './base'

/**
 * Transient types can appear in expressions but should not be used as variable or return types
 */
export class TransientType extends PType {
  readonly wtype: WType | undefined = undefined
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
  #fullName: string | undefined

  constructor({ name, module, fullName }: { name: string; module: string; fullName?: string }) {
    super()
    this.name = name
    this.module = module
    this.#fullName = fullName
  }

  get fullName() {
    return this.#fullName ?? super.fullName
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
  readonly baseTypes: ContractClassPType[]

  constructor(props: {
    module: string
    name: string
    properties: Record<string, AppStorageType>
    methods: Record<string, FunctionPType>
    baseTypes: ContractClassPType[]
  }) {
    super()
    this.name = props.name
    this.module = props.module
    this.properties = props.properties
    this.methods = props.methods
    this.baseTypes = props.baseTypes
  }

  get isARC4(): boolean {
    return this.baseTypes.some((b) => b.isARC4)
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
    baseTypes: ContractClassPType[]
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
    const transientType = types.find((t) => t instanceof TransientType)
    if (transientType) {
      typeMessage = transientType.typeMessage
      expressionMessage = transientType.expressionMessage
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

  abstract getGenericArgs(): PType[]
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

  getGenericArgs(): PType[] {
    return [this.contentType]
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

  getGenericArgs(): PType[] {
    return [this.contentType]
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

  getGenericArgs(): PType[] {
    return [this.contentType]
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

  getGenericArgs(): PType[] {
    return [this.keyType, this.contentType]
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

  getGenericArgs(): PType[] {
    return []
  }
}
export type AppStorageType = GlobalStateType | LocalStateType

export function isAppStorageType(ptype: PType): ptype is AppStorageType {
  return ptype instanceof GlobalStateType || ptype instanceof LocalStateType
}

/**
 * An open generic type parameter
 */
export class TypeParameterType extends PType {
  readonly name: string
  readonly module: string
  readonly singleton = false
  readonly wtype = undefined
  constructor({ name, module }: { name: string; module: string }) {
    super()
    this.name = name
    this.module = module
  }
}

/**
 * A type from the typescript libs which might pop up in type reflection
 * but is not relevant to the output of the compiler
 */
export class InternalType extends PType {
  readonly name: string
  readonly module: string
  readonly singleton = false
  readonly wtype = undefined
  constructor({ name, module }: { name: string; module: string }) {
    super()
    this.name = name
    this.module = module
  }
}
export const ClassMethodDecoratorContext = new InternalType({
  module: 'typescript/lib/lib.decorators.d.ts',
  name: 'ClassMethodDecoratorContext',
})

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
  constructor(props: { items: PType[]; immutable?: boolean }) {
    super()
    this.items = props.items
    this.immutable = props.immutable ?? true
  }

  get wtype(): WTuple {
    return new WTuple({
      types: this.items.map((i) => i.wtypeOrThrow),
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
      types: this.orderedProperties().map(([_, ptype]) => ptype.wtypeOrThrow),
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

export const voidPType = new InstanceType({
  name: 'void',
  module: 'lib.d.ts',
  wtype: wtypes.voidWType,
})
export const neverPType = new InstanceType({
  name: 'never',
  module: 'lib.d.ts',
  wtype: wtypes.voidWType,
})
export const unknownPType = new UnsupportedType({
  name: 'unknown',
  module: 'lib.d.ts',
  fullName: 'unknown',
})

export const nullPType = new UnsupportedType({
  name: 'null',
  module: 'lib.d.ts',
  fullName: 'null',
})
export const undefinedPType = new UnsupportedType({
  name: 'undefined',
  module: 'lib.d.ts',
  fullName: 'undefined',
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

export class BigIntPType extends TransientType {
  readonly literalValue: bigint | undefined
  constructor(props?: { literalValue: bigint }) {
    super({
      name: 'bigint',
      module: 'lib.d.ts',
      singleton: false,
      typeMessage:
        '`bigint` is not valid as a variable, parameter, return, or property type. Please use an algo-ts type such as `biguint` or `uint64`',
      expressionMessage:
        'Expression of type `bigint` must be explicitly converted to an algo-ts type, for example by wrapping the expression in `Uint64(...)`',
    })
    this.literalValue = props?.literalValue
  }
}
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
export class NumberPType extends TransientType {
  readonly literalValue: bigint | undefined
  constructor(props?: { literalValue: bigint }) {
    const typeName = props?.literalValue.toString() ?? 'number'
    super({
      name: `${typeName}`,
      module: 'lib.d.ts',
      singleton: false,
      typeMessage: `\`${typeName}\` is not valid as a variable, parameter, return, or property type. Please use an algo-ts type such as \`uint64\` or \`biguint\``,
      expressionMessage: `Expression of type \`number\` must be explicitly converted to an algo-ts type, for example by wrapping the expression in \`Uint64(...)\``,
    })
    this.literalValue = props?.literalValue
  }
}
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
export const ApplicationFunctionType = new LibFunctionType({
  name: 'Application',
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

export const baseContractType = new BaseContractClassType({
  module: Constants.baseContractModuleName,
  name: 'BaseContract',
  methods: {
    clearStateProgram: ClearStateProgram,
  },
  properties: {},
  baseTypes: [],
  isArc4: false,
})
export const arc4BaseContractType = new BaseContractClassType({
  module: Constants.arc4ModuleName,
  name: 'Contract',
  methods: {
    approvalProgram: ApprovalProgram,
    clearStateProgram: ClearStateProgram,
  },
  properties: {},
  baseTypes: [baseContractType],
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

export class GroupTransactionPType extends PType {
  get wtype() {
    return new WGroupTransaction({
      transactionType: this.kind,
    })
  }
  readonly name: string
  readonly kind: TransactionKind | undefined
  readonly module = Constants.gtxnModuleName
  readonly singleton = false

  constructor({ kind, name }: { kind?: TransactionKind; name: string }) {
    super()
    this.name = name
    this.kind = kind
  }
}

export class TransactionFunctionType extends LibFunctionType {
  readonly kind: TransactionKind | undefined

  constructor({ name, module, kind }: { name: string; module: string; kind: TransactionKind | undefined }) {
    super({ name, module })
    this.kind = kind
  }
}

export const paymentGtxnType = new GroupTransactionPType({
  name: 'PayTxn',
  kind: TransactionKind.pay,
})
export const PayTxnFunction = new TransactionFunctionType({
  name: 'PayTxn',
  module: Constants.gtxnModuleName,
  kind: TransactionKind.pay,
})
export const keyRegistrationGtxnType = new GroupTransactionPType({
  name: 'KeyRegistrationTxn',
  kind: TransactionKind.keyreg,
})
export const KeyRegistrationTxnFunction = new TransactionFunctionType({
  name: 'KeyRegistrationTxn',
  module: Constants.gtxnModuleName,
  kind: TransactionKind.keyreg,
})
export const assetConfigGtxnType = new GroupTransactionPType({
  name: 'AssetConfigTxn',
  kind: TransactionKind.acfg,
})
export const AssetConfigTxnFunction = new TransactionFunctionType({
  name: 'AssetConfigTxn',
  module: Constants.gtxnModuleName,
  kind: TransactionKind.acfg,
})
export const assetTransferGtxnType = new GroupTransactionPType({
  name: 'AssetTransferTxn',
  kind: TransactionKind.axfer,
})
export const AssetTransferTxnFunction = new TransactionFunctionType({
  name: 'AssetTransferTxn',
  module: Constants.gtxnModuleName,
  kind: TransactionKind.axfer,
})
export const assetFreezeGtxnType = new GroupTransactionPType({
  name: 'AssetFreezeTxn',
  kind: TransactionKind.afrz,
})
export const AssetFreezeTxnFunction = new TransactionFunctionType({
  name: 'AssetFreezeTxn',
  module: Constants.gtxnModuleName,
  kind: TransactionKind.afrz,
})
export const applicationCallGtxnType = new GroupTransactionPType({
  name: 'ApplicationTxn',
  kind: TransactionKind.appl,
})
export const ApplicationTxnFunction = new TransactionFunctionType({
  name: 'ApplicationTxn',
  module: Constants.gtxnModuleName,
  kind: TransactionKind.appl,
})
export const anyGtxnType = new GroupTransactionPType({
  name: 'Transaction',
  kind: undefined,
})
export const TransactionFunction = new TransactionFunctionType({
  name: 'Transaction',
  module: Constants.gtxnModuleName,
  kind: undefined,
})

export const assertMatchFunction = new LibFunctionType({
  name: 'assertMatch',
  module: Constants.utilModuleName,
})

export class Uint64EnumType extends PType {
  readonly wtype = uint64WType
  readonly name: string
  readonly module: string
  readonly singleton = true
  readonly members: Record<string, bigint>

  constructor(props: { name: string; module: string; members: Record<string, bigint> }) {
    super()
    this.name = props.name
    this.module = props.module
    this.members = props.members
  }
}

export const transactionTypeType = new Uint64EnumType({
  module: Constants.transactionsModuleName,
  name: 'TransactionType',
  members: {
    Payment: 1n,
    KeyRegistration: 2n,
    AssetConfig: 3n,
    AssetTransfer: 4n,
    AssetFreeze: 5n,
    Application: 6n,
  },
})
export const onCompleteActionType = new Uint64EnumType({
  module: Constants.arc4ModuleName,
  name: 'OnCompleteAction',
  members: {
    NoOp: 0n,
    OptIn: 1n,
    CloseOut: 2n,
    ClearState: 3n,
    UpdateApplication: 4n,
    DeleteApplication: 5n,
  },
})
export const ensureBudgetFunction = new LibFunctionType({
  name: 'ensureBudget',
  module: Constants.utilModuleName,
})
export const opUpFeeSourceType = new Uint64EnumType({
  module: Constants.utilModuleName,
  name: 'OpUpFeeSource',
  members: {
    GroupCredit: 0n,
    AppAccount: 1n,
    Any: 2n,
  },
})

export const urangeFunction = new LibFunctionType({
  name: 'urange',
  module: Constants.utilModuleName,
})

export class IterableIteratorType extends TransientType {
  readonly wtype: WEnumeration
  readonly itemType: PType
  constructor({ itemType }: { itemType: PType }) {
    super({
      name: `${IterableIteratorType.baseName}<${itemType.name}>`,
      module: 'typescript/lib/lib.es2015.iterable.d.ts',
      typeMessage: '`IterableIterator` is not valid as a variable, parameter, return, or property type. ',
      expressionMessage: 'IterableIterator expressions can only be used in for loops',
      singleton: false,
    })
    this.itemType = itemType
    this.wtype = new WEnumeration({ sequenceType: this.itemType.wtypeOrThrow })
  }
  static readonly baseName = 'IterableIterator'
  static readonly moduleName = 'typescript/lib/lib.es2015.iterable.d.ts'
  static readonly baseFullName = `${IterableIteratorType.moduleName}::${IterableIteratorType.baseName}`

  get fullName() {
    return `${GlobalStateType.baseFullName}<${this.itemType.fullName}>`
  }
  static parameterise(typeArgs: PType[]): IterableIteratorType {
    codeInvariant(typeArgs.length === 1, 'IterableIterator type expects exactly one type parameter')
    return new IterableIteratorType({
      itemType: typeArgs[0],
    })
  }

  getGenericArgs(): PType[] {
    return [this.itemType]
  }
}

export const paymentItxnFn = new TransactionFunctionType({
  name: 'payment',
  module: Constants.itxnModuleName,
  kind: TransactionKind.pay,
})
export const keyRegistrationItxnFn = new TransactionFunctionType({
  name: 'keyRegistration',
  module: Constants.itxnModuleName,
  kind: TransactionKind.keyreg,
})
export const assetConfigItxnFn = new TransactionFunctionType({
  name: 'assetConfig',
  module: Constants.itxnModuleName,
  kind: TransactionKind.acfg,
})
export const assetTransferItxnFn = new TransactionFunctionType({
  name: 'assetTransfer',
  module: Constants.itxnModuleName,
  kind: TransactionKind.axfer,
})
export const assetFreezeItxnFn = new TransactionFunctionType({
  name: 'assetFreeze',
  module: Constants.itxnModuleName,
  kind: TransactionKind.afrz,
})
export const applicationCallItxnFn = new TransactionFunctionType({
  name: 'applicationCall',
  module: Constants.itxnModuleName,
  kind: TransactionKind.appl,
})

export class InnerTransactionPType extends PType {
  get wtype() {
    return new WInnerTransaction({
      transactionType: this.kind,
    })
  }
  readonly name: string
  readonly kind: TransactionKind | undefined
  readonly module = Constants.itxnModuleName
  readonly singleton = false

  constructor({ kind, name }: { kind?: TransactionKind; name: string }) {
    super()
    this.name = name
    this.kind = kind
  }
}
export class ItxnParamsPType extends PType {
  get wtype() {
    return new WInnerTransactionFields({
      transactionType: this.kind,
    })
  }
  readonly name: string
  readonly kind: TransactionKind | undefined
  readonly module = Constants.itxnModuleName
  readonly singleton = false

  constructor({ kind, name }: { kind?: TransactionKind; name: string }) {
    super()
    this.name = name
    this.kind = kind
  }
}
export const paymentItxnParamsType = new ItxnParamsPType({
  name: 'PaymentItxnParams',
  kind: TransactionKind.pay,
})
export const paymentItxnType = new InnerTransactionPType({
  name: 'PaymentInnerTxn',
  kind: TransactionKind.pay,
})
export const keyRegistrationItxnParamsType = new ItxnParamsPType({
  name: 'KeyRegistrationItxnParams',
  kind: TransactionKind.keyreg,
})
export const keyRegistrationItxnType = new InnerTransactionPType({
  name: 'KeyRegistrationInnerTxn',
  kind: TransactionKind.keyreg,
})
export const assetConfigItxnParamsType = new ItxnParamsPType({
  name: 'AssetConfigItxnParams',
  kind: TransactionKind.acfg,
})
export const assetConfigItxnType = new InnerTransactionPType({
  name: 'AssetConfigInnerTxn',
  kind: TransactionKind.acfg,
})
export const assetTransferItxnParamsType = new ItxnParamsPType({
  name: 'AssetTransferItxnParams',
  kind: TransactionKind.axfer,
})
export const assetTransferItxnType = new InnerTransactionPType({
  name: 'AssetTransferInnerTxn',
  kind: TransactionKind.axfer,
})
export const assetFreezeItxnParamsType = new ItxnParamsPType({
  name: 'AssetFreezeItxnParams',
  kind: TransactionKind.afrz,
})
export const assetFreezeItxnType = new InnerTransactionPType({
  name: 'AssetFreezeInnerTxn',
  kind: TransactionKind.afrz,
})
export const applicationCallItxnParamsType = new ItxnParamsPType({
  name: 'ApplicationCallItxnParams',
  kind: TransactionKind.appl,
})
export const applicationItxnType = new InnerTransactionPType({
  name: 'ApplicationInnerTxn',
  kind: TransactionKind.appl,
})

export const submitGroupItxnFunction = new LibFunctionType({
  name: 'submitGroup',
  module: Constants.itxnModuleName,
})
