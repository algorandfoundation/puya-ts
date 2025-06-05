import { TransactionKind } from '../../awst/models'
import { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'

import { Constants } from '../../constants'
import { CodeError, InternalError, NotSupported, throwError } from '../../errors'
import { codeInvariant, distinctByEquality, instanceOfAny, invariant, sortBy } from '../../util'
import { SymbolName } from '../symbol-name'
import type { ABIType } from './base'
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
  readonly [PType.IdSymbol] = 'UnsupportedType'
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

export class ObjectWithOptionalFieldsType extends TransientType {
  readonly [PType.IdSymbol] = 'ObjectWithOptionalFieldsType'
  constructor({ name, module }: { name: string; module: string }) {
    const errors = transientTypeErrors.optionalFields(name)
    super({
      name,
      module,
      singleton: false,
      expressionMessage: errors.usedInExpression,
      typeMessage: errors.usedAsType,
    })
  }
}

export class LogicSigPType extends PType {
  readonly [PType.IdSymbol] = 'LogicSigPType'
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
  module: Constants.moduleNames.algoTs.logicSig,
  sourceLocation: SourceLocation.None,
})

export class ContractClassPType extends PType {
  readonly [PType.IdSymbol] = 'ContractClassPType'
  readonly wtype = undefined
  readonly name: string
  readonly module: string
  readonly properties: Record<string, AppStorageType>
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
      module: Constants.moduleNames.polytype,
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
  readonly [PType.IdSymbol] = 'IntersectionPType'
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
  readonly [PType.IdSymbol] = 'UnionPType'
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
      if (instanceOfAny(transientType, BigIntLiteralPType, NumericLiteralPType, BigIntPType, NumberPType)) {
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

abstract class StorageProxyPType extends PType {
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
  module: Constants.moduleNames.algoTs.state,
  parameterise(typeArgs: readonly PType[]): GlobalStateType {
    codeInvariant(typeArgs.length === 1, 'GlobalState type expects exactly one type parameter')
    return new GlobalStateType({
      content: typeArgs[0],
    })
  },
})
export class GlobalStateType extends StorageProxyPType {
  readonly [PType.IdSymbol] = 'GlobalStateType'
  static readonly baseName = 'GlobalState'
  static readonly baseFullName = `${Constants.moduleNames.algoTs.state}::${GlobalStateType.baseName}`
  readonly module: string = Constants.moduleNames.algoTs.state
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
  module: Constants.moduleNames.algoTs.state,
  parameterise(typeArgs: readonly PType[]): LocalStateType {
    codeInvariant(typeArgs.length === 1, 'LocalState type expects exactly one type parameter')
    return new LocalStateType({
      content: typeArgs[0],
    })
  },
})
export class LocalStateType extends StorageProxyPType {
  readonly [PType.IdSymbol] = 'LocalStateType'
  static readonly baseName = 'LocalState'
  static readonly baseFullName = `${Constants.moduleNames.algoTs.state}::${LocalStateType.baseName}`
  readonly module: string = Constants.moduleNames.algoTs.state
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
  module: Constants.moduleNames.algoTs.box,
  parameterise(typeArgs: readonly PType[]): BoxPType {
    codeInvariant(typeArgs.length === 1, `${this.name} type expects exactly one type parameter`)
    return new BoxPType({
      content: typeArgs[0],
    })
  },
})
export class BoxPType extends StorageProxyPType {
  readonly [PType.IdSymbol] = 'BoxPType'
  readonly module: string = Constants.moduleNames.algoTs.box
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
  module: Constants.moduleNames.algoTs.box,
  parameterise(typeArgs: readonly PType[]): BoxMapPType {
    codeInvariant(typeArgs.length === 2, `${this.name} type expects exactly two type parameters`)
    return new BoxMapPType({
      keyType: typeArgs[0],
      content: typeArgs[1],
    })
  },
})
export class BoxMapPType extends StorageProxyPType {
  readonly [PType.IdSymbol] = 'BoxMapPType'
  readonly module: string = Constants.moduleNames.algoTs.box
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
  readonly [PType.IdSymbol] = 'BoxRefPType'
  readonly module = Constants.moduleNames.algoTs.box
  get name() {
    return 'BoxRef'
  }
  constructor() {
    super({ keyWType: wtypes.boxKeyWType, content: bytesPType })
  }
}
export type AppStorageType = GlobalStateType | LocalStateType | BoxPType | BoxRefPType | BoxMapPType

/**
 * An open generic type parameter
 */
export class TypeParameterType extends PType {
  readonly [PType.IdSymbol] = 'TypeParameterType'
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
  readonly [PType.IdSymbol] = 'InternalType'
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
  readonly [PType.IdSymbol] = 'AnyPType'
  get wtype(): never {
    throw new CodeError('`any` is not valid as a variable, parameter, return, or property type.')
  }
  readonly name = 'any'
  readonly module = 'lib.d.ts'
  readonly singleton = false
}

export class InstanceType extends PType {
  readonly [PType.IdSymbol] = 'InstanceType'
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

export class ABICompatibleInstanceType extends InstanceType implements ABIType {
  readonly abiTypeSignature: string
  constructor({ abiTypeSignature, ...props }: { name: string; module: string; wtype: wtypes.WType; abiTypeSignature: string }) {
    super(props)
    this.abiTypeSignature = abiTypeSignature
  }
}

export class LibFunctionType extends PType {
  readonly [PType.IdSymbol] = 'LibFunctionType'
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
  readonly [PType.IdSymbol] = 'LibClassType'
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
export class LibObjType extends PType {
  readonly [PType.IdSymbol] = 'LibObjType'
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
  readonly [PType.IdSymbol] = 'IntrinsicFunctionGroupType'
  readonly wtype: undefined
  readonly name: string
  readonly module: string = Constants.moduleNames.algoTs.op
  readonly singleton = true

  constructor({ name }: { name: string }) {
    super()
    this.name = name
  }
}
export class IntrinsicFunctionGroupTypeType extends PType {
  readonly [PType.IdSymbol] = 'IntrinsicFunctionGroupTypeType'
  readonly wtype: undefined
  readonly name: string
  readonly module: string = Constants.moduleNames.algoTs.op
  readonly singleton = false

  constructor({ name }: { name: string }) {
    super()
    this.name = name
  }
}
export class IntrinsicFunctionType extends PType {
  readonly [PType.IdSymbol] = 'IntrinsicFunctionType'
  readonly wtype: undefined
  readonly name: string
  readonly module: string = Constants.moduleNames.algoTs.op
  readonly singleton = true

  constructor({ name }: { name: string }) {
    super()
    this.name = name
  }
}
export class IntrinsicFunctionTypeType extends PType {
  readonly [PType.IdSymbol] = 'IntrinsicFunctionTypeType'
  readonly wtype: undefined
  readonly name: string
  readonly module: string = Constants.moduleNames.algoTs.op
  readonly singleton = false

  constructor({ name }: { name: string }) {
    super()
    this.name = name
  }
}

export class NamespacePType extends PType {
  readonly [PType.IdSymbol] = 'NamespacePType'
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
  readonly [PType.IdSymbol] = 'FunctionPType'
  readonly wtype: undefined
  readonly name: string
  readonly module: string
  readonly returnType: PType
  readonly parameters: Array<readonly [string, PType]>
  readonly singleton = true
  readonly sourceLocation: SourceLocation | undefined

  constructor(props: {
    name: string
    module: string
    returnType: PType
    parameters: Array<readonly [string, PType]>
    sourceLocation: SourceLocation | undefined
  }) {
    super()
    this.name = props.name
    this.module = props.module
    this.sourceLocation = props.sourceLocation
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
export class ArrayLiteralPType extends PType {
  readonly [PType.IdSymbol] = 'ArrayLiteralPType'
  get fullName() {
    return `${this.module}::[${this.items.map((i) => i).join(', ')}]`
  }

  get elementType() {
    return this.items.length ? UnionPType.fromTypes(this.items) : neverPType
  }

  readonly singleton = false
  readonly name: string
  readonly module = Constants.moduleNames.typescript.array
  readonly items: PType[]
  readonly immutable = true
  constructor(props: { items: PType[] }) {
    super()
    this.name = `[${props.items.map((i) => i.name).join(', ')}]`

    this.items = props.items
  }

  get wtype() {
    return this.getArrayType().wtype
  }

  getArrayType(): ArrayPType {
    return new ArrayPType({
      elementType: this.elementType,
    })
  }

  getTupleType(): TuplePType {
    return new TuplePType({
      items: this.items,
    })
  }
}

export class TuplePType extends PType {
  readonly [PType.IdSymbol] = 'TuplePType'
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

  getIndexType(index: bigint | string, sourceLocation: SourceLocation): PType {
    if (typeof index === 'bigint') {
      if (index >= 0 && index < this.items.length) {
        return this.items[Number(index)]
      }
      throw new CodeError(`Cannot access index ${index} of ${this.name}`, { sourceLocation })
    }
    return super.getIndexType(index, sourceLocation)
  }
}
export class ArrayPType extends PType {
  readonly [PType.IdSymbol] = 'ArrayPType'
  readonly elementType: PType
  readonly immutable = true
  readonly singleton = false
  readonly name: string
  readonly module: string = 'lib.d.ts'
  get fullName() {
    return `${this.module}::Array<${this.elementType.fullName}>`
  }
  constructor(props: { elementType: PType }) {
    super()
    this.name = `Array<${props.elementType.name}>`
    this.elementType = props.elementType
  }

  get wtype() {
    return new wtypes.ARC4DynamicArray({
      elementType: this.elementType.wtypeOrThrow,
      immutable: this.immutable,
    })
  }
}

export class ObjectPType extends PType {
  readonly [PType.IdSymbol] = 'ObjectPType'
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
    if (!this.hasProperty(name)) {
      return false
    }
    const thisPropertyType = this.properties[name]
    return ('nativeType' in thisPropertyType ? (thisPropertyType.nativeType as PType) : thisPropertyType).equals(
      'nativeType' in type ? (type.nativeType as PType) : type,
    )
  }

  toString(): string {
    return `{${this.orderedProperties()
      .map((p) => `${p[0]}:${p[1].name}`)
      .join(',')}}`
  }
}

export const voidPType = new ABICompatibleInstanceType({
  name: 'void',
  module: 'lib.d.ts',
  wtype: wtypes.voidWType,
  abiTypeSignature: 'void',
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

export const esSymbol = new UnsupportedType({
  name: 'symbol',
  module: 'lib.d.ts',
  fullName: 'symbol',
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
  parameterise(ptypes: readonly PType[]) {
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

export class BigIntPType extends TransientType {
  readonly [PType.IdSymbol] = 'BigIntPType'
}

export class NumberPType extends TransientType {
  readonly [PType.IdSymbol] = 'NumberPType'
}

export const bigIntPType = new BigIntPType({
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
  module: Constants.moduleNames.algoTs.primitives,
  wtype: wtypes.uint64WType,
})
export const biguintPType = new InstanceType({
  name: 'biguint',
  module: Constants.moduleNames.algoTs.primitives,
  wtype: wtypes.biguintWType,
})
export class NumericLiteralPType extends TransientType {
  readonly [PType.IdSymbol] = 'NumericLiteralPType'
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

  static typeDescription = 'numeric literal'
}
export class BigIntLiteralPType extends TransientType {
  readonly [PType.IdSymbol] = 'BigIntLiteralPType'
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

  static typeDescription = 'bigint literal'
}
export const numberPType = new NumberPType({
  name: 'number',
  module: 'lib.d.ts',
  singleton: false,
  typeMessage: transientTypeErrors.nativeNumeric('number').usedAsType,
  expressionMessage: transientTypeErrors.nativeNumeric('number').usedInExpression,
})
export const Uint64Function = new LibFunctionType({
  name: 'Uint64',
  module: Constants.moduleNames.algoTs.primitives,
})

export const BigUintFunction = new LibFunctionType({
  name: 'BigUint',
  module: Constants.moduleNames.algoTs.primitives,
})
export class BytesPType extends PType {
  readonly [PType.IdSymbol] = 'BytesPType'
  readonly wtype: wtypes.WType
  readonly name: string
  readonly module: string
  readonly singleton = false
  readonly length: bigint | null

  constructor({ length }: { length: bigint | null }) {
    super()
    this.length = length
    this.name = length === null ? 'bytes' : `bytes<${length}>`
    this.wtype = new wtypes.BytesWType({ length })
    this.module = Constants.moduleNames.algoTs.primitives
  }
}
export const BytesGeneric = new GenericPType({
  name: 'bytes',
  module: Constants.moduleNames.algoTs.primitives,
  parameterise(typeArgs: readonly PType[]): BytesPType {
    codeInvariant(typeArgs.length === 1, `${this.name} type expects exactly one type parameter`)
    const bytesSize = typeArgs[0]
    if (bytesSize.equals(uint64PType)) {
      return new BytesPType({
        length: null,
      })
    }
    codeInvariant(
      bytesSize instanceof NumericLiteralPType,
      `Bytes size generic type param for bytes type must be a literal number. Inferred type is ${bytesSize.name}`,
    )
    return new BytesPType({
      length: bytesSize.literalValue,
    })
  },
})
export const bytesPType = new BytesPType({ length: null })
export const BytesFunction = new LibFunctionType({
  name: 'Bytes',
  module: Constants.moduleNames.algoTs.primitives,
})

export const logFunction = new LibFunctionType({
  name: 'log',
  module: Constants.moduleNames.algoTs.util,
})
export const assertFunction = new LibFunctionType({
  name: 'assert',
  module: Constants.moduleNames.algoTs.util,
})

export const errFunction = new LibFunctionType({
  name: 'err',
  module: Constants.moduleNames.algoTs.util,
})

export const assetPType = new ABICompatibleInstanceType({
  name: 'Asset',
  wtype: wtypes.assetWType,
  module: Constants.moduleNames.algoTs.reference,
  abiTypeSignature: 'asset',
})
export const AssetFunction = new LibFunctionType({
  name: 'Asset',
  module: Constants.moduleNames.algoTs.reference,
})
export const accountPType = new ABICompatibleInstanceType({
  name: 'Account',
  wtype: wtypes.accountWType,
  module: Constants.moduleNames.algoTs.reference,
  abiTypeSignature: 'account',
})
export const AccountFunction = new LibFunctionType({
  name: 'Account',
  module: Constants.moduleNames.algoTs.reference,
})
export const applicationPType = new ABICompatibleInstanceType({
  name: 'Application',
  wtype: wtypes.applicationWType,
  module: Constants.moduleNames.algoTs.reference,
  abiTypeSignature: 'application',
})
export const ApplicationFunctionType = new LibFunctionType({
  name: 'Application',
  module: Constants.moduleNames.algoTs.reference,
})
export const BoxRefFunction = new LibFunctionType({
  name: 'BoxRef',
  module: Constants.moduleNames.algoTs.box,
})
export const boxRefType = new BoxRefPType()

export const ClearStateProgram = new FunctionPType({
  name: Constants.symbolNames.clearStateProgramMethodName,
  module: Constants.moduleNames.algoTs.baseContract,
  returnType: uint64PType,
  parameters: [],
  sourceLocation: undefined,
})

export const ApprovalProgram = new FunctionPType({
  name: Constants.symbolNames.approvalProgramMethodName,
  module: Constants.moduleNames.algoTs.arc4.index,
  returnType: boolPType,
  parameters: [],
  sourceLocation: undefined,
})

export const baseContractType = new BaseContractClassType({
  module: Constants.moduleNames.algoTs.baseContract,
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
  module: Constants.moduleNames.algoTs.arc4.index,
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
  module: Constants.moduleNames.algoTs.arc4.index,
  name: 'baremethod',
})
export const arc4AbiMethodDecorator = new LibFunctionType({
  module: Constants.moduleNames.algoTs.arc4.index,
  name: 'abimethod',
})

export const contractOptionsDecorator = new LibFunctionType({
  module: Constants.moduleNames.algoTs.baseContract,
  name: 'contract',
})

export const logicSigOptionsDecorator = new LibFunctionType({
  module: Constants.moduleNames.algoTs.logicSig,
  name: 'logicsig',
})

export class GroupTransactionPType extends PType implements ABIType {
  readonly [PType.IdSymbol] = 'GroupTransactionPType'
  get wtype() {
    return new wtypes.WGroupTransaction({
      transactionType: this.kind,
    })
  }
  readonly name: string
  readonly kind: TransactionKind | undefined
  readonly module = Constants.moduleNames.algoTs.gtxn
  readonly singleton = false
  readonly abiTypeSignature: string

  constructor({ kind, name }: { kind?: TransactionKind; name: string }) {
    super()
    this.name = name
    this.kind = kind
    this.abiTypeSignature = kind ? TransactionKind[kind] : 'txn'
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
  module: Constants.moduleNames.algoTs.gtxn,
  kind: TransactionKind.pay,
})
export const keyRegistrationGtxnType = new GroupTransactionPType({
  name: 'KeyRegistrationTxn',
  kind: TransactionKind.keyreg,
})
export const KeyRegistrationTxnFunction = new TransactionFunctionType({
  name: 'KeyRegistrationTxn',
  module: Constants.moduleNames.algoTs.gtxn,
  kind: TransactionKind.keyreg,
})
export const assetConfigGtxnType = new GroupTransactionPType({
  name: 'AssetConfigTxn',
  kind: TransactionKind.acfg,
})
export const AssetConfigTxnFunction = new TransactionFunctionType({
  name: 'AssetConfigTxn',
  module: Constants.moduleNames.algoTs.gtxn,
  kind: TransactionKind.acfg,
})
export const assetTransferGtxnType = new GroupTransactionPType({
  name: 'AssetTransferTxn',
  kind: TransactionKind.axfer,
})
export const AssetTransferTxnFunction = new TransactionFunctionType({
  name: 'AssetTransferTxn',
  module: Constants.moduleNames.algoTs.gtxn,
  kind: TransactionKind.axfer,
})
export const assetFreezeGtxnType = new GroupTransactionPType({
  name: 'AssetFreezeTxn',
  kind: TransactionKind.afrz,
})
export const AssetFreezeTxnFunction = new TransactionFunctionType({
  name: 'AssetFreezeTxn',
  module: Constants.moduleNames.algoTs.gtxn,
  kind: TransactionKind.afrz,
})
export const applicationCallGtxnType = new GroupTransactionPType({
  name: 'ApplicationCallTxn',
  kind: TransactionKind.appl,
})
export const ApplicationTxnFunction = new TransactionFunctionType({
  name: 'ApplicationCallTxn',
  module: Constants.moduleNames.algoTs.gtxn,
  kind: TransactionKind.appl,
})
export const gtxnUnion = UnionPType.fromTypes([
  paymentGtxnType,
  keyRegistrationGtxnType,
  assetConfigGtxnType,
  assetTransferGtxnType,
  assetFreezeGtxnType,
  applicationCallGtxnType,
])
export const anyGtxnType = new GroupTransactionPType({
  name: 'Transaction',
  kind: undefined,
})
export const TransactionFunction = new TransactionFunctionType({
  name: 'Transaction',
  module: Constants.moduleNames.algoTs.gtxn,
  kind: undefined,
})

export const assertMatchFunction = new LibFunctionType({
  name: 'assertMatch',
  module: Constants.moduleNames.algoTs.util,
})
export const matchFunction = new LibFunctionType({
  name: 'match',
  module: Constants.moduleNames.algoTs.util,
})

export class Uint64EnumMemberType extends PType {
  readonly [PType.IdSymbol] = 'Uint64EnumMemberType'
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

export class Uint64EnumMemberLiteralType extends Uint64EnumMemberType {
  readonly wtype = wtypes.uint64WType
  readonly member: string
  readonly value: bigint

  constructor(enumType: Uint64EnumType, member: string | bigint) {
    super(enumType)
    if (typeof member === 'bigint') {
      ;[this.member, this.value] =
        Object.entries(enumType.members).find(([n, v]) => v === member) ??
        throwError(new InternalError(`${member} is not a valid member for ${enumType.name}`))
    } else {
      invariant(member in enumType.members, `${member} is not a valid member for ${enumType.name}`)
      this.member = member
      this.value = enumType.members[member]
    }
  }
}

export class Uint64EnumType extends PType {
  readonly [PType.IdSymbol] = 'Uint64EnumType'
  readonly memberType: Uint64EnumMemberType
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
    this.memberType = new Uint64EnumMemberType(this)
  }

  getMemberLiteral(member: string | bigint) {
    return new Uint64EnumMemberLiteralType(this, member)
  }

  hasMember(member: string | bigint) {
    return Object.entries(this.members).some((m) => m[0] === member || m[1] === member)
  }
}

export const transactionTypeType = new Uint64EnumType({
  module: Constants.moduleNames.algoTs.transactions,
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
  module: Constants.moduleNames.algoTs.onCompleteAction,
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
  module: Constants.moduleNames.algoTs.util,
})
export const opUpFeeSourceType = new Uint64EnumType({
  module: Constants.moduleNames.algoTs.util,
  name: 'OpUpFeeSource',
  members: {
    GroupCredit: 0n,
    AppAccount: 1n,
    Any: 2n,
  },
})

export const urangeFunction = new LibFunctionType({
  name: 'urange',
  module: Constants.moduleNames.algoTs.util,
})
export const IterableIteratorGeneric = new GenericPType({
  name: 'IterableIterator',
  module: 'typescript/lib/lib.es2015.iterable.d.ts',
  parameterise(typeArgs: readonly PType[]): IterableIteratorType {
    codeInvariant(typeArgs.length >= 1 && typeArgs.length <= 3, 'IterableIterator type expects 1-3 type parameters')
    // Currently ignoring return and next types
    const [yieldType, _returnType, _nextType] = typeArgs
    return new IterableIteratorType({
      itemType: yieldType,
    })
  },
})
export class IterableIteratorType extends TransientType {
  readonly [PType.IdSymbol] = 'IterableIteratorType'
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
  module: Constants.moduleNames.algoTs.itxn,
  kind: TransactionKind.pay,
})
export const keyRegistrationItxnFn = new TransactionFunctionType({
  name: 'keyRegistration',
  module: Constants.moduleNames.algoTs.itxn,
  kind: TransactionKind.keyreg,
})
export const assetConfigItxnFn = new TransactionFunctionType({
  name: 'assetConfig',
  module: Constants.moduleNames.algoTs.itxn,
  kind: TransactionKind.acfg,
})
export const assetTransferItxnFn = new TransactionFunctionType({
  name: 'assetTransfer',
  module: Constants.moduleNames.algoTs.itxn,
  kind: TransactionKind.axfer,
})
export const assetFreezeItxnFn = new TransactionFunctionType({
  name: 'assetFreeze',
  module: Constants.moduleNames.algoTs.itxn,
  kind: TransactionKind.afrz,
})
export const applicationCallItxnFn = new TransactionFunctionType({
  name: 'applicationCall',
  module: Constants.moduleNames.algoTs.itxn,
  kind: TransactionKind.appl,
})

export class InnerTransactionPType extends PType {
  readonly [PType.IdSymbol] = 'InnerTransactionPType'
  get wtype() {
    return new wtypes.WInnerTransaction({
      transactionType: this.kind,
    })
  }
  readonly name: string
  readonly kind: TransactionKind | undefined
  readonly module = Constants.moduleNames.algoTs.itxn
  readonly singleton = false

  constructor({ kind, name }: { kind?: TransactionKind; name: string }) {
    super()
    this.name = name
    this.kind = kind
  }
}
export class ItxnParamsPType extends PType {
  readonly [PType.IdSymbol] = 'ItxnParamsPType'
  get wtype() {
    return new wtypes.WInnerTransactionFields({
      transactionType: this.kind,
    })
  }
  readonly name: string
  readonly kind: TransactionKind | undefined
  readonly module = Constants.moduleNames.algoTs.itxn
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
  name: 'ApplicationCallInnerTxn',
  kind: TransactionKind.appl,
})
export const anyItxnParamsType = new ItxnParamsPType({
  name: 'AnyItxnParams',
})

export const anyItxnType = new InnerTransactionPType({
  name: 'InnerTxn',
})

export const inputOnlyObjects = ['Payment', 'KeyRegistration', 'AssetConfig', 'AssetTransfer', 'AssetFreeze', 'ApplicationCall'].flatMap(
  (txnKind) => [
    new ObjectWithOptionalFieldsType({
      name: `${txnKind}Fields`,
      module: Constants.moduleNames.algoTs.itxn,
    }),
    new ObjectWithOptionalFieldsType({
      name: `${txnKind}ComposeFields`,
      module: Constants.moduleNames.algoTs.itxnCompose,
    }),
  ],
)

export const submitGroupItxnFunction = new LibFunctionType({
  name: 'submitGroup',
  module: Constants.moduleNames.algoTs.itxn,
})

export const TemplateVarFunction = new LibFunctionType({
  name: 'TemplateVar',
  module: Constants.moduleNames.algoTs.templateVar,
})

export const compileFunctionType = new LibFunctionType({
  name: 'compile',
  module: Constants.moduleNames.algoTs.compiled,
})

export const compiledContractType = new ObjectPType({
  alias: new SymbolName({
    name: 'CompiledContract',
    module: Constants.moduleNames.algoTs.compiled,
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
    module: Constants.moduleNames.algoTs.compiled,
  }),
  description: 'Provides account for a Logic Signature. Created by calling `compile(LogicSigType)``',
  properties: {
    account: accountPType,
  },
})

export const arc28EmitFunction = new LibFunctionType({
  name: 'emit',
  module: Constants.moduleNames.algoTs.arc28,
})

export const SuperPrototypeSelectorGeneric = new GenericPType({
  name: 'SuperPrototypeSelector',
  module: Constants.moduleNames.polytype,
  parameterise(ptypes: readonly PType[]) {
    return new SuperPrototypeSelector({ bases: ptypes })
  },
})
export class SuperPrototypeSelector extends InternalType {
  readonly bases: readonly PType[]
  constructor({ bases }: { bases: readonly PType[] }) {
    super({
      name: 'SuperPrototypeSelector',
      module: Constants.moduleNames.polytype,
    })
    this.bases = bases
  }
}
export const ClusteredPrototype = new InternalType({
  name: 'ClusteredPrototype',
  module: Constants.moduleNames.polytype,
})
export const PolytypeClassMethodHelper = new LibFunctionType({
  name: 'class',
  module: Constants.moduleNames.polytype,
})

export const MutableArrayConstructor = new LibClassType({
  name: 'MutableArray',
  module: Constants.moduleNames.algoTs.mutableArray,
})
export const MutableArrayGeneric = new GenericPType({
  name: 'MutableArray',
  module: Constants.moduleNames.algoTs.mutableArray,
  parameterise: (typeArgs: readonly PType[]): MutableArrayType => {
    codeInvariant(typeArgs.length === 1, 'MutableArray type expects exactly one type parameter')
    const [elementType] = typeArgs

    return new MutableArrayType({ elementType: elementType })
  },
})
export class MutableArrayType extends PType {
  readonly [PType.IdSymbol] = 'MutableArrayType'
  readonly module = Constants.moduleNames.algoTs.mutableArray
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

export const itxnComposePType = new LibObjType({
  module: Constants.moduleNames.algoTs.itxnCompose,
  name: 'itxnCompose',
})

export const cloneFunctionPType = new LibFunctionType({
  name: 'clone',
  module: Constants.moduleNames.algoTs.util,
})
