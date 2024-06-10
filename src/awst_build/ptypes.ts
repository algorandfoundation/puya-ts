import { awst, wtypes } from '../awst'
import { ExpressionBuilder } from './eb'
import { SourceLocation } from '../awst/source-location'
import { VoidExpressionBuilder } from './eb/void-expression-builder'
import { BoolExpressionBuilder } from './eb/bool-expression-builder'
import { UInt64ExpressionBuilder, UInt64FunctionExpressionBuilder } from './eb/uint64-expression-builder'
import { BytesExpressionBuilder, BytesFunctionExpressionBuilder } from './eb/bytes-expression-builder'
import { OpModuleExpressionBuilder } from './eb/op-module-expression-builder'
import { LogExpressionBuilder } from './eb/log-expression-builder'
import ts from 'typescript'
import { InternalError, throwError } from '../errors'
import { codeInvariant } from '../util'
import { DeliberateAny } from '../typescript-helpers'
import { FreeSubroutineExpressionBuilder } from './eb/free-subroutine-expression-builder'
import { StrExpressionBuilder, StrFunctionExpressionBuilder } from './eb/str-expression-builder'

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

type ValueExpressionBuilderCtor = { new (expr: awst.Expression, ptype: PType): ExpressionBuilder }
type SingletonExpressionBuilderCtor = { new (sourceLocation: SourceLocation, ptype: PType): ExpressionBuilder }

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

  tryGetSingletonEb(ptype: PType, sourceLocation: SourceLocation): ExpressionBuilder | undefined {
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

  getInstanceEb(expression: awst.Expression, ptype: PType): ExpressionBuilder {
    return (
      this.tryGetInstanceEb(expression, ptype) ??
      throwError(
        new InternalError(`No instance ExpressionBuilder registered for ${expression.wtype}`, {
          sourceLocation: expression.sourceLocation,
        }),
      )
    )
  }
  tryGetInstanceEb(expression: awst.Expression, ptype: PType): ExpressionBuilder | undefined {
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
typeRegistry.register({ ptype: voidPType, instanceEb: VoidExpressionBuilder })

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
typeRegistry.register({ ptype: Uint64Function, symbolEb: UInt64FunctionExpressionBuilder })

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
typeRegistry.register({ ptype: BytesFunction, symbolEb: BytesFunctionExpressionBuilder })

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
typeRegistry.register({ ptype: StrFunction, symbolEb: StrFunctionExpressionBuilder })
export const opNamespace = new NamespaceType({
  name: 'op',
  module: '@algorandfoundation/algo-ts/op.d.ts',
})
typeRegistry.register({ ptype: opNamespace, symbolEb: OpModuleExpressionBuilder })
export const logFunction = new LibFunctionType({
  name: 'log',
  module: '@algorandfoundation/algo-ts/util.d.ts',
})
typeRegistry.register({ ptype: logFunction, symbolEb: LogExpressionBuilder })

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
