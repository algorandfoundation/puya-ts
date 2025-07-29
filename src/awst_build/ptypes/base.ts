import { wtypes } from '../../awst/wtypes'
import { CodeError } from '../../errors'
import type { DeliberateAny } from '../../typescript-helpers'
import { zipStrict } from '../../util'
import type { PTypeVisitor } from './visitor'

const PTypeId = Symbol('PTypeId')

/**
 * Represents a public type visible to a developer of AlgoTS
 */
export abstract class PType {
  static readonly IdSymbol: typeof PTypeId = PTypeId
  /**
   * Since TypeScript is structurally typed, different PTypes with compatible
   * structures will often be assignable to one and another and this is generally
   * not desirable. The PTypeId property should be used to declare a literal value
   * (usually the class name) on each distinct PType class to ensure they are
   * structurally different.
   */
  abstract readonly [PTypeId]: string

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

  /**
   * Get the fixed bit size of this type if it has one.
   * Returns null for dynamically sized types.
   */
  readonly fixedBitSize: bigint | null = null

  /**
   * Get the fixed byte size of this type if it has one.
   * Returns null for dynamically sized types.
   */
  get fixedByteSize(): bigint | null {
    return this.fixedBitSize === null ? null : PType.bitsToBytes(this.fixedBitSize)
  }

  abstract accept<T>(visitor: PTypeVisitor<T>): T

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

  equalsOneOf(...others: PType[]): boolean {
    return others.some((o) => ptypesAreEqual(this, o))
  }

  static equals(other: PType): boolean {
    return other.constructor === this
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

  static typeDescription?: string

  static toString() {
    return this?.typeDescription ?? this.constructor.name
  }

  /**
   * Get the number of bytes required to represent n bits
   * @param n The number of bits which need representing
   */
  protected static bitsToBytes(n: bigint): bigint {
    return (n + 7n) / 8n
  }

  /**
   * Round bits up to the nearest byte boundary
   * @param bits The number of bits to round up
   */
  protected static roundBitsUpToNearestByte(bits: bigint): bigint {
    return this.bitsToBytes(bits) * 8n
  }

  /**
   * Calculate fixed the number of bits required to store a sequence of types using ARC4's bit-packing technique for consecutive booleans.
   *
   * Returns `null` if the sequence contains a dynamically sized type
   * @param types The sequence of types being encoded
   */
  protected static calculateFixedBitSize(types: PType[]): bigint | null {
    return types.reduce((acc: bigint | null, cur) => {
      if (acc === null || cur.fixedBitSize === null) return null

      if (cur.fixedBitSize === 1n) {
        return acc + cur.fixedBitSize
      } else {
        return this.roundBitsUpToNearestByte(acc) + this.roundBitsUpToNearestByte(cur.fixedBitSize)
      }
    }, 0n)
  }
}

export interface ABICompatiblePType extends PType {
  readonly abiTypeSignature: string
}

export class GenericPType<T extends PType = PType> extends PType {
  accept<T>(visitor: PTypeVisitor<T>): T {
    return visitor.visitGeneric(this)
  }
  readonly [PTypeId] = 'GenericPType'
  readonly name: string
  readonly module: string
  readonly singleton = true
  readonly wtype = undefined
  readonly parameterise: (typeArgs: readonly PType[]) => T
  constructor(props: { name: string; module: string; parameterise: (typeArgs: readonly PType[]) => T }) {
    super()
    this.name = props.name
    this.module = props.module
    this.parameterise = props.parameterise
  }
}

export type PTypeOrClass = PType | { new (...args: DeliberateAny[]): PType; equals(other: PType): boolean }

function ptypesAreEqual(left: PType, right: PType): boolean {
  if (right.constructor !== left.constructor) {
    return false
  }
  return compareProperties(left, right)
}

const ignoredProperties = new Set(['sourceLocation', 'wtype'])

function notIgnored(key: string): boolean {
  return !ignoredProperties.has(key)
}

function compareProperties(left: object, right: object) {
  const leftProps = Object.entries(left).filter(([key]) => notIgnored(key))
  const rightProps = Object.entries(right).filter(([key]) => notIgnored(key))
  if (leftProps.length !== rightProps.length) return false

  return zipStrict(leftProps, rightProps).every(([[lKey, lValue], [rKey, rValue]]) => {
    if (lKey !== rKey) return false
    return compareValues(lValue, rValue)
  })
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
