import ts from 'typescript'
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

  resolveUniqueName(rawName: string, symbol: ts.Symbol): string {
    const name = this.symbolToName.get(symbol)
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
    this.symbolToName.set(symbol, uniqueName)
    return uniqueName
  }

  createChild(): UniqueNameResolver {
    return new UniqueNameResolver(this)
  }
}
