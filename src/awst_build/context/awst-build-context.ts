import ts from 'typescript'
import type { awst } from '../../awst'
import type { ContractReference, LogicSigReference } from '../../awst/models'
import { nodeFactory } from '../../awst/node-factory'
import type { AppStorageDefinition, Constant } from '../../awst/nodes'
import { SourceLocation } from '../../awst/source-location'
import { CodeError } from '../../errors'
import { logger } from '../../logger'
import { codeInvariant, invariant } from '../../util'
import type { AppStorageDeclaration } from '../contract-data'
import type { NodeBuilder } from '../eb'
import type { Index, LogicSig } from '../models'
import { CompilationSet } from '../models'
import type { ContractClassPType, PType } from '../ptypes'
import { typeRegistry } from '../type-registry'
import { TypeResolver } from '../type-resolver'
import { EvaluationContext } from './evaluation-context'
import { SwitchLoopContext } from './switch-loop-context'
import { UniqueNameResolver } from './unique-name-resolver'

export interface AwstBuildContext {
  /**
   * Get the source location of a node in the current source file
   * @param node
   */
  getSourceLocation(node: ts.Node): SourceLocation

  /**
   * Get NodeBuilder instance for the given identifier.
   * @param node
   */
  getBuilderForNode(node: ts.Identifier): NodeBuilder

  /**
   * Reflect the PType of the given node
   * @param node
   */
  getPTypeForNode(node: ts.Node): PType

  /**
   * Reflect generic type parameters for a call expression
   * @param node
   */
  getTypeParameters(node: ts.CallExpression): PType[]

  /**
   * Resolve the given identifier to a unique variable name that accounts
   * for shadowed variable names.
   * @param node
   */
  resolveVariableName(node: ts.Identifier): string

  /**
   * Resolve the given parameter declaration to a unique parameter name to be used
   * in destructuring assignments where no explicit parameter name is available.
   * @param node
   */
  resolveDestructuredParamName(node: ts.ParameterDeclaration): string

  /**
   * Generate a unique variable name for a discarded value.
   */
  generateDiscardedVarName(): string

  /**
   * Add a named constant to the current context
   * @param name The unique name of the constant declaration in this source file
   * @param value The compile time constant value
   */
  addConstant(name: string, value: awst.Constant): void

  /**
   * Retrieve the evaluation context
   */
  get evaluationCtx(): EvaluationContext

  /**
   * Retrieve the switch loop context
   */
  get switchLoopCtx(): SwitchLoopContext

  /**
   * Create a child context from this context. Used when entering a child parsing context such as a class or function.
   */
  createChildContext(): AwstBuildContext

  addStorageDeclaration(declaration: AppStorageDeclaration): void

  getStorageDeclaration(contractType: ContractClassPType, memberName: string): AppStorageDeclaration | undefined

  getStorageDefinitionsForContract(contractType: ContractClassPType): AppStorageDefinition[]

  addToCompilationSet(compilationTarget: ContractReference, contract: Index): void
  addToCompilationSet(compilationTarget: LogicSigReference, logicSig: LogicSig): void

  get compilationSet(): CompilationSet
}

export function buildContextForProgram(program: ts.Program): AwstBuildContext {
  return AwstBuildContextImpl.forProgram(program)
}

class AwstBuildContextImpl implements AwstBuildContext {
  readonly evaluationCtx = new EvaluationContext()
  readonly switchLoopCtx = new SwitchLoopContext()
  readonly typeResolver: TypeResolver
  readonly typeChecker: ts.TypeChecker
  readonly #compilationSet: CompilationSet
  private constructor(
    public readonly program: ts.Program,
    private readonly constants: Map<string, awst.Constant>,
    private readonly nameResolver: UniqueNameResolver,
    private readonly storageDeclarations: Map<string, Map<string, AppStorageDeclaration>>,
    compilationSet: CompilationSet,
  ) {
    this.typeChecker = program.getTypeChecker()
    this.typeResolver = new TypeResolver(this.typeChecker, this.program.getCurrentDirectory())
    this.#compilationSet = compilationSet
  }

  static forProgram(program: ts.Program): AwstBuildContext {
    return new AwstBuildContextImpl(program, new Map(), new UniqueNameResolver(), new Map(), new CompilationSet())
  }

  addConstant(name: string, value: Constant) {
    if (this.constants.has(name)) {
      logger.error(new CodeError(`Duplicate definitions found for constant ${name}`, { sourceLocation: value.sourceLocation }))
      return
    }
    this.constants.set(name, value)
  }

  createChildContext(): AwstBuildContext {
    return new AwstBuildContextImpl(
      this.program,
      new Map(this.constants),
      this.nameResolver.createChild(),
      this.storageDeclarations,
      this.#compilationSet,
    )
  }

  resolveDestructuredParamName(node: ts.ParameterDeclaration) {
    const symbol = (node as { symbol?: ts.Symbol }).symbol
    invariant(symbol, 'Param node must have symbol')
    return this.nameResolver.resolveUniqueName('p', symbol)
  }
  generateDiscardedVarName() {
    return this.nameResolver.resolveUniqueName('_', undefined)
  }
  resolveVariableName(node: ts.Identifier) {
    codeInvariant(ts.isIdentifier(node), 'Only basic identifiers supported for now')
    const symbol = this.typeChecker.resolveName(node.text, node, ts.SymbolFlags.All, false)
    invariant(symbol, 'There must be a symbol for an identifier node')
    return this.nameResolver.resolveUniqueName(node.text, symbol)
  }

  getTypeParameters(node: ts.CallExpression): PType[] {
    return this.typeResolver.resolveTypeParameters(node, this.getSourceLocation(node))
  }

  getPTypeForNode(node: ts.Node): PType {
    const sourceLocation = this.getSourceLocation(node)
    if (ts.isTypeNode(node)) {
      return this.typeResolver.resolveTypeNode(node, sourceLocation)
    }
    return this.typeResolver.resolve(node, sourceLocation)
  }

  getBuilderForNode(node: ts.Identifier): NodeBuilder {
    const sourceLocation = this.getSourceLocation(node)
    const ptype = this.typeResolver.resolve(node, sourceLocation)

    if (ptype.singleton) {
      return typeRegistry.getSingletonEb(ptype, sourceLocation)
    }
    const variableName = this.resolveVariableName(node)
    const constantValue = this.constants.get(variableName)
    if (constantValue) {
      return typeRegistry.getInstanceEb(constantValue, ptype)
    }
    return typeRegistry.getInstanceEb(
      nodeFactory.varExpression({
        sourceLocation,
        name: variableName,
        wtype: ptype.wtypeOrThrow,
      }),
      ptype,
    )
  }

  getSourceLocation(node: ts.Node) {
    return SourceLocation.fromNode(node, this.program.getCurrentDirectory())
  }

  addStorageDeclaration(declaration: AppStorageDeclaration): void {
    const contractDeclarations = this.storageDeclarations.get(declaration.definedIn.fullName) ?? new Map()
    if (contractDeclarations.size === 0) {
      // Add to map if new
      this.storageDeclarations.set(declaration.definedIn.fullName, contractDeclarations)
    }
    if (contractDeclarations.has(declaration.memberName)) {
      logger.error(declaration.sourceLocation, `Duplicate declaration of member ${declaration.memberName} on ${declaration.definedIn}`)
    }
    contractDeclarations.set(declaration.memberName, declaration)
  }

  getStorageDeclaration(contractType: ContractClassPType, memberName: string): AppStorageDeclaration | undefined {
    const declaration = this.storageDeclarations.get(contractType.fullName)?.get(memberName)
    if (declaration) return declaration
    for (const baseType of contractType.baseTypes) {
      const baseDeclaration = this.getStorageDeclaration(baseType, memberName)
      if (baseDeclaration) return baseDeclaration
    }
    return undefined
  }

  getStorageDefinitionsForContract(contractType: ContractClassPType): AppStorageDefinition[] {
    const result = new Map<string, AppStorageDefinition>()
    for (const baseType of contractType.baseTypes) {
      for (const definition of this.getStorageDefinitionsForContract(baseType)) {
        if (result.has(definition.memberName)) {
          logger.error(
            definition.sourceLocation,
            `Redefinition of app storage member, original declared in ${result.get(definition.memberName)?.sourceLocation}`,
          )
        }
        result.set(definition.memberName, definition)
      }
    }
    const localDeclarations = this.storageDeclarations.get(contractType.fullName)
    if (localDeclarations) {
      for (const [member, declaration] of localDeclarations) {
        if (result.has(member)) {
          logger.error(
            declaration.sourceLocation,
            `Redefinition of app storage member, original declared in ${result.get(member)?.sourceLocation}`,
          )
        }
        result.set(member, declaration.definition)
      }
    }
    return Array.from(result.values())
  }

  addToCompilationSet(compilationTarget: ContractReference, contract: Index): void
  addToCompilationSet(compilationTarget: LogicSigReference, logicSig: LogicSig): void
  addToCompilationSet(compilationTarget: ContractReference | LogicSigReference, contractOrSig: Index | LogicSig) {
    if (this.#compilationSet.has(compilationTarget)) {
      logger.debug(undefined, `${compilationTarget.id} already exists in compilation set`)
      return
    }
    this.#compilationSet.set(compilationTarget, contractOrSig)
  }

  get compilationSet() {
    return this.#compilationSet
  }
}
