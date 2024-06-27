import ts from 'typescript'
import { PType } from './ptypes'
import { SourceLocation } from '../awst/source-location'
import { hasAnyFlag, hasFlags } from '../util'
import { InternalError } from '../errors'
import { typeRegistry } from './type-registry'
import { logger } from '../logger'

export class TypeResolver {
  constructor(private readonly checker: ts.TypeChecker) {}

  private getUnaliasedSymbolForNode(node: ts.Node) {
    const symbol = this.checker.getSymbolAtLocation(node)
    if (symbol) {
      if (hasFlags(symbol.flags, ts.SymbolFlags.Alias)) {
        return this.checker.getAliasedSymbol(symbol)
      }
      return symbol
    }
    return undefined
  }

  resolveSingleton(node: ts.Node, sourceLocation: SourceLocation): PType | undefined {
    const symbol = this.getUnaliasedSymbolForNode(node)
    if (symbol === undefined) {
      return undefined
    }
    const symbolName = symbol && this.getSymbolFullName(symbol, sourceLocation).join('::')
    const ptype = typeRegistry.tryResolvePType(symbolName)
    if (ptype === undefined) {
      logger.warn(sourceLocation, `${symbolName} could not be resolved to a singleton ptype`)
    }
    return ptype
  }

  resolveInstance(node: ts.Node, sourceLocation: SourceLocation): PType {
    const type = this.checker.getTypeAtLocation(node)
    return this.resolveType(type, sourceLocation)
    // const typeName = this.getTypeName(type, sourceLocation)
    //
    // const ptype = typeRegistry.tryResolvePType(typeName)
    // if (ptype === undefined) {
    //   throw new CodeError(`${typeName} could not be resolved to an instance ptype`, { sourceLocation })
    // }
    // return ptype
  }

  resolveTypeNode(node: ts.TypeNode, sourceLocation: SourceLocation): PType {
    const type = this.checker.getTypeFromTypeNode(node)
    return this.resolveType(type, sourceLocation)
  }

  resolveType(node: ts.Type, sourceLocation: SourceLocation): PType {
    const typeName = this.getTypeName(node, sourceLocation)
    if (node.aliasTypeArguments?.length) {
      const typeArgs = node.aliasTypeArguments.map((a) => this.resolveType(a, sourceLocation))
      return typeRegistry.resolveGenericPType(typeName, typeArgs, sourceLocation)
    } else {
      return typeRegistry.resolvePType(typeName, sourceLocation)
    }
  }

  private getTypeName(type: ts.Type, sourceLocation: SourceLocation): string {
    return this.getSymbolFullName(type.aliasSymbol ?? type.symbol, sourceLocation).join('::')
  }

  private getModuleName(declaration: ts.Declaration): string {
    const sourceFileName = declaration.getSourceFile().fileName
    const nodeModuleName = /node_modules\/(.*)$/.exec(sourceFileName)

    if (nodeModuleName) {
      return nodeModuleName[1]
    }
    return sourceFileName
  }

  private getSymbolFullName(symbol: ts.Symbol, sourceLocation: SourceLocation): [string, string] {
    const declaration = symbol.declarations?.[0]
    if (declaration) {
      if (hasAnyFlag(symbol.flags, ts.SymbolFlags.Namespace) && !hasFlags(symbol.flags, ts.SymbolFlags.Function)) {
        return [this.getModuleName(declaration), '*']
      }
      return [this.getModuleName(declaration), symbol.name]
    }
    throw new InternalError(`Symbol does not have a declaration`, { sourceLocation })
  }
}
