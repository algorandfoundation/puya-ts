import { snakeCase } from 'change-case'
import type { RootNode } from './nodes'
import { ContractReference, LogicSigReference } from './models'
import { buildBase85Encoder } from '../util/base-85'
import { SourceLocation } from './source-location'
import { invariant } from '../util'
import path from 'node:path'
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
      // TODO: probably needs to be a plain object map
      return value
    }
    if (value instanceof ContractReference || value instanceof LogicSigReference) {
      return value.toString()
    }
    if (value instanceof SourceLocation) {
      if (this.options?.sourcePaths === 'absolute') {
        invariant(this.options.programDirectory, 'Program directory must be supplied for absoluate paths')
        return {
          ...value,
          file: path.join(this.options.programDirectory, value.file),
        } satisfies SourceLocation
      }
      return value
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
