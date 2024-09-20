import type { wtypes } from '../../awst'
import type { DeliberateAny } from '../../typescript-helpers'
import { codeInvariant } from '../../util'

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
    codeInvariant(this.wtype, `${this.fullName} does not have a wtype`)
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

  getGenericArgs(): PType[] {
    return []
  }
}

export type PTypeOrClass = PType | { new (...args: DeliberateAny[]): PType; equals(other: PType): boolean }
