import ts from 'typescript'
import { InternalError } from '../errors'
import { wtypes } from '../awst'
import { SourceLocation } from '../awst/source-location'
import { boolPType, FreeSubroutineType, PType, typeRegistry } from './ptypes'
import { codeInvariant } from '../util'
import { InstanceBuilder, NodeBuilder } from './eb'

export class TypeHelper {
  constructor(private checker: ts.TypeChecker) {}

  getUnaliasedSymbolForNode(node: ts.Node) {
    const symbol = this.checker.getSymbolAtLocation(node)
    if (symbol) {
      if (symbol.flags & ts.SymbolFlags.Alias) {
        return this.checker.getAliasedSymbol(symbol)
      }
      return symbol
    }
    return undefined
  }

  returnTypeForNode(node: ts.Node, sourceLocation: SourceLocation): ts.Type {
    const type = this.checker.getTypeAtLocation(node)
    const sigs = type.getCallSignatures()
    codeInvariant(sigs.length === 1, `User defined functions can only have one call signature`, sourceLocation)
    return sigs[0].getReturnType()
  }

  ptypeForTsType(tsType: ts.Type, sourceLocation: SourceLocation): PType {
    if (tsType.flags & ts.TypeFlags.Boolean) {
      return boolPType
    }

    if (tsType.aliasSymbol) {
      // Type has been declared with an aliased name
      return this.pTypeForSymbol(tsType.aliasSymbol, sourceLocation)
    }

    if (tsType.symbol) {
      return this.pTypeForSymbol(tsType.symbol, sourceLocation)
    }
    throw new Error()
  }

  ptypeForNode(node: ts.Node, sourceLocation: SourceLocation): PType {
    if (ts.isTypeNode(node)) {
      const type = this.checker.getTypeFromTypeNode(node)
      return this.ptypeForTsType(type, sourceLocation)
    }
    const symbol = this.getUnaliasedSymbolForNode(node)
    if (symbol) {
      if (symbol.flags & ts.SymbolFlags.Type) {
        this.pTypeForSymbol(symbol, sourceLocation)
      }
      const tsType = this.checker.getTypeOfSymbol(symbol)
      return this.ptypeForTsType(tsType, sourceLocation)
    }
    throw new Error()
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
      if (symbol.flags & ts.SymbolFlags.Namespace) {
        return [this.getModuleName(declaration), '*']
      }
      return [this.getModuleName(declaration), symbol.name]
    }
    throw new InternalError(`Symbol does not have a declaration`, { sourceLocation })
  }

  private pTypeForSymbol(symbol: ts.Symbol, sourceLocation: SourceLocation) {
    const fullName = this.getSymbolFullName(symbol, sourceLocation).join('::')
    return typeRegistry.resolvePType(fullName, sourceLocation)
  }

  private tryPTypeForSymbol(symbol: ts.Symbol, sourceLocation: SourceLocation) {
    return typeRegistry.tryResolvePType(this.getSymbolFullName(symbol, sourceLocation).join('::'))
  }

  tryGetBuilderForNode(node: ts.Node, sourceLocation: SourceLocation): NodeBuilder | undefined {
    const symbol = this.getUnaliasedSymbolForNode(node)
    if (symbol) {
      if (symbol.flags & ts.SymbolFlags.Value) {
        const ptype = this.tryPTypeForSymbol(symbol, sourceLocation)
        if (ptype) {
          const eb = typeRegistry.tryGetSingletonEb(ptype, sourceLocation)
          if (eb) {
            return eb
          }
          return undefined
        }
        if (symbol.flags & ts.SymbolFlags.Function) {
          const type = this.checker.getTypeOfSymbol(symbol)
          const sig = type.getCallSignatures()
          codeInvariant(sig.length === 1, `User defined functions can only have one call signature`, sourceLocation)
          const returnType = this.ptypeForTsType(sig[0].getReturnType(), sourceLocation)
          const parameters = sig[0].getParameters().map((p) => {
            const paramType = this.checker.getTypeOfSymbol(p)
            return this.ptypeForTsType(paramType, sourceLocation)
          })

          const [module, name] = this.getSymbolFullName(type.symbol, sourceLocation)
          const ptype = new FreeSubroutineType({
            name,
            module,
            parameters,
            returnType,
          })
          return typeRegistry.tryGetSingletonEb(ptype, sourceLocation)
        }
      }
    }
    return undefined
  }
}
