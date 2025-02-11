import { TransactionKind } from '../../awst/models'
import { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'

import { Constants } from '../../constants'
import { CodeError, InternalError, NotSupported } from '../../errors'
import { codeInvariant, distinctByEquality, sortBy } from '../../util'
import { SymbolName } from '../symbol-name'
import { GenericPType, PType } from './base'
import { transientTypeErrors } from './transient-type-errors'

export * from './base'
export * from './intrinsic-enum-type'
export * from './op-ptypes'

/**
 * Transient types can appear in expressions but should not be used as variable or return types
 */
export abstract class TransientType extends PType {
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

  get wtype(): wtypes.WType | undefined {
    return undefined
  }

  get wtypeOrThrow(): wtypes.WType {
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

  get wtypeOrThrow(): wtypes.WType {
    throw new NotSupported(`The type ${this.fullName} is not supported`)
  }
}

export class LogicSigPType extends PType {
  readonly wtype = undefined
  readonly name: string
  readonly module: string
  readonly singleton = true
  readonly sourceLocation: SourceLocation
  readonly baseType: LogicSigPType | undefined
  constructor(props: { module: string; name: string; baseType?: LogicSigPType; sourceLocation: SourceLocation }) {
    super()
    this.name = props.name
    this.module = props.module
    this.baseType = props.baseType
    this.sourceLocation = props.sourceLocation
  }
}

export const logicSigBaseType = new LogicSigPType({
  name: 'LogicSig',
  module: Constants.logicSigModuleName,
  sourceLocation: SourceLocation.None,
})

export class ContractClassPType extends PType {
  readonly wtype = undefined
  readonly name: string
  readonly module: string
  readonly properties: Record<string, PType>
  readonly methods: Record<string, FunctionPType>
  readonly singleton = true
  readonly baseTypes: ContractClassPType[]
  readonly sourceLocation: SourceLocation

  constructor(props: {
    module: string
    name: string
    properties: Record<string, AppStorageType>
    methods: Record<string, FunctionPType>
    baseTypes: ContractClassPType[]
    sourceLocation: SourceLocation
  }) {
    super()
    this.name = props.name
    this.module = props.module
    this.properties = props.properties
    this.methods = props.methods
    this.baseTypes = props.baseTypes
    this.sourceLocation = props.sourceLocation
  }

  get isARC4(): boolean {
    return this.baseTypes.some((b) => b.isARC4)
  }

  *allBases(): IterableIterator<ContractClassPType> {
    for (const b of this.baseTypes) {
      yield b
      yield* b.allBases()
    }
  }
}

export class ClusteredContractClassType extends ContractClassPType {
  constructor(props: { methods: Record<string, FunctionPType>; baseTypes: ContractClassPType[]; sourceLocation: SourceLocation }) {
    super({
      ...props,
      name: `ClusteredContract<${props.baseTypes.map((t) => t.fullName).join(',')}>`,
      module: Constants.polytypeModuleName,
      methods: Object.assign({}, ...props.baseTypes.toReversed().map((t) => t.methods)),
      properties: Object.assign({}, ...props.baseTypes.toReversed().map((t) => t.properties)),
    })
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
    sourceLocation: SourceLocation
  }) {
    super(rest)
    this._isArc4 = isArc4
  }
}

export class IntersectionPType extends TransientType {
  get fullName() {
    return this.types.map((t) => t).join(' & ')
  }
  readonly singleton = false
  readonly types: PType[]

  private constructor({ types }: { types: PType[] }) {
    const name = types.map((t) => t).join(' & ')
    super({
      name,
      module: 'lib.d.ts',
      singleton: false,
      typeMessage: transientTypeErrors.intersectionTypes(name).usedAsType,
      expressionMessage: transientTypeErrors.unionTypes(name).usedInExpression,
    })
    this.types = types
  }

  static fromTypes(types: PType[]) {
    if (types.length === 0) {
      throw new InternalError('Cannot create intersection of zero types')
    }
    const distinctTypes = types.filter(distinctByEquality((a, b) => a.equals(b))).toSorted(sortBy((t) => t.fullName))
    if (distinctTypes.length === 1) {
      return distinctTypes[0]
    }
    return new IntersectionPType({
      types: distinctTypes,
    })
  }
}

export class UnionPType extends TransientType {
  get fullName() {
    return this.types.map((t) => t).join(' | ')
  }
  readonly singleton = false
  readonly types: PType[]

  private constructor({ types }: { types: PType[] }) {
    let typeMessage: string
    let expressionMessage: string
    const name = types.map((t) => t).join(' | ')
    const transientType = types.find((t) => t instanceof TransientType)
    if (transientType) {
      if (transientType instanceof NativeNumericType) {
        typeMessage = transientTypeErrors.nativeNumeric(name).usedAsType
        expressionMessage = transientTypeErrors.nativeNumeric(name).usedInExpression
      } else {
        typeMessage = transientType.typeMessage
        expressionMessage = transientType.expressionMessage
      }
    } else {
      typeMessage = transientTypeErrors.unionTypes(name).usedAsType
      expressionMessage = transientTypeErrors.unionTypes(name).usedInExpression
    }
    super({
      name,
      module: 'lib.d.ts',
      singleton: false,
      typeMessage,
      expressionMessage,
    })
    this.types = types
  }

  static fromTypes(types: PType[]) {
    if (types.length === 0) {
      throw new InternalError('Cannot create union of zero types')
    }
    const distinctTypes = types.filter(distinctByEquality((a, b) => a.equals(b))).toSorted(sortBy((t) => t.fullName))
    if (distinctTypes.length === 1) {
      return distinctTypes[0]
    }
    return new UnionPType({
      types: distinctTypes,
    })
  }
}

export abstract class StorageProxyPType extends PType {
  readonly wtype: wtypes.WType
  readonly contentType: PType
  readonly singleton = false

  protected constructor(props: { content: PType; keyWType: wtypes.WType }) {
    super()
    this.wtype = props.keyWType
    this.contentType = props.content
  }
}
export const GlobalStateGeneric = new GenericPType({
  name: 'GlobalState',
  module: Constants.stateModuleName,
  parameterise(typeArgs: PType[]): GlobalStateType {
    codeInvariant(typeArgs.length === 1, 'GlobalState type expects exactly one type parameter')
    return new GlobalStateType({
      content: typeArgs[0],
    })
  },
})
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
}
export const LocalStateGeneric = new GenericPType({
  name: 'LocalState',
  module: Constants.stateModuleName,
  parameterise(typeArgs: PType[]): LocalStateType {
    codeInvariant(typeArgs.length === 1, 'LocalState type expects exactly one type parameter')
    return new LocalStateType({
      content: typeArgs[0],
    })
  },
})
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
export const BoxGeneric = new GenericPType({
  name: 'Box',
  module: Constants.boxModuleName,
  parameterise(typeArgs: PType[]): BoxPType {
    codeInvariant(typeArgs.length === 1, `${this.name} type expects exactly one type parameter`)
    return new BoxPType({
      content: typeArgs[0],
    })
  },
})
export class BoxPType extends StorageProxyPType {
  readonly module: string = Constants.boxModuleName
  get name() {
    return `Box<${this.contentType.name}>`
  }
  get fullName() {
    return `${this.module}::${this.name}<${this.contentType.fullName}>`
  }
  constructor(props: { content: PType }) {
    super({ ...props, keyWType: wtypes.boxKeyWType })
  }
}
export const BoxMapGeneric = new GenericPType({
  name: 'BoxMap',
  module: Constants.boxModuleName,
  parameterise(typeArgs: PType[]): BoxMapPType {
    codeInvariant(typeArgs.length === 2, `${this.name} type expects exactly two type parameters`)
    return new BoxMapPType({
      keyType: typeArgs[0],
      content: typeArgs[1],
    })
  },
})
export class BoxMapPType extends StorageProxyPType {
  readonly module: string = Constants.boxModuleName
  get name() {
    return `BoxMap<${this.keyType.name}, ${this.contentType.name}>`
  }
  get fullName() {
    return `${this.module}::${this.name}<${this.keyType.name}, ${this.contentType.fullName}>`
  }
  readonly keyType: PType
  constructor(props: { content: PType; keyType: PType }) {
    super({ ...props, keyWType: wtypes.boxKeyWType })
    this.keyType = props.keyType
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
export class LibClassType extends PType {
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
export class IntrinsicFunctionGroupTypeType extends PType {
  readonly wtype: undefined
  readonly name: string
  readonly module: string = Constants.opModuleName
  readonly singleton = false

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
export class IntrinsicFunctionTypeType extends PType {
  readonly wtype: undefined
  readonly name: string
  readonly module: string = Constants.opModuleName
  readonly singleton = false

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
    if (props.returnType instanceof ObjectPType && !props.returnType.alias) {
      this.returnType = new ObjectPType({
        alias: new SymbolName({ name: `${props.name}Result`, module: this.module }),
        properties: props.returnType.properties,
        description: props.returnType.description,
      })
    } else {
      this.returnType = props.returnType
    }
    this.parameters = props.parameters
  }
}
export class ArrayLiteralPType extends TransientType {
  get fullName() {
    return `${this.module}::[${this.items.map((i) => i).join(', ')}]`
  }

  get elementType() {
    return UnionPType.fromTypes(this.items)
  }

  readonly items: PType[]
  readonly immutable = true
  constructor(props: { items: PType[] }) {
    const name = `[${props.items.map((i) => i.name).join(', ')}]`
    super({
      module: 'lib.d.ts',
      name,
      typeMessage: transientTypeErrors.arrays(name).usedAsType,
      expressionMessage: transientTypeErrors.arrays(name).usedInExpression,
      singleton: false,
    })
    this.items = props.items
  }

  getArrayType(): ArrayPType {
    const itemType = UnionPType.fromTypes(this.items)

    return new ArrayPType({
      immutable: true,
      elementType: itemType,
    })
  }

  getTupleType(): TuplePType {
    return new TuplePType({
      items: this.items,
    })
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
  constructor(props: { items: PType[] }) {
    super()
    this.items = props.items
    this.immutable = true
  }

  get wtype(): wtypes.WTuple {
    return new wtypes.WTuple({
      types: this.items.map((i) => i.wtypeOrThrow),
      immutable: this.immutable,
    })
  }
}
export class ArrayPType extends PType {
  readonly elementType: PType
  readonly immutable: boolean
  readonly singleton = false
  readonly name: string
  readonly module: string = 'lib.d.ts'
  get fullName() {
    return `${this.module}::Array<${this.elementType.fullName}>`
  }
  constructor(props: { elementType: PType; immutable?: boolean }) {
    super()
    this.name = `Array<${props.elementType.name}>`
    this.elementType = props.elementType
    this.immutable = props.immutable ?? true
  }

  get wtype() {
    return new wtypes.StackArray({
      itemType: this.elementType.wtypeOrThrow,
      immutable: this.immutable,
    })
  }
}

export class ObjectPType extends PType {
  readonly name: string = 'object'
  readonly module: string = 'lib.d.ts'
  readonly alias: SymbolName | null
  readonly description: string | undefined
  readonly properties: Record<string, PType>
  readonly singleton = false

  constructor(props: { alias?: SymbolName | null; properties: Record<string, PType>; description?: string }) {
    super()
    this.properties = props.properties
    this.description = props.description
    this.alias = props.alias ?? null
  }

  static anonymous(props: Record<string, PType> | Array<[string, PType]>) {
    const properties = Array.isArray(props) ? Object.fromEntries(props) : props
    return new ObjectPType({
      properties,
    })
  }

  get wtype(): wtypes.WTuple {
    const tupleTypes: wtypes.WType[] = []
    const tupleNames: string[] = []
    for (const [propName, propType] of this.orderedProperties()) {
      if (propType instanceof TransientType) {
        throw new CodeError(`Property '${propName}' of ${this.name} has an unsupported type: ${propType.typeMessage}`)
      }
      tupleTypes.push(propType.wtypeOrThrow)
      tupleNames.push(propName)
    }
    return new wtypes.WTuple({
      name: this.alias?.fullName ?? this.fullName,
      names: tupleNames,
      types: tupleTypes,
      immutable: true,
    })
  }

  orderedProperties() {
    return Object.entries(this.properties)
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

  toString(): string {
    return `{${this.orderedProperties()
      .map((p) => `${p[0]}:${p[1].name}`)
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
export const PromiseGeneric = new GenericPType({
  name: 'Promise',
  module: 'typescript/lib/lib.es5.d.ts',
  parameterise(ptypes: PType[]) {
    codeInvariant(ptypes.length === 1, 'Promise expects exactly 1 generic parameter')
    return new PromiseType({ resolveType: ptypes[0] })
  },
})
export class PromiseType extends UnsupportedType {
  readonly resolveType: PType
  constructor({ resolveType }: { resolveType: PType }) {
    super({
      name: 'Promise',
      module: 'typescript/lib/lib.es5.d.ts',
    })
    this.resolveType = resolveType
  }
}
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

export class NativeNumericType extends TransientType {}

export const bigIntPType = new NativeNumericType({
  name: 'bigint',
  module: 'lib.d.ts',
  singleton: false,
  typeMessage: transientTypeErrors.nativeNumeric('bigint').usedAsType,
  expressionMessage: transientTypeErrors.nativeNumeric('bigint').usedInExpression,
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
export class NumericLiteralPType extends NativeNumericType {
  readonly literalValue: bigint
  constructor({ literalValue }: { literalValue: bigint }) {
    super({
      name: `${literalValue}`,
      module: 'lib.d.ts',
      singleton: false,
      typeMessage: transientTypeErrors.nativeNumeric(literalValue.toString()).usedAsType,
      expressionMessage: transientTypeErrors.nativeNumeric(literalValue.toString()).usedInExpression,
    })
    this.literalValue = literalValue
  }
}
export class BigIntLiteralPType extends NativeNumericType {
  readonly literalValue: bigint
  constructor({ literalValue }: { literalValue: bigint }) {
    super({
      name: `${literalValue}n`,
      module: 'lib.d.ts',
      singleton: false,
      typeMessage: transientTypeErrors.nativeNumeric(`${literalValue}n`).usedAsType,
      expressionMessage: transientTypeErrors.nativeNumeric(`${literalValue}n`).usedInExpression,
    })
    this.literalValue = literalValue
  }
}
export const numberPType = new NativeNumericType({
  name: 'number',
  module: 'lib.d.ts',
  singleton: false,
  typeMessage: transientTypeErrors.nativeNumeric('number').usedAsType,
  expressionMessage: transientTypeErrors.nativeNumeric('number').usedInExpression,
})
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
  name: BoxGeneric.name,
  module: Constants.boxModuleName,
})
export const BoxMapFunction = new LibFunctionType({
  name: BoxMapGeneric.name,
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
  sourceLocation: SourceLocation.None,
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
  sourceLocation: SourceLocation.None,
})

export const arc4BareMethodDecorator = new LibFunctionType({
  module: Constants.arc4ModuleName,
  name: 'baremethod',
})
export const arc4AbiMethodDecorator = new LibFunctionType({
  module: Constants.arc4ModuleName,
  name: 'abimethod',
})

export const contractOptionsDecorator = new LibFunctionType({
  module: Constants.baseContractModuleName,
  name: 'contract',
})

export const logicSigOptionsDecorator = new LibFunctionType({
  module: Constants.logicSigModuleName,
  name: 'logicsig',
})

export class GroupTransactionPType extends PType {
  get wtype() {
    return new wtypes.WGroupTransaction({
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
  name: 'PaymentTxn',
  kind: TransactionKind.pay,
})
export const PaymentTxnFunction = new TransactionFunctionType({
  name: 'PaymentTxn',
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
export const matchFunction = new LibFunctionType({
  name: 'match',
  module: Constants.utilModuleName,
})

export class Uint64EnumMemberType extends PType {
  readonly wtype = wtypes.uint64WType
  readonly name: string
  readonly module: string
  readonly singleton = false
  readonly enumType: Uint64EnumType

  constructor(enumType: Uint64EnumType) {
    super()
    this.name = enumType.name
    this.module = enumType.module
    this.enumType = enumType
  }
}

export class Uint64EnumType extends PType {
  get memberType(): Uint64EnumMemberType {
    return new Uint64EnumMemberType(this)
  }
  readonly wtype = wtypes.uint64WType
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
    ApplicationCall: 6n,
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
export const IterableIteratorGeneric = new GenericPType({
  name: 'IterableIterator',
  module: 'typescript/lib/lib.es2015.iterable.d.ts',
  parameterise(typeArgs: PType[]): IterableIteratorType {
    codeInvariant(typeArgs.length >= 1 && typeArgs.length <= 3, 'IterableIterator type expects 1-3 type parameters')
    // Currently ignoring return and next types
    const [yieldType, _returnType, _nextType] = typeArgs
    return new IterableIteratorType({
      itemType: yieldType,
    })
  },
})
export class IterableIteratorType extends TransientType {
  readonly itemType: PType
  constructor({ itemType }: { itemType: PType }) {
    super({
      name: `IterableIterator<${itemType.name}>`,
      module: 'typescript/lib/lib.es2015.iterable.d.ts',
      typeMessage: '`IterableIterator` is not valid as a variable, parameter, return, or property type. ',
      expressionMessage: 'IterableIterator expressions can only be used in for loops',
      singleton: false,
    })
    this.itemType = itemType
  }

  get wtype(): wtypes.WEnumeration {
    return new wtypes.WEnumeration({ sequenceType: this.itemType.wtypeOrThrow })
  }
}

export const GeneratorGeneric = new GenericPType({
  name: 'Generator',
  module: 'typescript/lib/lib.es2015.generator.d.ts',
  parameterise(ptypes) {
    codeInvariant(ptypes.length === 3, 'Generator type expects exactly 3 type params')

    const [itemType, returnType, nextType] = ptypes
    return new GeneratorType({
      itemType,
      nextType,
      returnType,
    })
  },
})

export class GeneratorType extends UnsupportedType {
  readonly itemType: PType
  readonly returnType: PType
  readonly nextType: PType
  constructor({ itemType, returnType, nextType }: { itemType: PType; returnType: PType; nextType: PType }) {
    super({
      name: 'Generator',
      module: 'typescript/lib/lib.es2015.generator.d.ts',
    })
    this.itemType = itemType
    this.returnType = returnType
    this.nextType = nextType
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
    return new wtypes.WInnerTransaction({
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
    return new wtypes.WInnerTransactionFields({
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

export const TemplateVarFunction = new LibFunctionType({
  name: 'TemplateVar',
  module: Constants.templateVarModuleName,
})

export const compileFunctionType = new LibFunctionType({
  name: 'compile',
  module: Constants.compiledModuleName,
})

export const compiledContractType = new ObjectPType({
  alias: new SymbolName({
    name: 'CompiledContract',
    module: Constants.compiledModuleName,
  }),
  description: 'Provides compiled programs and state allocation values for a Contract. Created by calling `compile(ExampleContractType)`',
  properties: {
    approvalProgram: new TuplePType({ items: [bytesPType, bytesPType] }),
    clearStateProgram: new TuplePType({ items: [bytesPType, bytesPType] }),
    extraProgramPages: uint64PType,
    globalUints: uint64PType,
    globalBytes: uint64PType,
    localUints: uint64PType,
    localBytes: uint64PType,
  },
})
export const compiledLogicSigType = new ObjectPType({
  alias: new SymbolName({
    name: 'CompiledLogicSig',
    module: Constants.compiledModuleName,
  }),
  description: 'Provides account for a Logic Signature. Created by calling `compile(LogicSigType)``',
  properties: {
    account: accountPType,
  },
})

export const arc28EmitFunction = new LibFunctionType({
  name: 'emit',
  module: Constants.arc28ModuleName,
})

export const SuperPrototypeSelectorGeneric = new GenericPType({
  name: 'SuperPrototypeSelector',
  module: Constants.polytypeModuleName,
  parameterise(ptypes: PType[]) {
    return new SuperPrototypeSelector({ bases: ptypes })
  },
})
export class SuperPrototypeSelector extends InternalType {
  constructor({ bases }: { bases: PType[] }) {
    super({
      name: 'SuperPrototypeSelector',
      module: Constants.polytypeModuleName,
    })
  }
}
export const ClusteredPrototype = new InternalType({
  name: 'ClusteredPrototype',
  module: Constants.polytypeModuleName,
})
export const PolytypeClassMethodHelper = new LibFunctionType({
  name: 'class',
  module: Constants.polytypeModuleName,
})

export const MutableArrayConstructor = new LibClassType({
  name: 'MutableArray',
  module: Constants.mutableArrayModuleName,
})
export const MutableArrayGeneric = new GenericPType({
  name: 'MutableArray',
  module: Constants.mutableArrayModuleName,
  parameterise: (typeArgs: PType[]): MutableArrayType => {
    codeInvariant(typeArgs.length === 1, 'MutableArray type expects exactly one type parameter')
    const [elementType] = typeArgs

    return new MutableArrayType({ elementType: elementType })
  },
})
export class MutableArrayType extends PType {
  readonly module = Constants.mutableArrayModuleName
  readonly immutable = false as const
  readonly name: string
  readonly singleton = false
  readonly sourceLocation: SourceLocation | undefined
  readonly elementType: PType

  constructor({
    elementType,
    sourceLocation,
    name,
  }: {
    elementType: PType
    sourceLocation?: SourceLocation
    name?: string
    immutable?: boolean
  }) {
    super()
    this.name = name ?? `MutableArray<${elementType}>`
    this.sourceLocation = sourceLocation
    this.elementType = elementType
  }

  get wtype() {
    return new wtypes.ReferenceArray({
      itemType: this.elementType.wtypeOrThrow,
      sourceLocation: this.sourceLocation,
      immutable: false,
    })
  }
}
