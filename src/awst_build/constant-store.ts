import ts, { SymbolFlags } from 'typescript'
import type { Constant, TemplateVar } from '../awst/nodes'
import type { SourceLocation } from '../awst/source-location'
import { CodeError } from '../errors'
import { logger } from '../logger'
import { hasFlags, invariant } from '../util'

export class ConstantStore {
  #constants = new Map<ts.Symbol, Constant | TemplateVar>()
  #typeChecker: ts.TypeChecker
  constructor(program: ts.Program) {
    this.#typeChecker = program.getTypeChecker()
  }

  tryResolveConstant(node: ts.Identifier) {
    let symbol = this.#typeChecker.resolveName(node.text, node, SymbolFlags.All, true)
    if (!symbol) return undefined
    if (hasFlags(symbol.flags, ts.SymbolFlags.Alias)) {
      symbol = this.#typeChecker.getAliasedSymbol(symbol)
    }
    return this.#constants.get(symbol)
  }

  addConstant(identifier: ts.Identifier, value: Constant | TemplateVar, constantLocation: SourceLocation) {
    const symbol = this.#typeChecker.resolveName(identifier.text, identifier, ts.SymbolFlags.All, false)
    invariant(symbol, 'Constant identifier must resolve to a symbol')

    if (this.#constants.has(symbol)) {
      logger.error(new CodeError(`Duplicate definitions found for constant ${identifier.text}`, { sourceLocation: constantLocation }))
      return
    }
    const exportSymbol = this.#typeChecker.getExportSymbolOfSymbol(symbol)
    this.#constants.set(symbol, value)
    if (exportSymbol !== symbol) this.#constants.set(exportSymbol, value)
  }
}
