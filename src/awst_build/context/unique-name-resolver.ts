import type ts from 'typescript'
import { toSubScript } from '../../util'

export class UniqueNameResolver {
  protected readonly symbolToName: Map<ts.Symbol, string>
  protected readonly nameToCount: Map<string, number>

  constructor(parent?: UniqueNameResolver) {
    if (parent) {
      this.symbolToName = new Map(parent.symbolToName.entries())
      this.nameToCount = new Map(parent.nameToCount.entries())
    } else {
      this.symbolToName = new Map()
      this.nameToCount = new Map()
    }
  }

  /**
   * Resolve a rawName to a unique name within the scope of this resolver. When provided
   * with a symbol which has already been seen, return the same name
   * @param rawName
   * @param symbol
   */
  resolveUniqueName(rawName: string, symbol: ts.Symbol | undefined): string {
    const name = symbol && this.symbolToName.get(symbol)
    if (name) {
      return name
    }
    const nameCount = this.nameToCount.get(rawName) ?? 0
    let uniqueName
    if (nameCount === 0) {
      uniqueName = rawName
    } else {
      uniqueName = `${rawName}${toSubScript(nameCount)}`
    }
    this.nameToCount.set(rawName, nameCount + 1)
    if (symbol) {
      this.symbolToName.set(symbol, uniqueName)
    }
    return uniqueName
  }

  createChild(): UniqueNameResolver {
    return new UniqueNameResolver(this)
  }
}
