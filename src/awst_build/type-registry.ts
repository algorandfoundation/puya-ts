import { InstanceBuilder, InstanceExpressionBuilder, NodeBuilder } from './eb'
import { SourceLocation } from '../awst/source-location'
import { DeliberateAny } from '../typescript-helpers'
import { CodeError, InternalError, throwError } from '../errors'
import {
  ALL_OP_ENUMS,
  arc4AbiMethodDecorator,
  arc4BareMethodDecorator,
  assertFunction,
  AssetFunction,
  assetPType,
  BigUintFunction,
  biguintPType,
  boolPType,
  BytesFunction,
  bytesPType,
  errFunction,
  GlobalStateFunction,
  logFunction,
  PType,
  StringFunction,
  stringPType,
  TuplePType,
  Uint64Function,
  uint64PType,
  voidPType,
} from './ptypes'
import { BooleanExpressionBuilder } from './eb/boolean-expression-builder'
import { UInt64ExpressionBuilder, UInt64FunctionBuilder } from './eb/uint64-expression-builder'
import { BytesExpressionBuilder, BytesFunctionBuilder } from './eb/bytes-expression-builder'
import { StringExpressionBuilder, StringFunctionBuilder } from './eb/string-expression-builder'
import { FreeIntrinsicOpBuilder, IntrinsicOpGroupBuilder } from './eb/op-module-builder'
import { LogFunctionBuilder } from './eb/log-function-builder'
import { AssertFunctionBuilder, ErrFunctionBuilder } from './eb/assert-function-builder'
import { FreeSubroutineExpressionBuilder } from './eb/free-subroutine-expression-builder'
import { awst } from '../awst'
import {
  FunctionPType,
  GlobalStateType,
  IntrinsicFunctionGroupType,
  IntrinsicFunctionType,
  NamespacePType,
  ObjectPType,
  UnsupportedType,
} from './ptypes/ptype-classes'
import { IntrinsicEnumBuilder } from './eb/intrinsic-enum-builder'
import { OP_METADATA } from './op-metadata'
import { GlobalStateExpressionBuilder, GlobalStateFunctionBuilder } from './eb/storage/global-state'
import { AssetExpressionBuilder, AssetFunctionBuilder } from './eb/reference/asset'
import { SymbolName } from './symbol-name'
import { TupleExpressionBuilder } from './eb/tuple-expression-builder'
import { Arc4AbiMethodDecoratorBuilder, Arc4BareMethodDecoratorBuilder } from './eb/arc4-bare-method-decorator-builder'
import { NamespaceBuilder } from './eb/namespace-builder'
import { VoidExpressionBuilder } from './eb/void-expression-builder'
import { ObjectExpressionBuilder } from './eb/literal/object-literal-expression-builder'
import { BigUintExpressionBuilder, BigUintFunctionBuilder } from './eb/biguint-expression-builder'

type ValueExpressionBuilderCtor = { new (expr: awst.Expression, ptype: PType): InstanceExpressionBuilder }
type SingletonExpressionBuilderCtor = { new (sourceLocation: SourceLocation, ptype: PType): NodeBuilder }

type PTypeClass = { new (...args: DeliberateAny): PType }
type GenericPTypeClass = { new (...args: DeliberateAny): PType; get baseFullName(): string; parameterise(typeArgs: PType[]): PType }
class TypeRegistry {
  private readonly singletonEbs: Map<PType | PTypeClass, SingletonExpressionBuilderCtor> = new Map()
  private readonly instanceEbs: Map<PType | PTypeClass, ValueExpressionBuilderCtor> = new Map()
  private readonly types: Set<PType | PTypeClass> = new Set()
  private readonly genericTypes: Set<GenericPTypeClass> = new Set()

  register({
    ptype,
    singletonEb,
    instanceEb,
  }:
    | {
        ptype: PType | PTypeClass
        singletonEb: SingletonExpressionBuilderCtor
        instanceEb?: undefined
      }
    | {
        ptype: PType | PTypeClass
        singletonEb?: undefined
        instanceEb: ValueExpressionBuilderCtor
      }) {
    if (this.types.has(ptype) || this.genericTypes.has(ptype as GenericPTypeClass))
      throw new InternalError(`${ptype} has already been registered`)
    this.types.add(ptype)
    if (singletonEb) {
      this.singletonEbs.set(ptype, singletonEb)
    }
    if (instanceEb) {
      this.instanceEbs.set(ptype, instanceEb)
    }
  }
  registerGeneric({ ptype, instanceEb }: { ptype: GenericPTypeClass; instanceEb: ValueExpressionBuilderCtor }) {
    if (this.genericTypes.has(ptype) || this.types.has(ptype)) throw new InternalError(`${ptype} has already been registered`)
    this.genericTypes.add(ptype)
    this.instanceEbs.set(ptype, instanceEb)
  }

  /**
   * Try to resolve a symbol name to a singleton ptype
   * @param symbolName The name of the symbol
   */
  tryResolveSingletonName(symbolName: SymbolName): PType | undefined {
    for (const v of this.singletonEbs.keys()) if (v instanceof PType && v.fullName === symbolName.fullName) return v
    return undefined
  }

  /**
   * Try to resolve a symbol name to an instance ptype
   * @param symbolName The name of the symbol
   */
  tryResolveInstancePType(symbolName: SymbolName): PType | undefined {
    for (const v of this.instanceEbs.keys()) {
      if (v instanceof PType && v.fullName === symbolName.fullName) return v
    }
    return undefined
  }

  resolveInstancePType(symbolName: SymbolName, sourceLocation: SourceLocation): PType {
    const ptype = this.tryResolveInstancePType(symbolName)
    if (!ptype) {
      if (symbolName.module.startsWith('typescript/lib')) {
        return new UnsupportedType(symbolName)
      }
      throw new InternalError(`Cannot resolve ptype for ${symbolName}`, {
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

  resolveGenericPType(symbolName: SymbolName, typeArgs: PType[], sourceLocation: SourceLocation) {
    for (const pt of this.genericTypes.values()) {
      if (pt.baseFullName === symbolName.fullName) {
        return pt.parameterise(typeArgs)
      }
    }
    throw new CodeError(`${symbolName} could not be resolved to a generic type`, { sourceLocation })
  }
}
export const typeRegistry = new TypeRegistry()

typeRegistry.register({ ptype: boolPType, instanceEb: BooleanExpressionBuilder })
typeRegistry.register({ ptype: uint64PType, instanceEb: UInt64ExpressionBuilder })
typeRegistry.register({ ptype: Uint64Function, singletonEb: UInt64FunctionBuilder })
typeRegistry.register({ ptype: biguintPType, instanceEb: BigUintExpressionBuilder })
typeRegistry.register({ ptype: BigUintFunction, singletonEb: BigUintFunctionBuilder })
typeRegistry.register({ ptype: bytesPType, instanceEb: BytesExpressionBuilder })
typeRegistry.register({ ptype: BytesFunction, singletonEb: BytesFunctionBuilder })
typeRegistry.register({ ptype: stringPType, instanceEb: StringExpressionBuilder })
typeRegistry.register({ ptype: StringFunction, singletonEb: StringFunctionBuilder })
typeRegistry.register({ ptype: logFunction, singletonEb: LogFunctionBuilder })
typeRegistry.register({ ptype: assertFunction, singletonEb: AssertFunctionBuilder })
typeRegistry.register({ ptype: errFunction, singletonEb: ErrFunctionBuilder })
typeRegistry.register({ ptype: AssetFunction, singletonEb: AssetFunctionBuilder })
typeRegistry.register({ ptype: assetPType, instanceEb: AssetExpressionBuilder })
typeRegistry.register({ ptype: FunctionPType, singletonEb: FreeSubroutineExpressionBuilder })
typeRegistry.register({ ptype: NamespacePType, singletonEb: NamespaceBuilder })
typeRegistry.register({ ptype: voidPType, instanceEb: VoidExpressionBuilder })
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
typeRegistry.register({ ptype: TuplePType, instanceEb: TupleExpressionBuilder })
typeRegistry.register({ ptype: arc4AbiMethodDecorator, singletonEb: Arc4AbiMethodDecoratorBuilder })
typeRegistry.register({ ptype: arc4BareMethodDecorator, singletonEb: Arc4BareMethodDecoratorBuilder })
typeRegistry.register({ ptype: ObjectPType, instanceEb: ObjectExpressionBuilder })
