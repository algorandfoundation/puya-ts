import { awst, wtypes } from '../awst'
import { SourceLocation } from '../awst/source-location'
import { BoolExpressionBuilder } from './eb/bool-expression-builder'
import { UInt64ExpressionBuilder, UInt64FunctionBuilder } from './eb/uint64-expression-builder'
import { BytesExpressionBuilder, BytesFunctionBuilder } from './eb/bytes-expression-builder'
import { OpModuleExpressionBuilder } from './eb/op-module-expression-builder'
import { LogFunctionBuilder } from './eb/log-function-builder'
import { InternalError, throwError } from '../errors'
import { codeInvariant } from '../util'
import { DeliberateAny } from '../typescript-helpers'
import { FreeSubroutineExpressionBuilder } from './eb/free-subroutine-expression-builder'
import { StrExpressionBuilder, StrFunctionBuilder } from './eb/str-expression-builder'
import { InstanceBuilder, InstanceExpressionBuilder, NodeBuilder } from './eb'
import { AssertFunctionBuilder } from './eb/assert-function-builder'

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

class SimpleType extends PType {
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
class LiteralValueType extends PType {
  readonly wtype: undefined = undefined
  readonly name: string
  readonly module: string

  constructor({ name, module }: { name: string; module: string }) {
    super()
    this.name = name
    this.module = module
  }
}
class LibFunctionType extends PType {
  readonly wtype: undefined
  readonly name: string
  readonly module: string

  constructor({ name, module }: { name: string; module: string }) {
    super()
    this.name = name
    this.module = module
  }
}

class NamespaceType extends PType {
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

type ValueExpressionBuilderCtor = { new (expr: awst.Expression, ptype: PType): InstanceExpressionBuilder }
type SingletonExpressionBuilderCtor = { new (sourceLocation: SourceLocation, ptype: PType): NodeBuilder }

type PTypeClass = { new (...args: DeliberateAny): PType }
class TypeRegistry {
  private readonly singletonEbs: Map<PType | PTypeClass, SingletonExpressionBuilderCtor> = new Map()
  private readonly instanceEbs: Map<PType | PTypeClass, ValueExpressionBuilderCtor> = new Map()
  private readonly types: Set<PType | PTypeClass> = new Set()

  register({
    ptype,
    symbolEb,
    instanceEb,
  }: {
    ptype: PType | PTypeClass
    symbolEb?: SingletonExpressionBuilderCtor
    instanceEb?: ValueExpressionBuilderCtor
  }) {
    if (this.types.has(ptype)) throw new InternalError(`${ptype} has already been registered`)
    this.types.add(ptype)
    if (symbolEb) this.singletonEbs.set(ptype, symbolEb)
    if (instanceEb) {
      this.instanceEbs.set(ptype, instanceEb)
    }
  }

  tryResolvePType(fullName: string): PType | undefined {
    for (const v of this.types) {
      if (v instanceof PType && v.fullName === fullName) return v
    }
    return undefined
  }

  resolvePType(fullName: string, sourceLocation: SourceLocation): PType {
    const ptype = this.tryResolvePType(fullName)
    if (!ptype) {
      throw new InternalError(`Cannot resolve ptype for ${fullName}`, {
        sourceLocation,
      })
    }
    return ptype
  }

  tryGetSingletonEb(ptype: PType, sourceLocation: SourceLocation): NodeBuilder | undefined {
    const eb = this.singletonEbs.get(ptype)
    if (eb) {
      return new eb(sourceLocation, ptype)
    }
    for (const [pt, eb] of this.singletonEbs.entries()) {
      if (typeof pt === 'function' && ptype instanceof pt) {
        return new eb(sourceLocation, ptype)
      }
    }

    return undefined
  }

  getInstanceEb(expression: awst.Expression, ptype: PType): InstanceBuilder {
    return (
      this.tryGetInstanceEb(expression, ptype) ??
      throwError(
        new InternalError(`No InstanceBuilder registered for ${expression.wtype}`, {
          sourceLocation: expression.sourceLocation,
        }),
      )
    )
  }
  tryGetInstanceEb(expression: awst.Expression, ptype: PType): InstanceBuilder | undefined {
    const eb = this.instanceEbs.get(ptype)
    if (eb) {
      return new eb(expression, ptype)
    }
    for (const [pt, eb] of this.instanceEbs.entries()) {
      if (typeof pt === 'function' && ptype instanceof pt) {
        return new eb(expression, ptype)
      }
    }
    return undefined
  }
}
export const typeRegistry = new TypeRegistry()

export const voidPType = new SimpleType({
  name: 'void',
  module: 'lib.d.ts',
  wtype: wtypes.voidWType,
})

export const boolPType = new SimpleType({
  name: 'boolean',
  module: 'lib.d.ts',
  wtype: wtypes.boolWType,
})
typeRegistry.register({ ptype: boolPType, instanceEb: BoolExpressionBuilder })

export const BooleanFunction = new LibFunctionType({
  name: 'Boolean',
  module: 'lib.d.ts',
})

export const bigintLiteralPType = new LiteralValueType({
  name: 'bigint',
  module: 'lib.d.ts',
})

export const stringLiteralPType = new LiteralValueType({
  name: 'string',
  module: 'lib.d.ts',
})

export const uint64PType = new SimpleType({
  name: 'uint64',
  module: '@algorandfoundation/algo-ts/primitives.d.ts',
  wtype: wtypes.uint64WType,
})
typeRegistry.register({ ptype: uint64PType, instanceEb: UInt64ExpressionBuilder })
export const Uint64Function = new LibFunctionType({
  name: 'Uint64',
  module: '@algorandfoundation/algo-ts/primitives.d.ts',
})
typeRegistry.register({ ptype: Uint64Function, symbolEb: UInt64FunctionBuilder })

export const biguintPType = new SimpleType({
  name: 'biguint',
  module: '@algorandfoundation/algo-ts/primitives.d.ts',
  wtype: wtypes.biguintWType,
})

export const BigUintFunction = new LibFunctionType({
  name: 'BigUint',
  module: '@algorandfoundation/algo-ts/primitives.d.ts',
})
export const bytesPType = new SimpleType({
  name: 'bytes',
  module: '@algorandfoundation/algo-ts/primitives.d.ts',
  wtype: wtypes.bytesWType,
})
typeRegistry.register({ ptype: bytesPType, instanceEb: BytesExpressionBuilder })
export const BytesFunction = new LibFunctionType({
  name: 'Bytes',
  module: '@algorandfoundation/algo-ts/primitives.d.ts',
})
typeRegistry.register({ ptype: BytesFunction, symbolEb: BytesFunctionBuilder })

export const strPType = new SimpleType({
  name: 'str',
  module: '@algorandfoundation/algo-ts/primitives.d.ts',
  wtype: wtypes.stringWType,
})
typeRegistry.register({ ptype: strPType, instanceEb: StrExpressionBuilder })
export const StrFunction = new LibFunctionType({
  name: 'Str',
  module: '@algorandfoundation/algo-ts/primitives.d.ts',
})
typeRegistry.register({ ptype: StrFunction, symbolEb: StrFunctionBuilder })
export const opNamespace = new NamespaceType({
  name: 'op',
  module: '@algorandfoundation/algo-ts/op.d.ts',
})
typeRegistry.register({ ptype: opNamespace, symbolEb: OpModuleExpressionBuilder })
export const logFunction = new LibFunctionType({
  name: 'log',
  module: '@algorandfoundation/algo-ts/util.d.ts',
})
typeRegistry.register({ ptype: logFunction, symbolEb: LogFunctionBuilder })
export const assertFunction = new LibFunctionType({
  name: 'assert',
  module: '@algorandfoundation/algo-ts/util.d.ts',
})
typeRegistry.register({ ptype: assertFunction, symbolEb: AssertFunctionBuilder })

export class FreeSubroutineType extends PType {
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
typeRegistry.register({ ptype: FreeSubroutineType, symbolEb: FreeSubroutineExpressionBuilder })
