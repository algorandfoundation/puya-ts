import { InstanceBuilder, InstanceExpressionBuilder, NodeBuilder } from './eb'
import { SourceLocation } from '../awst/source-location'
import { DeliberateAny } from '../typescript-helpers'
import { InternalError, throwError } from '../errors'
import {
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
import { FreeSubroutineType, IntrinsicEnumType, IntrinsicFunctionGroupType, IntrinsicFunctionType } from './ptypes/ptype-classes'
import { IntrinsicEnumBuilder } from './eb/intrinsic-enum-builder'
import { OP_METADATA } from './op-metadata'
import { Constants } from '../constants'
import { GlobalStateFunctionBuilder } from './eb/storage/global-state'
import { AssetExpressionBuilder, AssetFunctionBuilder } from './eb/reference/asset'

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
    const [module, identifer] = fullName.split('::')
    if (module === Constants.opModuleName) {
      const metadata = OP_METADATA[identifer]
      if (metadata?.type === 'op-grouping') {
        return new IntrinsicFunctionGroupType({
          name: identifer,
        })
      } else if (metadata?.type === 'op-mapping') {
        return new IntrinsicFunctionType({
          name: identifer,
        })
      }
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

typeRegistry.register({ ptype: boolPType, instanceEb: BoolExpressionBuilder })

typeRegistry.register({ ptype: uint64PType, instanceEb: UInt64ExpressionBuilder })
typeRegistry.register({ ptype: Uint64Function, symbolEb: UInt64FunctionBuilder })
typeRegistry.register({ ptype: bytesPType, instanceEb: BytesExpressionBuilder })
typeRegistry.register({ ptype: BytesFunction, symbolEb: BytesFunctionBuilder })
typeRegistry.register({ ptype: strPType, instanceEb: StrExpressionBuilder })
typeRegistry.register({ ptype: StrFunction, symbolEb: StrFunctionBuilder })
typeRegistry.register({ ptype: opNamespace, symbolEb: OpModuleBuilder })
typeRegistry.register({ ptype: logFunction, symbolEb: LogFunctionBuilder })
typeRegistry.register({ ptype: assertFunction, symbolEb: AssertFunctionBuilder })

typeRegistry.register({ ptype: assetPType, instanceEb: AssetExpressionBuilder, symbolEb: AssetFunctionBuilder })

typeRegistry.register({ ptype: FreeSubroutineType, symbolEb: FreeSubroutineExpressionBuilder })
typeRegistry.register({ ptype: IntrinsicEnumType, symbolEb: IntrinsicEnumBuilder })
typeRegistry.register({ ptype: IntrinsicFunctionType, symbolEb: FreeIntrinsicOpBuilder })
typeRegistry.register({ ptype: IntrinsicFunctionGroupType, symbolEb: IntrinsicOpGroupBuilder })
typeRegistry.register({ ptype: GlobalStateFunction, symbolEb: GlobalStateFunctionBuilder })
