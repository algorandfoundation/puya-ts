import { InstanceBuilder, InstanceExpressionBuilder, NodeBuilder } from './eb'
import { SourceLocation } from '../awst/source-location'
import { DeliberateAny } from '../typescript-helpers'
import { CodeError, InternalError, throwError } from '../errors'
import {
  ALL_OP_ENUMS,
  assertFunction,
  assetPType,
  boolPType,
  BytesFunction,
  bytesPType,
  GlobalStateFunction,
  logFunction,
  opNamespace,
  PType,
  StrFunction,
  strPType,
  Uint64Function,
  uint64PType,
} from './ptypes'
import { BoolExpressionBuilder } from './eb/bool-expression-builder'
import { UInt64ExpressionBuilder, UInt64FunctionBuilder } from './eb/uint64-expression-builder'
import { BytesExpressionBuilder, BytesFunctionBuilder } from './eb/bytes-expression-builder'
import { StrExpressionBuilder, StrFunctionBuilder } from './eb/str-expression-builder'
import { FreeIntrinsicOpBuilder, IntrinsicOpGroupBuilder, OpModuleBuilder } from './eb/op-module-builder'
import { LogFunctionBuilder } from './eb/log-function-builder'
import { AssertFunctionBuilder } from './eb/assert-function-builder'
import { FreeSubroutineExpressionBuilder } from './eb/free-subroutine-expression-builder'
import { awst } from '../awst'
import { FunctionType, GlobalStateType, IntrinsicEnumType, IntrinsicFunctionGroupType, IntrinsicFunctionType } from './ptypes/ptype-classes'
import { IntrinsicEnumBuilder } from './eb/intrinsic-enum-builder'
import { OP_METADATA } from './op-metadata'
import { Constants } from '../constants'
import { GlobalStateExpressionBuilder, GlobalStateFunctionBuilder, GlobalStateFunctionResultBuilder } from './eb/storage/global-state'
import { AssetExpressionBuilder, AssetFunctionBuilder } from './eb/reference/asset'

type ValueExpressionBuilderCtor = { new (expr: awst.Expression, ptype: PType): InstanceExpressionBuilder }
type SingletonExpressionBuilderCtor = { new (sourceLocation: SourceLocation, ptype: PType): NodeBuilder }

type PTypeClass = { new (...args: DeliberateAny): PType }
type GenericPTypeClass = { new (...args: DeliberateAny): PType; get baseFullName(): string; parametise(typeArgs: PType[]): PType }
class TypeRegistry {
  private readonly singletonEbs: Map<PType | PTypeClass, SingletonExpressionBuilderCtor> = new Map()
  private readonly instanceEbs: Map<PType | PTypeClass, ValueExpressionBuilderCtor> = new Map()
  private readonly types: Set<PType | PTypeClass> = new Set()
  private readonly genericTypes: Set<GenericPTypeClass> = new Set()

  register({
    ptype,
    singletonEb,
    instanceEb,
  }: {
    ptype: PType | PTypeClass
    singletonEb?: SingletonExpressionBuilderCtor
    instanceEb?: ValueExpressionBuilderCtor
  }) {
    if (this.types.has(ptype) || this.genericTypes.has(ptype as GenericPTypeClass))
      throw new InternalError(`${ptype} has already been registered`)
    this.types.add(ptype)
    if (singletonEb) this.singletonEbs.set(ptype, singletonEb)
    if (instanceEb) {
      this.instanceEbs.set(ptype, instanceEb)
    }
  }
  registerGeneric({ ptype, instanceEb }: { ptype: GenericPTypeClass; instanceEb: ValueExpressionBuilderCtor }) {
    if (this.genericTypes.has(ptype) || this.types.has(ptype)) throw new InternalError(`${ptype} has already been registered`)
    this.genericTypes.add(ptype)
    this.instanceEbs.set(ptype, instanceEb)
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

  getSingletonEb(ptype: PType, sourceLocation: SourceLocation): NodeBuilder {
    return (
      this.tryGetSingletonEb(ptype, sourceLocation) ??
      throwError(
        new InternalError(`No singleton eb registered for ${ptype}`, {
          sourceLocation,
        }),
      )
    )
  }
  getInstanceEb(expression: awst.Expression, ptype: PType): InstanceBuilder {
    return (
      this.tryGetInstanceEb(expression, ptype) ??
      throwError(
        new InternalError(`No InstanceBuilder registered for ${ptype}`, {
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

  resolveGenericPType(fullname: string, typeArgs: PType[], sourceLocation: SourceLocation) {
    for (const pt of this.genericTypes.values()) {
      if (pt.baseFullName === fullname) {
        return pt.parametise(typeArgs)
      }
    }
    throw new CodeError(`${fullname} could not be resolved to a generic type`, { sourceLocation })
  }
}
export const typeRegistry = new TypeRegistry()

typeRegistry.register({ ptype: boolPType, instanceEb: BoolExpressionBuilder })
typeRegistry.register({ ptype: uint64PType, instanceEb: UInt64ExpressionBuilder })
typeRegistry.register({ ptype: Uint64Function, singletonEb: UInt64FunctionBuilder })
typeRegistry.register({ ptype: bytesPType, instanceEb: BytesExpressionBuilder })
typeRegistry.register({ ptype: BytesFunction, singletonEb: BytesFunctionBuilder })
typeRegistry.register({ ptype: strPType, instanceEb: StrExpressionBuilder })
typeRegistry.register({ ptype: StrFunction, singletonEb: StrFunctionBuilder })
typeRegistry.register({ ptype: opNamespace, singletonEb: OpModuleBuilder })
typeRegistry.register({ ptype: logFunction, singletonEb: LogFunctionBuilder })
typeRegistry.register({ ptype: assertFunction, singletonEb: AssertFunctionBuilder })
typeRegistry.register({ ptype: assetPType, instanceEb: AssetExpressionBuilder, singletonEb: AssetFunctionBuilder })
typeRegistry.register({ ptype: FunctionType, singletonEb: FreeSubroutineExpressionBuilder })

for (const enumPType of ALL_OP_ENUMS) {
  typeRegistry.register({ ptype: enumPType, singletonEb: IntrinsicEnumBuilder })
}
for (const [name, metadata] of Object.entries(OP_METADATA)) {
  if (metadata.type === 'op-grouping') {
    typeRegistry.register({
      ptype: new IntrinsicFunctionGroupType({
        name,
      }),
      singletonEb: IntrinsicOpGroupBuilder,
    })
  } else {
    typeRegistry.register({
      ptype: new IntrinsicFunctionType({
        name,
      }),
      singletonEb: FreeIntrinsicOpBuilder,
    })
  }
}

typeRegistry.register({ ptype: GlobalStateFunction, singletonEb: GlobalStateFunctionBuilder })
typeRegistry.registerGeneric({ ptype: GlobalStateType, instanceEb: GlobalStateExpressionBuilder })
