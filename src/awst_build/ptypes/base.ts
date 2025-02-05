import { wtypes } from '../../awst/wtypes'
import { CodeError } from '../../errors'
import type { DeliberateAny } from '../../typescript-helpers'

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

  abstract readonly singleton: boolean

  get fullName() {
    return `${this.module}::${this.name}`
  }

  get wtypeOrThrow(): wtypes.WType {
    if (!this.wtype) {
      throw new CodeError(`${this.fullName} does not have a wtype`)
    }
    return this.wtype
  }

  equals(other: PType): boolean {
    return ptypesAreEqual(this, other)
  }

  static equals(other: PType): boolean {
    return other instanceof this
  }

  equalsOrInstanceOf(other: PTypeOrClass): boolean {
    if (other instanceof Function) {
      return this instanceof other
    }
    return this.equals(other)
  }

  toString(): string {
    return this.name
  }
}

export class GenericPType<T extends PType = PType> extends PType {
  readonly name: string
  readonly module: string
  readonly singleton = false
  readonly wtype = undefined
  readonly parameterise: (typeArgs: PType[]) => T
  constructor(props: { name: string; module: string; parameterise: (typeArgs: PType[]) => T }) {
    super()
    this.name = props.name
    this.module = props.module
    this.parameterise = props.parameterise
  }
}

export type PTypeOrClass = PType | { new (...args: DeliberateAny[]): PType; equals(other: PType): boolean }

function ptypesAreEqual(left: PType, right: PType): boolean {
  if (!(right instanceof left.constructor)) {
    return false
  }
  return compareProperties(left, right)
}

const ignoredProperties = new Set(['sourceLocation', 'wtype'])

function notIgnored(key: string): boolean {
  return !ignoredProperties.has(key)
}

function compareProperties(left: object, right: object) {
  if (Object.keys(left).filter(notIgnored).length !== Object.keys(right).filter(notIgnored).length) {
    return false
  }
  const rightEntries = new Map(Object.entries(right))
  return Object.entries(left)
    .filter(([key]) => notIgnored(key))
    .every(([key, value]) => compareValues(value, rightEntries.get(key)))
}

function compareValues(left: unknown, right: unknown): boolean {
  // Handle primitive comparison
  if (typeof left !== 'object' || left === right) {
    return left === right
  }
  if (left === null) {
    return right === null
  }
  // Recursively compare array items
  if (Array.isArray(left)) {
    return Array.isArray(right) && left.length === right.length && left.every((v, i) => compareValues(v, right[i]))
  }
  // Recursively compare ptypes
  if (left instanceof PType) {
    return right instanceof PType && ptypesAreEqual(left, right)
  }
  if (left instanceof wtypes.WType) {
    return right instanceof wtypes.WType && left.equals(right)
  }
  return typeof right === 'object' && right !== null && compareProperties(left, right)
}
