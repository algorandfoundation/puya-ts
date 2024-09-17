import type { InstanceBuilder, InstanceExpressionBuilder, NodeBuilder } from './eb'
import type { SourceLocation } from '../awst/source-location'
import type { DeliberateAny } from '../typescript-helpers'
import { CodeError, InternalError, throwError } from '../errors'
import { PType } from './ptypes'
import type { awst } from '../awst'
import type { SymbolName } from './symbol-name'

type ValueExpressionBuilderCtor<TPType extends PType> = { new (expr: awst.Expression, ptype: PType): InstanceExpressionBuilder<TPType> }
type SingletonExpressionBuilderCtor = { new (sourceLocation: SourceLocation, ptype: PType): NodeBuilder }

type PTypeClass = { new (...args: DeliberateAny): PType }
type GenericPTypeClass = { new (...args: DeliberateAny): PType; get baseFullName(): string; parameterise(typeArgs: PType[]): PType }
export class TypeRegistry {
  get hasRegistrations() {
    return this.types.size > 0 || this.genericTypes.size > 0
  }

  private readonly singletonEbs: Map<PType | PTypeClass, SingletonExpressionBuilderCtor> = new Map()
  private readonly instanceEbs: Map<PType | PTypeClass, ValueExpressionBuilderCtor<PType>> = new Map()
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
        instanceEb: ValueExpressionBuilderCtor<PType>
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
  registerGeneric({ ptype, instanceEb }: { ptype: GenericPTypeClass; instanceEb: ValueExpressionBuilderCtor<PType> }) {
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
        throw new CodeError(`${symbolName} type is not supported`, { sourceLocation })
      }
      throw new InternalError(`Cannot resolve ptype for symbol ${symbolName}`, {
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
    const genericType = this.tryResolveGenericPType(symbolName, typeArgs)
    if (genericType) return genericType
    throw new CodeError(`${symbolName} could not be resolved to a generic type`, { sourceLocation })
  }
  tryResolveGenericPType(symbolName: SymbolName, typeArgs: PType[]): PType | undefined {
    for (const pt of this.genericTypes.values()) {
      if (pt.baseFullName === symbolName.fullName) {
        return pt.parameterise(typeArgs)
      }
    }
    return undefined
  }
}
export const typeRegistry = new TypeRegistry()

export function instanceEb(expr: awst.Expression, ptype: PType) {
  return typeRegistry.getInstanceEb(expr, ptype)
}
