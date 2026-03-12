import { AsyncLocalStorage } from 'node:async_hooks'
import ts from 'typescript'
import type { ContractReference, LogicSigReference } from '../../awst/models'
import { nodeFactory } from '../../awst/node-factory'
import type { AppStorageDefinition, ARC4MethodConfig } from '../../awst/nodes'
import { SourceLocation } from '../../awst/source-location'
import { PuyaError } from '../../errors'
import { logger } from '../../logger'
import { invariant } from '../../util'
import { AbsolutePath } from '../../util/absolute-path'
import { DefaultMap } from '../../util/default-map'
import { ConstantStore } from '../constant-store'
import type { InstanceBuilder, NodeBuilder } from '../eb'
import type { AppStorageDeclaration } from '../models/app-storage-declaration'
import type { ContractClassModel } from '../models/contract-class-model'
import { CompilationSet } from '../models/contract-class-model'
import type { LogicSigClassModel } from '../models/logic-sig-class-model'
import type { ContractClassPType, PType } from '../ptypes'
import { arc4BaseContractType, baseContractType, ClusteredContractClassType } from '../ptypes'
import type { SymbolName } from '../symbol-name'
import { typeRegistry } from '../type-registry'
import { TypeResolver } from '../type-resolver'
import { EvaluationContext } from './evaluation-context'
import { SwitchLoopContext } from './switch-loop-context'
import { UniqueNameResolver } from './unique-name-resolver'
import type { CompileOptions } from '../../options'

export type BuildAwstOptions = Pick<CompileOptions, 'filePaths' | 'outputAwst' | 'outputAwstJson' | 'validateAbiReturn'>
export abstract class AwstBuildContext {
  /**
   * Get the source location of a node in the current source file
   * @param node
   */
  abstract getSourceLocation<TNode extends ts.Node>(node: TNode): SourceLocation<TNode>

  /**
   * Get NodeBuilder instance for the given identifier.
   * @param node
   */
  abstract getBuilderForNode(node: ts.Identifier): NodeBuilder

  /**
   * Reflect the PType of the given node
   * @param node
   */
  abstract getPTypeForNode(node: ts.Node): PType

  /**
   * Reflect generic type parameters for a call expression
   * @param node
   */
  abstract getTypeParameters(node: ts.CallExpression | ts.NewExpression | ts.TaggedTemplateExpression): PType[]

  /**
   * Resolve the given identifier to a unique variable name that accounts
   * for shadowed variable names.
   * @param node
   */
  abstract resolveVariableName(node: ts.Identifier): string

  /**
   * Resolve the given parameter declaration to a unique parameter name to be used
   * in destructuring assignments where no explicit parameter name is available.
   * @param node
   */
  abstract resolveDestructuredParamName(node: ts.ParameterDeclaration): string

  /**
   * Generate a unique variable name.
   *
   * discard: Used to consume an RValue that is not required
   * temp: Used to hold a temp assignment
   * @param purpose The purpose of the variable.
   */
  abstract generateVarName(purpose: 'discard' | 'temp'): string

  /**
   * Add a named constant to the current context
   * @param identifier The identifier of the constant declaration in this source file
   * @param builder The builder for the constant
   */
  abstract addConstant(identifier: ts.Identifier, builder: InstanceBuilder): void

  /**
   * Retrieve the evaluation context
   */
  abstract get evaluationCtx(): EvaluationContext

  /**
   * Retrieve the switch loop context
   */
  abstract get switchLoopCtx(): SwitchLoopContext
  abstract get options(): BuildAwstOptions

  abstract addStorageDeclaration(declaration: AppStorageDeclaration): void
  abstract addArc4Config(methodData: {
    contractReference: ContractReference
    sourceLocation: SourceLocation
    arc4MethodConfig: ARC4MethodConfig
    memberName: string
  }): void
  abstract registerContractType(contractType: ContractClassPType): void
  abstract getContractTypeByName(contractName: SymbolName): ContractClassPType | undefined
  abstract getArc4Config(contractType: ContractClassPType, memberName: string): ARC4MethodConfig | undefined
  abstract getArc4Config(contractType: ContractClassPType): ARC4MethodConfig[]

  abstract getStorageDeclaration(contractType: ContractClassPType, memberName: string): AppStorageDeclaration | undefined

  abstract getStorageDefinitionsForContract(contractType: ContractClassPType): AppStorageDefinition[]

  abstract addToCompilationSet(compilationTarget: ContractReference, contract: ContractClassModel): void
  abstract addToCompilationSet(compilationTarget: LogicSigReference, logicSig: LogicSigClassModel): void

  abstract get compilationSet(): CompilationSet

  protected abstract createChildContext(): AwstBuildContext

  static get current(): AwstBuildContext {
    const ctx = this.asyncStore.getStore()
    if (!ctx) {
      throw new Error('No context available!')
    }
    return ctx
  }

  private static asyncStore = new AsyncLocalStorage<AwstBuildContext>()

  static run<R>(program: ts.Program, options: BuildAwstOptions, cb: () => R) {
    const ctx = AwstBuildContextImpl.forProgram(program, options)

    return AwstBuildContext.asyncStore.run(ctx, cb)
  }

  runInChildContext<R>(cb: (deferred: RunDeferred) => R) {
    const childCtx = this.createChildContext()

    const runDeferred: RunDeferred = (action) => () => AwstBuildContext.asyncStore.run(childCtx, action)

    return AwstBuildContext.asyncStore.run(childCtx, () => cb(runDeferred))
  }
}

type RunDeferred = <T>(action: () => T) => () => T

class AwstBuildContextImpl extends AwstBuildContext {
  readonly evaluationCtx = new EvaluationContext()
  readonly switchLoopCtx = new SwitchLoopContext()
  readonly typeResolver: TypeResolver
  readonly typeChecker: ts.TypeChecker
  readonly #compilationSet: CompilationSet
  private constructor(
    public readonly program: ts.Program,
    public readonly options: BuildAwstOptions,
    private readonly constants: ConstantStore,
    private readonly nameResolver: UniqueNameResolver,
    private readonly storageDeclarations: DefaultMap<string, Map<string, AppStorageDeclaration>>,
    private readonly arc4MethodConfig: DefaultMap<string, Map<string, ARC4MethodConfig>>,
    private readonly contractTypes: Record<string, ContractClassPType>,
    compilationSet: CompilationSet,
  ) {
    super()
    this.typeChecker = program.getTypeChecker()
    this.typeResolver = new TypeResolver(this.typeChecker, AbsolutePath.resolve({ path: this.program.getCurrentDirectory() }))
    this.#compilationSet = compilationSet
  }

  registerContractType(contractType: ContractClassPType): void {
    this.contractTypes[contractType.fullName] = contractType
  }
  getContractTypeByName(contractName: SymbolName): ContractClassPType | undefined {
    return this.contractTypes[contractName.fullName]
  }

  addArc4Config({
    memberName,
    sourceLocation,
    contractReference,
    arc4MethodConfig,
  }: {
    contractReference: ContractReference
    sourceLocation: SourceLocation
    arc4MethodConfig: ARC4MethodConfig
    memberName: string
  }): void {
    const contractConfig = this.arc4MethodConfig.getOrDefault(contractReference.id, () => new Map())
    if (contractConfig.has(memberName)) {
      logger.error(sourceLocation, `Duplicate declaration of member ${memberName} on ${contractReference}`)
    }
    contractConfig.set(memberName, arc4MethodConfig)
  }

  getArc4Config(contractType: ContractClassPType): ARC4MethodConfig[]
  getArc4Config(contractType: ContractClassPType, memberName: string): ARC4MethodConfig | undefined
  getArc4Config(contractType: ContractClassPType, memberName?: string): ARC4MethodConfig | undefined | ARC4MethodConfig[] {
    if (memberName) {
      for (const ct of [contractType, ...contractType.allBases()]) {
        if (ct.equals(baseContractType) || ct.equals(arc4BaseContractType) || ct instanceof ClusteredContractClassType) continue

        const contractMethods = this.arc4MethodConfig.get(ct.fullName)
        if (!contractMethods) continue
        if (contractMethods.has(memberName)) {
          return contractMethods.get(memberName)
        }
      }
      return undefined
    } else {
      return Array.from(
        [contractType, ...contractType.allBases()]
          .toReversed()
          .reduce((acc, ct) => {
            if (ct.equals(baseContractType) || ct.equals(arc4BaseContractType) || ct instanceof ClusteredContractClassType) return acc

            const contractMethods = this.arc4MethodConfig.get(ct.fullName)
            if (!contractMethods) return acc

            return new Map([...acc, ...contractMethods])
          }, new Map<string, ARC4MethodConfig>())
          .values(),
      )
    }
  }

  static forProgram(program: ts.Program, options: BuildAwstOptions): AwstBuildContext {
    return new AwstBuildContextImpl(
      program,
      options,
      new ConstantStore(program),
      new UniqueNameResolver(),
      new DefaultMap(),
      new DefaultMap(),
      {},
      new CompilationSet(),
    )
  }

  addConstant(identifier: ts.Identifier, builder: InstanceBuilder) {
    this.constants.addConstant(identifier, builder, this.getSourceLocation(identifier))
  }

  createChildContext(): AwstBuildContext {
    return new AwstBuildContextImpl(
      this.program,
      this.options,
      this.constants,
      this.nameResolver.createChild(),
      this.storageDeclarations,
      this.arc4MethodConfig,
      this.contractTypes,
      this.#compilationSet,
    )
  }

  resolveDestructuredParamName(node: ts.ParameterDeclaration) {
    const symbol = (node as { symbol?: ts.Symbol }).symbol
    invariant(symbol, 'Param node must have symbol')
    return this.nameResolver.resolveUniqueName('p', symbol)
  }
  generateVarName(purpose: 'temp' | 'discard'): string {
    switch (purpose) {
      case 'discard':
        return this.nameResolver.resolveUniqueName('_', undefined)
      case 'temp':
        return this.nameResolver.resolveUniqueName('temp', undefined)
    }
  }
  resolveVariableName(node: ts.Identifier) {
    const symbol = this.typeChecker.resolveName(node.text, node, ts.SymbolFlags.All, false)
    invariant(symbol, 'There must be a symbol for an identifier node')
    return this.nameResolver.resolveUniqueName(node.text, symbol)
  }

  getTypeParameters(node: ts.CallExpression | ts.NewExpression): PType[] {
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
    const constantBuilder = this.constants.tryResolveConstant(node, sourceLocation)
    if (constantBuilder) {
      return constantBuilder
    }
    const variableName = this.resolveVariableName(node)
    return typeRegistry.getInstanceEb(
      nodeFactory.varExpression({
        sourceLocation,
        name: variableName,
        wtype: ptype.wtypeOrThrow,
      }),
      ptype,
    )
  }

  getSourceLocation<TNode extends ts.Node>(node: TNode) {
    return SourceLocation.fromNode(node, AbsolutePath.resolve({ path: this.program.getCurrentDirectory() }))
  }

  addStorageDeclaration(declaration: AppStorageDeclaration): void {
    const contractDeclarations = this.storageDeclarations.getOrDefault(declaration.definedIn.fullName, () => new Map())
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
    const seenContracts = new Set<string>()
    for (const ct of [contractType, ...contractType.allBases()]) {
      if (seenContracts.has(ct.fullName)) continue
      seenContracts.add(ct.fullName)

      for (const [memberName, declaration] of this.storageDeclarations.get(ct.fullName) ?? []) {
        if (result.has(memberName)) {
          logger.error(
            result.get(memberName)?.sourceLocation,
            `Redefinition of app storage member, original declared in ${declaration.sourceLocation}`,
          )
        }
        try {
          result.set(memberName, declaration.definition)
        } catch (e) {
          if (e instanceof PuyaError) {
            logger.error(e)
          } else {
            throw e
          }
        }
      }
    }
    return Array.from(result.values())
  }

  addToCompilationSet(compilationTarget: ContractReference, contract: ContractClassModel): void
  addToCompilationSet(compilationTarget: LogicSigReference, logicSig: LogicSigClassModel): void
  addToCompilationSet(compilationTarget: ContractReference | LogicSigReference, contractOrSig: ContractClassModel | LogicSigClassModel) {
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
