import ts, { SyntaxKind } from 'typescript'
import {
  ApprovalProgram,
  BaseContractType,
  boolPType,
  ClearStateProgram,
  ContractType,
  numberPType,
  PType,
  StringFunction,
  stringPType,
  voidPType,
} from './ptypes'
import { SourceLocation } from '../awst/source-location'
import { codeInvariant, hasAnyFlag, hasFlags, invariant } from '../util'
import { CodeError, InternalError } from '../errors'
import { typeRegistry } from './type-registry'
import { logger } from '../logger'
import { Constants } from '../constants'
import { AppStorageType, ContractClassType, FunctionType, GlobalStateType } from './ptypes/ptype-classes'
import { SymbolName } from './symbol-name'

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

  resolve(node: ts.Node, sourceLocation: SourceLocation): PType {
    const symbol = this.getUnaliasedSymbolForNode(node)
    if (symbol !== undefined) {
      const symbolName = symbol && this.getSymbolFullName(symbol, sourceLocation)
      const ptype = typeRegistry.tryResolveSingletonName(symbolName)
      if (ptype === undefined && symbolName.module.startsWith(Constants.algoTsPackage)) {
        logger.warn(sourceLocation, `${symbolName} could not be resolved to a singleton ptype`)
      }
      if (ptype) {
        return ptype
      }
    }
    const type = this.checker.getTypeAtLocation(node)
    if (node.kind === SyntaxKind.ThisKeyword || node.kind === SyntaxKind.SuperKeyword) {
      const [declaration] = type.symbol.declarations ?? []
      return this.resolve(declaration, sourceLocation)
    }
    return this.resolveType(type, sourceLocation)
  }

  resolveTypeNode(node: ts.TypeNode, sourceLocation: SourceLocation): PType {
    const type = this.checker.getTypeFromTypeNode(node)
    return this.resolveType(type, sourceLocation)
  }

  resolveType(tsType: ts.Type, sourceLocation: SourceLocation): PType {
    if (hasFlags(tsType.flags, ts.TypeFlags.Boolean)) {
      return boolPType
    }
    if (hasFlags(tsType.flags, ts.TypeFlags.Void)) {
      return voidPType
    }
    if (hasFlags(tsType.flags, ts.TypeFlags.String)) {
      return stringPType
    }
    if (hasFlags(tsType.flags, ts.TypeFlags.Unknown)) {
      throw new CodeError(`Type resolves to unknown`, { sourceLocation })
    }
    if (hasFlags(tsType.flags, ts.TypeFlags.Number) && tsType.getSymbol() === undefined) {
      return numberPType
    }
    const typeName = this.getTypeName(tsType, sourceLocation)

    if (typeName.fullName === StringFunction.fullName) return StringFunction

    if (tsType.isClass()) {
      if (typeName.fullName === ContractType.fullName) return ContractType
      if (typeName.fullName === BaseContractType.fullName) return BaseContractType
      const [baseType, ...rest] = tsType.getBaseTypes()?.map((t) => this.resolveType(t, sourceLocation)) ?? []

      invariant(rest.length === 0, 'Class can have at most one base type')

      if (baseType instanceof ContractClassType) {
        return this.reflectContractType(typeName, tsType, baseType, sourceLocation)
      }
      throw new CodeError('Classes must extend "Contract" or "BaseContract" base classes to be considered a contract', { sourceLocation })
    }
    const callSignatures = this.checker.getSignaturesOfType(tsType, ts.SignatureKind.Call)
    if (callSignatures.length) {
      return this.reflectFunctionType(typeName, callSignatures, sourceLocation)
    }

    if (tsType.aliasTypeArguments?.length) {
      const typeArgs = tsType.aliasTypeArguments.map((a) => this.resolveType(a, sourceLocation))
      return typeRegistry.resolveGenericPType(typeName, typeArgs, sourceLocation)
    } else {
      return typeRegistry.resolveInstancePType(typeName, sourceLocation)
    }
  }

  private reflectFunctionType(typeName: SymbolName, callSignatures: readonly ts.Signature[], sourceLocation: SourceLocation): FunctionType {
    if (typeName.fullName === ApprovalProgram.fullName) return ApprovalProgram
    if (typeName.fullName === ClearStateProgram.fullName) return ClearStateProgram

    codeInvariant(callSignatures.length === 1, 'User defined functions must have exactly 1 call signature')
    const [sig] = callSignatures
    const returnType = this.resolveType(sig.getReturnType(), sourceLocation)
    const parameters = sig.getParameters().map((p) => {
      const paramType = this.checker.getTypeOfSymbol(p)
      return this.resolveType(paramType, sourceLocation)
    })
    return new FunctionType({
      returnType,
      parameters,
      name: typeName.name,
      module: typeName.module,
    })
  }

  private reflectContractType(
    typeName: SymbolName,
    tsType: ts.Type,
    baseType: ContractClassType,
    sourceLocation: SourceLocation,
  ): ContractClassType {
    const properties: Record<string, AppStorageType> = {}
    const methods: Record<string, FunctionType> = {}
    for (const prop of tsType.getProperties()) {
      const type = this.checker.getTypeOfSymbol(prop)
      const ptype = this.resolveType(type, sourceLocation)
      if (ptype instanceof GlobalStateType) {
        properties[prop.name] = ptype
      } else if (ptype instanceof FunctionType) {
        methods[prop.name] = ptype
      } else {
        throw new InternalError(`Unhandled property type ${ptype}`, { sourceLocation })
      }
    }
    return new ContractClassType({
      properties,
      methods,
      name: typeName.name,
      module: typeName.module,
      baseType,
    })
  }

  private getTypeName(type: ts.Type, sourceLocation: SourceLocation): SymbolName {
    return this.getSymbolFullName(type.aliasSymbol ?? type.symbol, sourceLocation)
  }

  private getModuleName(declaration: ts.Declaration): string {
    const sourceFileName = declaration.getSourceFile().fileName
    const nodeModuleName = /node_modules\/(.*)$/.exec(sourceFileName)

    if (nodeModuleName) {
      return nodeModuleName[1]
    }
    return sourceFileName
  }

  private getSymbolFullName(symbol: ts.Symbol, sourceLocation: SourceLocation): SymbolName {
    const declaration = symbol?.declarations?.[0]
    if (declaration) {
      if (hasAnyFlag(symbol.flags, ts.SymbolFlags.Namespace) && !hasFlags(symbol.flags, ts.SymbolFlags.Function)) {
        return new SymbolName({
          module: this.getModuleName(declaration),
          name: '*',
        })
      }
      return new SymbolName({ module: this.getModuleName(declaration), name: symbol.name })
    }
    throw new InternalError(`Symbol does not have a declaration`, { sourceLocation })
  }
}
