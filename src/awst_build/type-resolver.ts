import ts, { ObjectFlags } from 'typescript'
import { SourceLocation } from '../awst/source-location'
import { Constants } from '../constants'
import { CodeError, InternalError } from '../errors'
import { logger } from '../logger'
import { codeInvariant, hasFlags, intersectsFlags, invariant, isIn, normalisePath } from '../util'
import { getNodeName } from '../visitor/syntax-names'
import type { AppStorageType, PType } from './ptypes'
import {
  anyGtxnType,
  anyPType,
  ApprovalProgram,
  arc4BaseContractType,
  ArrayPType,
  baseContractType,
  BigIntLiteralPType,
  bigIntPType,
  boolPType,
  ClearStateProgram,
  ClusteredContractClassType,
  ClusteredPrototype,
  ContractClassPType,
  FunctionPType,
  gtxnUnion,
  IntersectionPType,
  logicSigBaseType,
  LogicSigPType,
  NamespacePType,
  neverPType,
  nullPType,
  numberPType,
  NumericLiteralPType,
  ObjectPType,
  StorageProxyPType,
  stringPType,
  SuperPrototypeSelector,
  TuplePType,
  TypeParameterType,
  undefinedPType,
  UnionPType,
  unknownPType,
  voidPType,
} from './ptypes'
import { ARC4EncodedType, arc4StructBaseType, ARC4StructClass, ARC4StructType, UintNType } from './ptypes/arc4-types'
import { SymbolName } from './symbol-name'
import { typeRegistry } from './type-registry'

export class TypeResolver {
  constructor(
    private readonly checker: ts.TypeChecker,
    private readonly programDirectory: string,
  ) {}

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

  resolveTypeParameters(node: ts.CallExpression | ts.NewExpression, sourceLocation: SourceLocation) {
    if (node.typeArguments) {
      // Explicit type arguments
      return node.typeArguments.map((t) => this.resolveTypeNode(t, sourceLocation))
    }
    const sig = this.checker.getResolvedSignature(node)
    invariant(sig, 'CallExpression must resolve to a signature')
    /*
      The method getTypeArgumentsForResolvedSignature has not made it into typescript yet, but it has been
      proposed here: https://github.com/microsoft/TypeScript/issues/59637 and added to the backlog. For now
      the method has been patched into the TypeScript 5.7.2 using patch-package
     */
    const tps = this.checker.getTypeArgumentsForResolvedSignature(sig)
    return tps?.map((t) => this.resolveType(t, sourceLocation)) ?? []
  }

  resolve(node: ts.Node, sourceLocation: SourceLocation): PType {
    const symbol = this.getUnaliasedSymbolForNode(node)
    if (symbol !== undefined && symbol.declarations?.length) {
      const symbolName = symbol && this.getSymbolFullName(symbol, sourceLocation)
      if (symbolName.name === '*') {
        return new NamespacePType(symbolName)
      }
      const ptype = typeRegistry.tryResolveSingletonName(symbolName)
      if (ptype === undefined && symbolName.module.startsWith(Constants.algoTsPackage)) {
        /*
         Most symbols in the algo-ts module should resolve to a singleton instance
         This can probably be removed once we've implemented ptypes for everything in algo-ts

         */
        if (symbolName.fullName !== baseContractType.fullName && symbolName.fullName !== arc4BaseContractType.fullName)
          logger.warn(sourceLocation, `${symbolName} could not be resolved to a singleton ptype`)
      }
      if (ptype) {
        return ptype
      }
    }
    const type = this.checker.getTypeAtLocation(node)
    if (node.kind === ts.SyntaxKind.ThisKeyword || node.kind === ts.SyntaxKind.SuperKeyword) {
      /**
       * This shouldn't be used in any code paths as `visitThisKeyword` and `visitSuperKeyword` have their own way to
       * determine the type.
       */
      logger.debug(sourceLocation, `Attempting to reflect type of ${getNodeName(node)} node which is known to be unreliable`)
    }
    if (ts.isConstructorDeclaration(node)) {
      const signature = this.checker.getSignatureFromDeclaration(node)
      invariant(signature, 'Constructor node must have call signature')
      const parentType = this.getTypeName(this.checker.getTypeAtLocation(node.parent), sourceLocation)
      return this.reflectFunctionType(
        new SymbolName({
          name: Constants.symbolNames.constructorMethodName,
          module: parentType.module,
        }),
        [signature],
        sourceLocation,
      )
    }
    return this.resolveType(type, sourceLocation)
  }

  resolveTypeNode(node: ts.TypeNode, sourceLocation: SourceLocation): PType {
    const type = this.checker.getTypeFromTypeNode(node)
    return this.resolveType(type, sourceLocation)
  }

  resolveType(tsType: ts.Type, sourceLocation: SourceLocation): PType {
    if (tsType.symbol) {
      const symbolType = this.checker.getTypeOfSymbol(tsType.symbol)
      if (symbolType !== tsType && !tsType.isClass() && symbolType.isClass()) {
        tsType = symbolType
      }
    }

    intersect: if (isIntersectionType(tsType)) {
      if (tsType.aliasSymbol) {
        break intersect
      }
      // Special handling of struct base types which are an intersection of `StructBase` and the generic `T` type
      const parts = tsType.types.map((t) => this.resolveType(t, sourceLocation))
      if (parts.some((p) => p.equals(arc4StructBaseType))) {
        return arc4StructBaseType
      } else {
        return IntersectionPType.fromTypes(parts)
      }
    }
    if (isUnionType(tsType)) {
      const ut = UnionPType.fromTypes(tsType.types.map((t) => this.resolveType(t, sourceLocation)))
      if (ut.equals(gtxnUnion)) {
        return anyGtxnType
      }
      return ut
    }
    switch (tsType.flags) {
      case ts.TypeFlags.Undefined:
        return undefinedPType
      case ts.TypeFlags.Null:
        return nullPType
      case ts.TypeFlags.Any:
        return anyPType
      case ts.TypeFlags.Boolean | ts.TypeFlags.Union:
      case ts.TypeFlags.BooleanLiteral:
        return boolPType
      case ts.TypeFlags.Void:
        return voidPType
      case ts.TypeFlags.String:
      case ts.TypeFlags.StringLiteral:
        return stringPType
      case ts.TypeFlags.Never:
        return neverPType
      case ts.TypeFlags.Unknown:
        return unknownPType
      case ts.TypeFlags.NumberLiteral | ts.TypeFlags.EnumLiteral:
      case ts.TypeFlags.NumberLiteral:
        invariant(tsType.isNumberLiteral(), 'type must be literal', sourceLocation)
        return new NumericLiteralPType({ literalValue: BigInt(tsType.value) })
      case ts.TypeFlags.Number:
        return numberPType
      case ts.TypeFlags.BigIntLiteral:
        invariant(tsType.isLiteral() && typeof tsType.value === 'object', 'type must be literal bigint', sourceLocation)
        return new BigIntLiteralPType({ literalValue: BigInt(tsType.value.base10Value) * (tsType.value.negative ? -1n : 1n) })
      case ts.TypeFlags.BigInt:
        return bigIntPType
    }
    if (isTupleReference(tsType)) {
      codeInvariant(
        tsType.target.fixedLength !== undefined && tsType.target.fixedLength !== null,
        'Tuple types should have a fixed length',
        sourceLocation,
      )
      codeInvariant(tsType.typeArguments, 'Tuple items must have types', sourceLocation)

      return new TuplePType({
        items: tsType.typeArguments.map((t) => this.resolveType(t, sourceLocation)),
      })
    }
    if (isInstantiationExpression(tsType)) {
      return this.resolve(tsType.node.expression, sourceLocation)
    }

    const typeName = this.getTypeName(tsType, sourceLocation)
    logger.debug(sourceLocation, `Resolving ptype for ${typeName}`)

    if (typeName.name === '__type' && typeName.module.startsWith(Constants.algoTsPackage)) {
      // We are likely dealing with `typeof X` where X is a singleton exported by algo-ts
      const declarationNode = tsType.symbol.getDeclarations()?.[0]?.parent

      if (declarationNode && ts.isVariableDeclaration(declarationNode)) {
        return this.resolve(declarationNode.name, sourceLocation)
      }
    }

    if (typeName.fullName === arc4StructBaseType.fullName) return arc4StructBaseType
    if (typeName.fullName === ClusteredPrototype.fullName) {
      return this.resolveClusteredPrototype(tsType, sourceLocation)
    }

    if (tsType.flags === ts.TypeFlags.TypeParameter) {
      return new TypeParameterType(typeName)
    }

    if (tsType.aliasTypeArguments?.length) {
      const typeArgs = tsType.aliasTypeArguments.map((a) => this.resolveType(a, sourceLocation))
      const gt = typeRegistry.tryResolveGenericPType(typeName, typeArgs)
      if (gt) return gt
    } else if (isTypeReference(tsType) && tsType.typeArguments?.length) {
      const typeArgs = tsType.typeArguments.map((a) => this.resolveType(a, sourceLocation))
      const gt = typeRegistry.tryResolveGenericPType(typeName, typeArgs)
      if (gt) return gt
    } else {
      const it = typeRegistry.tryResolveInstancePType(typeName)
      if (it) return it
    }

    if (tsType.getConstructSignatures().length) {
      return this.reflectConstructorType(tsType, sourceLocation)
    }

    if (tsType.isClass()) {
      if (typeName.fullName === arc4BaseContractType.fullName) return arc4BaseContractType
      if (typeName.fullName === baseContractType.fullName) return baseContractType
      if (typeName.fullName === logicSigBaseType.fullName) return logicSigBaseType

      const [baseType, ...rest] = tsType.getBaseTypes()?.map((t) => this.resolveType(t, sourceLocation)) ?? []

      invariant(rest.length === 0, 'Class can have at most one base type')

      // Treat sub-types of UintN type as the base type.
      if (baseType instanceof UintNType) return baseType

      if (baseType instanceof ContractClassPType) {
        return this.reflectContractType(typeName, tsType, baseType, sourceLocation)
      }
      if (baseType instanceof ARC4StructType) {
        return this.reflectStructType(typeName, tsType, baseType, sourceLocation)
      }
      if (baseType instanceof LogicSigPType) {
        return new LogicSigPType({
          ...typeName,
          sourceLocation,
          baseType,
        })
      }
      throw new CodeError(
        `${typeName.fullName} cannot be mapped to an algo ts type. Classes must extend "Contract" or "BaseContract" base classes to be considered a contract`,
        { sourceLocation },
      )
    }
    const callSignatures = this.checker.getSignaturesOfType(tsType, ts.SignatureKind.Call)
    if (callSignatures.length) {
      return this.reflectFunctionType(typeName, callSignatures, sourceLocation)
    }
    if (this.checker.isArrayType(tsType)) {
      const itemType = tsType.getNumberIndexType()
      if (!itemType) {
        throw new CodeError('Cannot determine array item type', { sourceLocation })
      } else {
        const itemPType = this.resolveType(itemType, sourceLocation)
        return new ArrayPType({
          elementType: itemPType,
        })
      }
    }
    if (isObjectType(tsType)) {
      return this.reflectObjectType(tsType, sourceLocation)
    }
    throw new InternalError(`Cannot determine type of ${typeName}`, { sourceLocation })
  }

  private reflectObjectType(tsType: ts.Type, sourceLocation: SourceLocation): ObjectPType {
    const typeAlias = tsType.aliasSymbol ? this.getSymbolFullName(tsType.aliasSymbol, sourceLocation) : undefined
    const properties: Record<string, PType> = {}
    for (const prop of tsType.getProperties()) {
      if (prop.name.startsWith('__@')) {
        // Symbol property - ignore
        // TODO: Check AST nodes to confirm?
        continue
      }
      const type = this.checker.getTypeOfSymbol(prop)
      const ptype = this.resolveType(type, sourceLocation)
      if (ptype.singleton) {
        logger.error(sourceLocation, `${ptype} is not a valid object property type`)
      } else {
        properties[prop.name] = ptype
      }
    }
    if (typeAlias) {
      return new ObjectPType({ alias: typeAlias, properties, description: tryGetTypeDescription(tsType) })
    }
    return ObjectPType.anonymous(properties)
  }

  private reflectConstructorType(tsType: ts.Type, sourceLocation: SourceLocation): PType {
    const constructorSignatures = tsType.getConstructSignatures()
    invariant(constructorSignatures.length, 'Must have at least one signature')
    const typeDeclaration = tsType.getSymbol()?.declarations?.[0]
    if (typeDeclaration && ts.isClassDeclaration(typeDeclaration)) {
      const ptype = this.resolve(typeDeclaration, sourceLocation)
      if (ptype instanceof ARC4StructType) {
        return ARC4StructClass.fromStructType(ptype)
      } else if (ptype instanceof ContractClassPType || ptype instanceof LogicSigPType) {
        return ptype
      }
    }
    throw new CodeError('Unable to reflect constructor type', { sourceLocation })
  }

  private reflectFunctionType(
    typeName: SymbolName,
    callSignatures: readonly ts.Signature[],
    sourceLocation: SourceLocation,
  ): FunctionPType {
    if (typeName.fullName === ApprovalProgram.fullName) return ApprovalProgram
    if (typeName.fullName === ClearStateProgram.fullName) return ClearStateProgram

    codeInvariant(callSignatures.length === 1, 'User defined functions must have exactly 1 call signature', sourceLocation)
    const [sig] = callSignatures
    const returnType = this.resolveType(sig.getReturnType(), sourceLocation)
    const parameters = sig.getParameters().map((p) => {
      const paramType = this.checker.getTypeOfSymbol(p)
      return [p.name, this.resolveType(paramType, this.getLocationOfSymbol(p) ?? sourceLocation)] as const
    })
    return new FunctionPType({
      returnType,
      parameters,
      name: typeName.name,
      module: typeName.module,
      sourceLocation,
    })
  }

  private reflectStructType(
    typeName: SymbolName,
    tsType: ts.Type,
    baseType: ARC4StructType,
    sourceLocation: SourceLocation,
  ): ARC4StructType {
    const ignoredProps = ['bytes', 'equals', 'native', 'copy', Constants.symbolNames.constructorMethodName]
    const fields: Record<string, ARC4EncodedType> = {}
    for (const prop of tsType.getProperties()) {
      if (isIn(prop.name, ignoredProps)) continue
      const type = this.checker.getTypeOfSymbol(prop)
      const propLocation = this.getLocationOfSymbol(prop) ?? sourceLocation
      const ptype = this.resolveType(type, propLocation)
      if (ptype instanceof ARC4EncodedType) {
        fields[prop.name] = ptype
      } else {
        // Ignore
      }
    }
    return new ARC4StructType({
      ...typeName,
      fields: fields,
      sourceLocation: sourceLocation,
      description: tryGetTypeDescription(tsType),
      frozen: baseType.frozen,
    })
  }

  private reflectContractType(
    typeName: SymbolName,
    tsType: ts.Type,
    baseType: ContractClassPType,
    sourceLocation: SourceLocation,
  ): ContractClassPType {
    const properties: Record<string, AppStorageType> = {}
    const methods: Record<string, FunctionPType> = {}

    for (const prop of tsType.getProperties()) {
      const type = this.checker.getTypeOfSymbol(prop)
      const ptype = this.resolveType(type, this.getLocationOfSymbol(prop) ?? sourceLocation)
      if (ptype instanceof StorageProxyPType) {
        properties[prop.name] = ptype
      } else if (ptype instanceof FunctionPType) {
        methods[prop.name] = ptype
      }
    }
    return new ContractClassPType({
      properties,
      methods,
      name: typeName.name,
      module: typeName.module,
      baseTypes: [baseType],
      sourceLocation,
    })
  }

  private resolveClusteredPrototype(tsType: ts.Type, sourceLocation: SourceLocation): PType {
    invariant(isIntersectionType(tsType), 'Clustered prototypes must be an intersection type')
    const baseContracts: ContractClassPType[] = []
    for (const t of tsType.types.map((t) => this.resolveType(t, sourceLocation))) {
      if (t instanceof ContractClassPType) {
        baseContracts.push(t)
      } else if (t instanceof SuperPrototypeSelector) {
        // Ignore for now
      } else {
        throw new CodeError(
          `Unexpected type: ${t}. Polytype can only be used to support multiple inheritance in contracts for now. All base types must extend the Contract or BaseContract class.}`,
        )
      }
    }
    return new ClusteredContractClassType({
      methods: {},
      baseTypes: baseContracts,
      sourceLocation,
    })
  }

  private getTypeName(type: ts.Type, sourceLocation: SourceLocation): SymbolName {
    if (type.aliasSymbol) {
      const name = this.getSymbolFullName(type.aliasSymbol, sourceLocation)
      // We only respect type aliases within certain modules, otherwise use the
      // unaliased symbol
      if (name.module.startsWith(Constants.algoTsPackage) || name.module === Constants.moduleNames.polytype) return name
    }
    invariant(type.symbol, 'Type must have a symbol', sourceLocation)
    return this.getSymbolFullName(type.symbol, sourceLocation)
  }

  private getLocationOfSymbol(symbol: ts.Symbol): SourceLocation | undefined {
    const declaration = symbol.getDeclarations()?.[0]

    return declaration && SourceLocation.fromNode(declaration, this.programDirectory)
  }

  private tryGetLocalSymbolName(symbol: ts.Symbol): string | undefined {
    const dec = symbol.getDeclarations()?.[0] as undefined | { localSymbol?: ts.Symbol }
    return dec?.localSymbol?.name
  }

  private getSymbolFullName(symbol: ts.Symbol, sourceLocation: SourceLocation): SymbolName {
    const symbolName = symbol.name === 'default' ? (this.tryGetLocalSymbolName(symbol) ?? symbol.name) : symbol.name

    const declaration = symbol?.declarations?.[0]
    if (declaration) {
      if (
        intersectsFlags(symbol.flags, ts.SymbolFlags.Namespace) &&
        !intersectsFlags(symbol.flags, ts.SymbolFlags.Function | ts.SymbolFlags.RegularEnum)
      ) {
        return new SymbolName({
          module: normalisePath(declaration.getSourceFile().fileName, this.programDirectory),
          name: '*',
        })
      }
      return new SymbolName({ module: normalisePath(declaration.getSourceFile().fileName, this.programDirectory), name: symbolName })
    }
    throw new InternalError(`Symbol does not have a declaration`, { sourceLocation })
  }
}

function isObjectType(tsType: ts.Type): tsType is ts.ObjectType {
  return hasFlags(tsType.flags, ts.TypeFlags.Object)
}
function isTypeReference(tsType: ts.Type): tsType is ts.TypeReference {
  return isObjectType(tsType) && hasFlags(tsType.objectFlags, ts.ObjectFlags.Reference)
}
function isTupleType(tsType: ts.Type): tsType is ts.TupleType {
  return isObjectType(tsType) && hasFlags(tsType.objectFlags, ts.ObjectFlags.Tuple)
}

function isTupleReference(tsType: ts.Type): tsType is ts.TypeReference & { target: ts.TupleType } {
  return isTypeReference(tsType) && isTupleType(tsType.target)
}

function isUnionType(tsType: ts.Type): tsType is ts.UnionType {
  return tsType.flags === ts.TypeFlags.Union
}

function isIntersectionType(tsType: ts.Type): tsType is ts.IntersectionType {
  return tsType.flags === ts.TypeFlags.Intersection
}

function isInstantiationExpression(tsType: ts.Type): tsType is ts.Type & { node: ts.ExpressionWithTypeArguments } {
  return isObjectType(tsType) && hasFlags(tsType.objectFlags, ObjectFlags.InstantiationExpressionType)
}

function tryGetTypeDescription(tsType: ts.Type): string | undefined {
  const dec = tsType.aliasSymbol?.valueDeclaration ?? tsType.symbol.valueDeclaration
  if (!dec) return undefined
  const docs = ts.getJSDocCommentsAndTags(dec)
  for (const doc of docs) {
    if (ts.isJSDoc(doc)) {
      return ts.getTextOfJSDocComment(doc.comment)
    }
  }
  return undefined
}
