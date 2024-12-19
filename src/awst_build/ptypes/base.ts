import type { wtypes } from '../../awst/wtypes'
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
    return other instanceof this.constructor && this.fullName === other.fullName
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
