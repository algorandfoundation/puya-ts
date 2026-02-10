import ts, { ObjectFlags } from 'typescript'
import { SourceLocation } from '../awst/source-location'
import { Constants } from '../constants'
import { CodeError, InternalError } from '../errors'
import { logger } from '../logger'
import type { DeliberateAny } from '../typescript-helpers'
import { codeInvariant, extractModuleName, hasFlags, instanceOfAny, intersectsFlags, invariant, isIn } from '../util'
import type { AbsolutePath } from '../util/absolute-path'
import { getNodeName } from '../visitor/syntax-names'
import type { AppStorageType, PType } from './ptypes'
import {
  anyGtxnType,
  anyPType,
  ApprovalProgram,
  arc4BaseContractType,
  baseContractType,
  BigIntLiteralPType,
  bigIntPType,
  boolPType,
  BoxMapPType,
  BoxPType,
  ClearStateProgram,
  ClusteredContractClassType,
  ClusteredPrototype,
  ContractClassPType,
  esSymbol,
  FunctionPType,
  GlobalStateType,
  GroupTransactionPType,
  ImmutableObjectPType,
  LocalStateType,
  logicSigBaseType,
  LogicSigPType,
  MutableObjectPType,
  MutableTuplePType,
  NamespacePType,
  neverPType,
  nullPType,
  numberPType,
  NumericLiteralPType,
  ReadonlyTuplePType,
  stringPType,
  SuperPrototypeSelector,
  TypeParameterType,
  Uint64EnumMemberType,
  Uint64EnumType,
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
    private readonly programDirectory: AbsolutePath,
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

  resolveTypeParameters(node: ts.CallExpression | ts.NewExpression | ts.TaggedTemplateExpression, sourceLocation: SourceLocation) {
    if (node.typeArguments) {
      // Explicit type arguments
      return node.typeArguments.map((t) => this.resolveTypeNode(t, sourceLocation))
    }
    const sig = this.checker.getResolvedSignature(node)
    invariant(sig, 'CallExpression must resolve to a signature')
    const tps = this.checker.getTypeArgumentsForResolvedSignature(sig)
    return tps?.map((t) => this.resolveType(t, sourceLocation)) ?? []
  }

  resolve(node: ts.Node, sourceLocation: SourceLocation): PType {
    const symbol = this.getUnaliasedSymbolForNode(node)
    if (symbol !== undefined && symbol.declarations?.length) {
      const symbolName = symbol && this.getSymbolFullName(symbol, sourceLocation)
      invariant(symbolName, 'Symbol should have name as we pre-checked it has a declaration', sourceLocation)
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
      invariant(signature, 'Constructor node must have call signature', sourceLocation)
      const parentType = this.getTypeName(this.checker.getTypeAtLocation(node.parent), sourceLocation)
      invariant(parentType, 'Parent type must have name', sourceLocation)
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

  @CacheResolvedType
  resolveType(tsType: ts.Type, sourceLocation: SourceLocation): PType {
    const typeName = this.getTypeName(tsType, sourceLocation)

    if (isUnionType(tsType)) {
      const ut = UnionPType.fromTypes(tsType.types.map((t) => this.resolveType(t, sourceLocation)))
      if (ut instanceof UnionPType) {
        const [first] = ut.types
        if (ut.types.every((t) => t instanceof GroupTransactionPType)) {
          // We can support unions of group transactions since the underlying wtype is just a uint64 value and the
          // transaction _type_ can be discriminated with the .type property
          // I don't _think_ there's any value in retaining which txn types constitute the union at the ptype level
          return anyGtxnType
        } else if (
          first instanceof Uint64EnumMemberType &&
          ut.types.every((t) => t instanceof Uint64EnumMemberType && t.enumType.equals(first.enumType))
        ) {
          // A union of enum members can be widened to the member type
          return first.enumType.memberType
        }
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
        invariant(tsType.isNumberLiteral(), 'type must be literal', sourceLocation)
        return (
          this.tryResolveLiteralToEnumMember(tsType, BigInt(tsType.value), sourceLocation) ??
          new NumericLiteralPType({ literalValue: BigInt(tsType.value) })
        )
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
      case ts.TypeFlags.ESSymbol:
      case ts.TypeFlags.UniqueESSymbol:
        return esSymbol
      case ts.TypeFlags.TypeParameter:
        codeInvariant(typeName, 'Type parameters must have a name', sourceLocation)
        return new TypeParameterType(typeName)
    }
    if (isTupleReference(tsType)) {
      codeInvariant(
        tsType.target.fixedLength !== undefined && tsType.target.fixedLength !== null,
        'Tuple types should have a fixed length',
        sourceLocation,
      )
      codeInvariant(tsType.typeArguments, 'Tuple items must have types', sourceLocation)
      const items = tsType.typeArguments.map((t) => this.resolveType(t, sourceLocation))
      if (tsType.target.readonly) {
        return new ReadonlyTuplePType({ items })
      } else {
        return new MutableTuplePType({ items })
      }
    }
    if (isInstantiationExpression(tsType)) {
      return this.resolve(tsType.node.expression, sourceLocation)
    }

    if (typeName) {
      if (typeName.name === '__type' && typeName.module.startsWith(Constants.algoTsPackage)) {
        // We are likely dealing with `typeof X` where X is a singleton exported by algo-ts
        const declarationNode = tsType.symbol.getDeclarations()?.[0]?.parent

        if (declarationNode && ts.isVariableDeclaration(declarationNode)) {
          return this.resolve(declarationNode.name, sourceLocation)
        }
      }

      switch (typeName.fullName) {
        case arc4StructBaseType.fullName:
          return arc4StructBaseType
        case ClusteredPrototype.fullName:
          return this.resolveClusteredPrototype(tsType, sourceLocation)
      }

      const typeArgs = this.tryResolveGenericTypeArgs(tsType, sourceLocation)
      if (typeArgs?.length) {
        const gt = typeRegistry.tryResolveGenericPType(typeName, typeArgs)
        if (gt) return gt
      } else {
        const it = typeRegistry.tryResolveInstancePType(typeName)
        if (it) return it
      }

      if (typeName.module.startsWith('typescript/lib')) {
        throw new CodeError(`${typeName.name} is not supported`, { sourceLocation })
      }
    }

    if (isIntersectionType(tsType)) {
      // Special handling of struct and mutable object base types which are an intersection of `StructBase` or `MutableObjectBase` and the generic `T` type
      const parts = tsType.types.map((t) => this.resolveType(t, sourceLocation))
      if (parts.some((p) => p.equals(arc4StructBaseType))) {
        return arc4StructBaseType
      }
      throw new CodeError('unsupported type intersection', { sourceLocation })
    }

    invariant(typeName, 'Non builtin type must have a name', sourceLocation)

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
    if (isObjectType(tsType)) {
      return this.reflectObjectType(tsType, sourceLocation)
    }
    throw new InternalError(`Cannot determine type of ${typeName}`, { sourceLocation })
  }

  private tryResolveGenericTypeArgs(tsType: ts.Type, sourceLocation: SourceLocation) {
    if (tsType.aliasTypeArguments?.length) {
      return tsType.aliasTypeArguments.map((a) => this.resolveType(a, sourceLocation))
    } else if (isTypeReference(tsType) && tsType.typeArguments?.length) {
      return tsType.typeArguments.map((a) => this.resolveType(a, sourceLocation))
    } else if (hasTypeReferenceTarget(tsType) && 'mapper' in tsType) {
      /*
      Dodgy code alert!!
      If an alias closes a generic parameter for example by doing `type B32 = bytes<32>` the current type won't have
      typeArguments and the target type will have unresolved type arguments (ie. a type param TLength). The mapper
      object contains the information needed to fill these type arguments but the logic to extract this information is
      internal. getTypeArgumentsForResolvedSignature 'exposes' this logic for the purpose of retrieving inferred type
      params in a function signature - we're doing a dodgy here and passing in a mock signature object with only the
      required properties set.
       */
      return this.checker
        .getTypeArgumentsForResolvedSignature({
          typeParameters: tsType.target.aliasTypeArguments,
          mapper: tsType.mapper,
        } as DeliberateAny)
        ?.map((t) => this.resolveType(t, sourceLocation))
    }
  }

  /**
   * Given a literal value with a named symbol, check its parent to see if it's actually an enum member.
   *
   * @param tsType
   * @param literalValue
   * @param sourceLocation
   * @private
   *
   * @remarks
   * Given an enum `enum E { A = 0, B = 1 }`, E. A will resolve to the literal `0`, but it is more useful to know that
   * it is E.A
   */
  private tryResolveLiteralToEnumMember(tsType: ts.Type, literalValue: bigint, sourceLocation: SourceLocation) {
    const memberDeclaration = tsType.symbol?.declarations?.[0]
    if (!memberDeclaration || !ts.isEnumMember(memberDeclaration)) return undefined

    const parentType = this.resolve(memberDeclaration.parent.name, sourceLocation)
    if (parentType instanceof Uint64EnumType) {
      return parentType.getMemberLiteral(literalValue)
    }
  }

  private reflectObjectType(tsType: ts.Type, sourceLocation: SourceLocation): ImmutableObjectPType | MutableObjectPType {
    const typeAlias = tsType.aliasSymbol ? this.getSymbolFullName(tsType.aliasSymbol, sourceLocation) : undefined
    const properties: Record<string, PType> = {}

    let expectReadonly: boolean | undefined = undefined
    for (const prop of tsType.getProperties()) {
      if (prop.name.startsWith('__@')) {
        // Symbol property - ignore
        // TODO: Check AST nodes to confirm?
        continue
      }
      const type = this.checker.getTypeOfSymbol(prop)
      const propLocation = this.getLocationOfSymbol(prop) ?? sourceLocation
      const readonly = isReadonlyPropertySymbol(prop)
      if (expectReadonly === undefined) expectReadonly = readonly
      if (expectReadonly !== readonly) {
        const correction = expectReadonly
          ? 'Add a readonly modifier to this property, or remove it from all others'
          : 'Remove the readonly modifier from this property, or add it all others'
        logger.error(propLocation, `All properties of a type must share the same readonly annotation. ${correction}`)
      }
      const ptype = this.resolveType(type, propLocation)
      if (ptype instanceof FunctionPType) {
        logger.error(propLocation, `Invalid object property type. Functions are not supported`)
      } else if (ptype.singleton) {
        logger.error(propLocation, `Invalid object property type. ${ptype} is not supported`)
      } else {
        properties[prop.name] = ptype
      }
    }
    if (expectReadonly) {
      return new ImmutableObjectPType({ alias: typeAlias, properties, description: tryGetTypeDescription(tsType) })
    } else {
      return new MutableObjectPType({ alias: typeAlias, properties, description: tryGetTypeDescription(tsType) })
    }
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
    let declaredIn: SymbolName | undefined = undefined
    const declaredInNode = sig.declaration?.parent
    if (declaredInNode && ts.isClassDeclaration(declaredInNode)) {
      const declaredInType = this.checker.getTypeAtLocation(declaredInNode)
      declaredIn = this.getTypeName(declaredInType, sourceLocation)
    }

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
      declaredIn,
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
      // ignore stuff from multiple base classes... this is a simpler implementation of current behaviour, but not sure it's desirable dawg
      if (!type.isIntersection()) {
        const ptype = this.resolveType(type, this.getLocationOfSymbol(prop) ?? sourceLocation)
        if (instanceOfAny(ptype, GlobalStateType, LocalStateType, BoxPType, BoxMapPType)) {
          properties[prop.name] = ptype
        } else if (ptype instanceof FunctionPType) {
          methods[prop.name] = ptype
        }
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

  getTypeName(type: ts.Type, sourceLocation: SourceLocation): SymbolName | undefined {
    const typeName = type.symbol ? this.getSymbolFullName(type.symbol, sourceLocation) : undefined
    const aliasName = type.aliasSymbol ? this.getSymbolFullName(type.aliasSymbol, sourceLocation) : undefined

    // If the alias was defined in algo-ts, polytype, or typescript, respect the alias
    if (
      aliasName?.module.startsWith(Constants.algoTsPackage) ||
      aliasName?.module === Constants.moduleNames.polytype ||
      aliasName?.module.startsWith(Constants.moduleNames.typescript.es5)
    ) {
      return aliasName
    }
    // If the type refers to a type literal in algo-ts or polytype, attempt to resolve the alias
    if (typeName?.module.startsWith(Constants.algoTsPackage) || typeName?.module === Constants.moduleNames.polytype) {
      if (typeName?.name === '__type') {
        const parentDeclaration = type.symbol.declarations?.[0]?.parent
        if (parentDeclaration && ts.isTypeAliasDeclaration(parentDeclaration)) {
          const name = this.getUnaliasedSymbolForNode(parentDeclaration.name)
          if (name) {
            return this.getSymbolFullName(name, sourceLocation)
          }
        }
      }
    }
    return typeName
  }

  private getLocationOfSymbol(symbol: ts.Symbol): SourceLocation | undefined {
    const declaration = symbol.getDeclarations()?.[0]

    return declaration && SourceLocation.fromNode(declaration, this.programDirectory)
  }

  private tryGetLocalSymbolName(symbol: ts.Symbol): string | undefined {
    const dec = symbol.getDeclarations()?.[0] as undefined | { localSymbol?: ts.Symbol }
    return dec?.localSymbol?.name
  }

  private getSymbolFullName(symbol: ts.Symbol, sourceLocation: SourceLocation): SymbolName | undefined {
    const symbolName = symbol.name === 'default' ? (this.tryGetLocalSymbolName(symbol) ?? symbol.name) : symbol.name

    const declaration = symbol?.declarations?.[0]
    if (declaration) {
      if (
        intersectsFlags(symbol.flags, ts.SymbolFlags.Namespace) &&
        !intersectsFlags(symbol.flags, ts.SymbolFlags.Function | ts.SymbolFlags.RegularEnum)
      ) {
        return new SymbolName({
          module: extractModuleName(declaration.getSourceFile().fileName, this.programDirectory),
          name: '*',
        })
      }
      return new SymbolName({ module: extractModuleName(declaration.getSourceFile().fileName, this.programDirectory), name: symbolName })
    }
    return undefined
  }
}

function isObjectType(tsType: ts.Type): tsType is ts.ObjectType {
  return hasFlags(tsType.flags, ts.TypeFlags.Object)
}
function isTypeReference(tsType: ts.Type): tsType is ts.TypeReference {
  return isObjectType(tsType) && hasFlags(tsType.objectFlags, ts.ObjectFlags.Reference)
}

/**
 * The type may not have ts.ObjectFlags.Reference set, but it does have a target property
 * @param tsType
 */
function hasTypeReferenceTarget(tsType: ts.Type): tsType is ts.Type & Pick<ts.TypeReference, 'target'> {
  return isObjectType(tsType) && 'target' in tsType
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

function isTransientPropertySymbol(prop: ts.Symbol): prop is ts.Symbol & { links: { checkFlags: number } } {
  return hasFlags(prop.flags, ts.SymbolFlags.Transient)
}

function isReadonlyPropertySymbol(prop: ts.Symbol): boolean {
  /*
   * Here be dragons!! We're poking into the internal API here to check if the transient property symbol (ie a symbol created during type checking)
   * has been marked with the check flag of readonly (8). CheckFlags is not exported so we have no way to confirm CheckFlags. Readonly is still 8
   */
  if (isTransientPropertySymbol(prop) && hasFlags(prop.links.checkFlags, 8)) {
    return true
  }
  return (
    prop.declarations?.some((d) => ts.isPropertySignature(d) && d.modifiers?.some((m) => m.kind === ts.SyntaxKind.ReadonlyKeyword)) ?? false
  )
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

function CacheResolvedType(resolveType: (this: TypeResolver, tsType: ts.Type, sourceLocation: SourceLocation) => PType) {
  const resolvedTypes = new WeakMap<ts.Type, PType>()
  return function (this: TypeResolver, tsType: ts.Type, sourceLocation: SourceLocation): PType {
    const existing = resolvedTypes.get(tsType)
    if (existing) return existing

    const res = resolveType.call(this, tsType, sourceLocation)
    resolvedTypes.set(tsType, res)
    return res
  }
}
