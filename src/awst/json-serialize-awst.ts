import type { Module } from './nodes'
import { snakeCase } from 'change-case'

function toPuyaCase(propertyName: string) {
  return snakeCase(propertyName)
}

export function jsonSerializeAwst(awst: Record<string, Module>): string {
  return JSON.stringify(
    awst,
    (_key: string, value: unknown) => {
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

      if (value instanceof Object && value.constructor.name !== 'Object') {
        return {
          _type: value.constructor.name,
          ...Object.fromEntries(Object.entries(value).map(([key, value]) => [toPuyaCase(key), value])),
        }
      }
      if (value instanceof Uint8Array) {
        return `0x${Buffer.from(value).toString('hex')}`
      }
      return value
    },
    2,
  )
}
