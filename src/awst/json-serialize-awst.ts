import { snakeCase } from 'change-case'
import path from 'node:path'
import { Constants } from '../constants'
import { InternalError } from '../errors'
import { logger } from '../logger'
import { invariant } from '../util'
import { buildBase85Encoder } from '../util/base-85'
import { ARC4ABIMethodConfig, ContractReference, LogicSigReference } from './models'
import type { RootNode } from './nodes'
import { IntrinsicCall } from './nodes'
import { SourceLocation } from './source-location'

export class SnakeCaseSerializer<T> {
  constructor(private readonly spaces = 2) {}
  public serialize(obj: T): string {
    return JSON.stringify(obj, (k, v) => this.serializerFunction(k, v), this.spaces)
  }

  protected serializerFunction(key: string, value: unknown): unknown {
    if (value instanceof Object && value.constructor.name !== 'Date' && value.constructor.name !== 'Object') {
      return {
        ...Object.fromEntries(Object.entries(value).map(([key, value]) => [snakeCase(key), value])),
      }
    }
    return value
  }
}

export class AwstSerializer extends SnakeCaseSerializer<RootNode[]> {
  constructor(
    private options?: {
      sourcePaths?: 'absolute' | 'relative'
      programDirectory?: string
    },
  ) {
    super()
  }
  private b85 = buildBase85Encoder()

  protected serializerFunction(key: string, value: unknown): unknown {
    if (typeof value === 'bigint') {
      return `${value}`
    }
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
            if (i <= Number.MAX_SAFE_INTEGER) {
              return Number(i)
            } else {
              throw new InternalError(
                'Intrinsic call with integer immediate arg cannot be serialized as it is larger than Number.MAX_SAFE_INTEGER',
                { sourceLocation: value.sourceLocation },
              )
            }
          }
          return i
        }),
      }
    }
    if (value instanceof SourceLocation && value.file) {
      let filePath: string = value.file
      if (this.options?.sourcePaths === 'absolute') {
        invariant(this.options.programDirectory, 'Program directory must be supplied for absolute paths')
        if (value.file.startsWith(Constants.algoTsPackage)) {
          filePath = path.join(this.options.programDirectory, 'node_modules', value.file)
        } else {
          filePath = path.join(this.options.programDirectory, value.file)
        }
      }
      return {
        ...(super.serializerFunction(key, value) as object),
        scope: undefined,
        file: filePath,
      }
    }
    if (value instanceof ARC4ABIMethodConfig) {
      // TODO: This can be removed once puya has been updated to support a more advanced default args schema
      return {
        _type: value.constructor.name,
        ...(super.serializerFunction(key, value) as object),
        default_args: Object.fromEntries(
          Object.entries(value.defaultArgs).flatMap(([key, v]) => {
            if (v.source === 'constant') {
              logger.warn(value.sourceLocation, `Ignoring constant default value for ${key} as puya does not support this yet`)
              return []
            } else {
              return [[key, v.memberName]]
            }
          }),
        ),
      }
    }
    if (value instanceof Uint8Array) {
      return this.b85.encode(value)
    }

    if (value instanceof Object && value.constructor.name !== 'Object') {
      return {
        _type: value.constructor.name,
        ...(super.serializerFunction(key, value) as object),
      }
    }
    return super.serializerFunction(key, value)
  }
}

export function jsonSerializeAwst(awst: RootNode[]): string {
  return new AwstSerializer().serialize(awst)
}
