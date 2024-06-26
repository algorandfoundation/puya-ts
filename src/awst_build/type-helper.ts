import ts from 'typescript'
import { CodeError, InternalError } from '../errors'
import { SourceLocation } from '../awst/source-location'
import { boolPType, PType, voidPType } from './ptypes'
import { codeInvariant, hasAnyFlag, hasFlags, invariant } from '../util'
import { NodeBuilder } from './eb'
import { typeRegistry } from './type-registry'
import { ContractClassType, FreeSubroutineType } from './ptypes/ptype-classes'

export class TypeHelper {
  constructor(private checker: ts.TypeChecker) {}

  getUnaliasedSymbolForNode(node: ts.Node) {
    const symbol = this.checker.getSymbolAtLocation(node)
    if (symbol) {
      if (hasFlags(symbol.flags, ts.SymbolFlags.Alias)) {
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
    if (hasFlags(tsType.flags, ts.TypeFlags.Boolean)) {
      return boolPType
    }
    if (hasFlags(tsType.flags, ts.TypeFlags.Void)) {
      return voidPType
    }
    if (hasFlags(tsType.flags, ts.TypeFlags.Unknown)) {
      throw new CodeError(`Type resolves to unknown`, { sourceLocation })
    }
    if (hasFlags(tsType.flags, ts.TypeFlags.Number)) {
      throw new CodeError(`Numeric type requires explicit type annotation (eg. uint64)`, { sourceLocation })
    }

    if (tsType.aliasSymbol) {
      // Type has been declared with an aliased name
      return this.pTypeForSymbol(tsType.aliasSymbol, sourceLocation)
    }

    if (tsType.symbol) {
      return this.pTypeForSymbol(tsType.symbol, sourceLocation)
    }
    throw new CodeError(`Cannot resolve ptype for tsType ${tsType}`, { sourceLocation })
  }

  ptypeForNode(node: ts.Node, sourceLocation: SourceLocation): PType {
    if (ts.isTypeNode(node)) {
      const type = this.checker.getTypeFromTypeNode(node)
      return this.ptypeForTsType(type, sourceLocation)
    }
    if (ts.isClassDeclaration(node)) {
      return this.ptypeForClass(node, sourceLocation)
    }
    const symbol = this.getUnaliasedSymbolForNode(node)
    if (symbol) {
      if (hasFlags(symbol.flags, ts.SymbolFlags.Type)) {
        this.pTypeForSymbol(symbol, sourceLocation)
      }
      if (hasFlags(symbol.flags, ts.SymbolFlags.Class)) {
        invariant(symbol.valueDeclaration && ts.isClassDeclaration(symbol.valueDeclaration), 'Value declaration must be class declaration')
        return this.ptypeForClass(symbol.valueDeclaration, sourceLocation)
      }
      const tsType = this.checker.getTypeOfSymbol(symbol)
      return this.ptypeForTsType(tsType, sourceLocation)
    }
    throw new Error()
  }

  private ptypeForClass(declaration: ts.ClassDeclaration, sourceLocation: SourceLocation): PType {
    codeInvariant(declaration.name, 'Class declaration must have a name', sourceLocation)
    const moduleName = this.getModuleName(declaration)
    const contractName = declaration.name.text

    return new ContractClassType({
      name: contractName,
      module: moduleName,
      properties: {},
      methods: {},
    })
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
      if (hasAnyFlag(symbol.flags, ts.SymbolFlags.Value)) {
        const ptype = this.tryPTypeForSymbol(symbol, sourceLocation)
        if (ptype) {
          const eb = typeRegistry.tryGetSingletonEb(ptype, sourceLocation)
          if (eb) {
            return eb
          }
          return undefined
        }
        if (hasFlags(symbol.flags, ts.SymbolFlags.Function)) {
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
