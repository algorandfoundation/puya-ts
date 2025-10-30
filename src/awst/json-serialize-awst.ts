import { snakeCase } from 'change-case'
import { InternalError } from '../errors'
import { AbsolutePath } from '../util/absolute-path'
import { buildBase85Encoder } from '../util/base-85'
import { ContractReference, LogicSigReference } from './models'
import { IntrinsicCall, SingleEvaluation } from './nodes'
import { generateExcludedPropsObj } from './nodes-meta'
import { SourceLocation } from './source-location'
import { SymbolToNumber } from './util'

function serializeBigInt(value: bigint): unknown {
  if (value < 0n) {
    if (value < Number.MIN_SAFE_INTEGER) {
      throw new InternalError(`Cannot safely serialize ${value} to JSON`)
    }
    return Number(value)
  } else {
    if (value > Number.MAX_SAFE_INTEGER) {
      return `${value}`
    }
    return Number(value)
  }
}

export class SnakeCaseSerializer<T> {
  constructor(private readonly spaces = 0) {}
  public serialize(obj: T): string {
    return JSON.stringify(obj, (k, v) => this.serializerFunction(k, v), this.spaces)
  }
  private b85 = buildBase85Encoder()

  protected serializerFunction(key: string, value: unknown): unknown {
    if (typeof value === 'bigint') {
      return serializeBigInt(value)
    }
    if (value instanceof Uint8Array) {
      return this.b85.encode(value)
    }
    if (value instanceof Object && value.constructor.name !== 'Date' && value.constructor.name !== 'Object') {
      return {
        ...Object.fromEntries(Object.entries(value).map(([key, value]) => [snakeCase(key), value])),
      }
    }
    return value
  }
}

export class AwstSerializer<T> extends SnakeCaseSerializer<T> {
  constructor(
    private options?: {
      pathsRelativeTo?: AbsolutePath
      spaces?: number
    },
  ) {
    super(options?.spaces ?? 0)
  }
  #singleEvals = new SymbolToNumber()

  protected serializerFunction(key: string, value: unknown): unknown {
    if (value instanceof Set) {
      return Array.from(value.keys())
    }
    if (value instanceof Array) {
      return value
    }
    if (value instanceof Map) {
      if (value.size === 0) return {}
      const keyType = typeof value.keys().next().value
      if (keyType === 'string' || keyType === 'number') {
        return Object.fromEntries(value.entries())
      }
      if (keyType === 'bigint') {
        return Object.fromEntries(Array.from(value.entries()).map(([k, v]) => [`${k}`, v]))
      }
      return Array.from(value.entries())
    }
    if (value instanceof Uint8Array) {
      return super.serializerFunction(key, value)
    }
    if (value instanceof ContractReference || value instanceof LogicSigReference) {
      return value.toString()
    }
    if (value instanceof IntrinsicCall) {
      // Convert bigint immediates to number so they serialize without quotes and can be disambiguated from string immediates
      return {
        _type: IntrinsicCall.name,
        ...(super.serializerFunction(key, value) as object),
        immediates: value.immediates.map((i) => {
          if (typeof i === 'bigint') {
            return serializeBigInt(i)
          }
          return i
        }),
      }
    }
    if (value instanceof AbsolutePath) {
      if (this.options?.pathsRelativeTo === undefined) {
        return value.toString()
      }
      return value.relativeTo(this.options.pathsRelativeTo)
    }
    if (value instanceof SourceLocation) {
      return {
        ...(super.serializerFunction(key, value) as object),
        scope: undefined,
      }
    }
    if (value instanceof SingleEvaluation) {
      return {
        _type: SingleEvaluation.name,
        ...(super.serializerFunction(key, value) as object),
        _id: String(this.#singleEvals.forSymbol(value.id).id),
        ...generateExcludedPropsObj(SingleEvaluation),
      }
    }

    if (value instanceof Object && value.constructor.name !== 'Object') {
      return {
        _type: value.constructor.name,
        ...(super.serializerFunction(key, value) as object),
        ...generateExcludedPropsObj(value.constructor),
      }
    }
    return super.serializerFunction(key, value)
  }
}
