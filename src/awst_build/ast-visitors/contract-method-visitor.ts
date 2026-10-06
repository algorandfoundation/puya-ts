import type ts from 'typescript'
import { ContractReference, OnCompletionAction } from '../../awst/models'
import { nodeFactory } from '../../awst/node-factory'
import type { ABIMethodArgConstantDefault, ABIMethodArgMemberDefault, ARC4MethodConfig } from '../../awst/nodes'
import { ARC4ABIMethodConfig, ARC4BareMethodConfig, ARC4CreateOption, ContractMethod } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { Constants } from '../../constants'
import { CodeError } from '../../errors'
import { logger } from '../../logger'
import { codeInvariant, invariant, isIn, sameSets } from '../../util'
import { checkAbstractAbiImplementation } from '../arc4-util'
import type { NodeBuilder } from '../eb'
import { ContractSuperBuilder, ContractThisBuilder } from '../eb/contract-builder'
import { requireExpressionOfType } from '../eb/util'
import type { Arc4AbiDecoratorData, RoutingDecoratorData } from '../models/decorator-data'
import type { ContractClassPType, FunctionPType } from '../ptypes'
import { GlobalStateType, LocalStateType, voidPType } from '../ptypes'
import { DecoratorVisitor } from './decorator-visitor'
import { FunctionVisitor } from './function-visitor'
import { visitInChildContext } from './util'

export class ContractMethodBaseVisitor extends FunctionVisitor {
  protected readonly _contractType: ContractClassPType
  constructor(node: ts.MethodDeclaration | ts.ConstructorDeclaration, contractType: ContractClassPType) {
    super(node)
    this._contractType = contractType
  }
  visitSuperKeyword(node: ts.SuperExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)

    // Only the polytype clustered class should have more than one base type, and it shouldn't have
    // any user code with super calls
    invariant(this._contractType.baseTypes.length === 1, 'Super keyword only valid if contract has a single base type')
    return new ContractSuperBuilder(this._contractType.baseTypes[0], sourceLocation)
  }

  visitThisKeyword(node: ts.ThisExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    return new ContractThisBuilder(this._contractType, sourceLocation)
  }
}

type RoutingProps = {
  allowedCompletionTypes?: OnCompletionAction[]
  create?: ARC4CreateOption
}

export class ContractMethodVisitor extends ContractMethodBaseVisitor {
  private readonly metaData: {
    cref: ContractReference
    arc4MethodConfig: ARC4MethodConfig | null
    sourceLocation: SourceLocation
  }

  constructor(node: ts.MethodDeclaration, contractType: ContractClassPType) {
    super(node, contractType)
    const sourceLocation = this.sourceLocation(node)

    const decorator = DecoratorVisitor.buildContractMethodData(node)
    const cref = ContractReference.fromPType(this._contractType)

    const modifiers = this.parseMemberModifiers(node)

    // Abstract methods can't be decorated, so an abstract override keeps the ARC4 config of the method it overrides
    const arc4MethodConfig =
      (this._functionType.isAbstract ? this.getOverriddenArc4Config() : undefined) ??
      this.buildArc4Config({
        functionType: this._functionType,
        decorator,
        modifiers,
        methodLocation: sourceLocation,
      })

    if (!modifiers.isStatic) this.validateAbstractAbiImplementation(arc4MethodConfig, sourceLocation)

    if (arc4MethodConfig)
      this.context.addArc4Config({
        contractReference: cref,
        sourceLocation,
        arc4MethodConfig,
        memberName: this._functionType.name,
      })
    this.metaData = {
      arc4MethodConfig,
      cref,
      sourceLocation,
    }
  }

  get result(): ContractMethod | undefined {
    // Abstract declarations contribute type and ABI metadata, but no implementation
    if (this._functionType.isAbstract) {
      // Run the signature checks buildFunctionAwst() would otherwise perform
      for (const parameter of this.node.parameters) this.accept(parameter)
      this._functionType.returnType.wtypeOrThrow
      return undefined
    }

    const { args, body, documentation } = this.buildFunctionAwst()

    return new ContractMethod({
      arc4MethodConfig: this.metaData.arc4MethodConfig,
      memberName: this._functionType.name,
      sourceLocation: this.metaData.sourceLocation,
      args,
      returnType: this._functionType.returnType.wtypeOrThrow,
      body,
      cref: this.metaData.cref,
      documentation,
      inline: null,
      pure: false,
    })
  }

  public static buildContractMethod(node: ts.MethodDeclaration, contractType: ContractClassPType): () => ContractMethod | undefined {
    return visitInChildContext(this, node, contractType)
  }

  private getOverriddenArc4Config(): ARC4MethodConfig | undefined {
    for (const base of this._contractType.baseTypes) {
      const config = this.context.getArc4Config(base, this._functionType.name)
      if (config) return config
    }
    return undefined
  }

  /**
   * A method implementing an abstract ABI method must keep the declaration's selector.
   * With multi-inheritance, the implementation can come from a base that doesn't extend the
   * declaring class. This visitor never pairs those two, so ContractVisitor checks them instead
   */
  private validateAbstractAbiImplementation(config: ARC4MethodConfig | null, sourceLocation: SourceLocation) {
    const { name } = this._functionType
    for (const base of this._contractType.allBases()) {
      const declaration = base.methods[name]
      if (!declaration?.isAbstract || declaration.declaredIn?.fullName !== base.fullName) continue
      const declarationConfig = this.context.getArc4Config(base, name)
      if (!(declarationConfig instanceof ARC4ABIMethodConfig)) continue
      checkAbstractAbiImplementation({
        declaration: { name: `${base.name}.${name}`, type: declaration, config: declarationConfig },
        implementation: { name: `${this._contractType.name}.${name}`, type: this._functionType, config },
        sourceLocation,
      })
    }
  }

  private buildArc4Config({
    functionType,
    decorator,
    modifiers: { isPublic, isStatic },
    methodLocation,
  }: {
    functionType: FunctionPType
    decorator: RoutingDecoratorData | undefined
    modifiers: { isPublic: boolean; isStatic: boolean }
    methodLocation: SourceLocation
  }): ARC4MethodConfig | null {
    const isProgramMethod = isIn(functionType.name, [
      Constants.symbolNames.approvalProgramMethodName,
      Constants.symbolNames.clearStateProgramMethodName,
    ])

    if (decorator && isIn(decorator.type, [Constants.symbolNames.arc4BareDecoratorName, Constants.symbolNames.arc4AbiDecoratorName])) {
      if (!isPublic) {
        logger.error(methodLocation, 'Private or protected methods cannot be exposed as an abi method')
        return null
      }
      if (isStatic) {
        logger.error(methodLocation, 'Static methods cannot be exposed as an abi method')
        return null
      }
      if (isProgramMethod) {
        logger.error(methodLocation, `${functionType.name} is reserved for program implementations and cannot be used as an abi method`)
        return null
      }
    }
    if (isProgramMethod || !isPublic || isStatic) return null

    const conventionalDefaults = this.getConventionalRoutingConfig(functionType.name)

    this.validateDecoratorRoutingData(functionType, decorator, conventionalDefaults)

    // Default routing properties used when these values aren't specified explicitly.
    const unspecifiedDefaults = {
      allowedCompletionTypes: [OnCompletionAction.NoOp],
      create: ARC4CreateOption.disallow,
    }

    if (decorator?.type === Constants.symbolNames.arc4BareDecoratorName) {
      this.checkBareMethodTypes(functionType, methodLocation)
      return new ARC4BareMethodConfig({
        sourceLocation: decorator.sourceLocation,
        allowedCompletionTypes:
          decorator.allowedCompletionTypes ?? conventionalDefaults?.allowedCompletionTypes ?? unspecifiedDefaults.allowedCompletionTypes,
        create: decorator.create ?? conventionalDefaults?.create ?? unspecifiedDefaults.create,
      })
    }

    if (decorator?.type === Constants.symbolNames.arc4AbiDecoratorName) {
      return new ARC4ABIMethodConfig({
        readonly: decorator.readonly ?? false,
        sourceLocation: decorator.sourceLocation,
        allowedCompletionTypes:
          decorator.allowedCompletionTypes ?? conventionalDefaults?.allowedCompletionTypes ?? unspecifiedDefaults.allowedCompletionTypes,
        create: decorator.create ?? conventionalDefaults?.create ?? unspecifiedDefaults.create,
        name: decorator.nameOverride ?? functionType.name,
        resourceEncoding: decorator.resourceEncoding ?? 'value',
        validateEncoding: decorator.validateEncoding ?? null,
        defaultArgs: new Map(
          Object.entries(decorator.defaultArguments).map(([parameterName, argConfig]) => [
            parameterName,
            this.buildDefaultArgument({
              methodName: functionType.name,
              parameterName,
              config: argConfig,
              decoratorLocation: decorator.sourceLocation,
            }),
          ]),
        ),
      })
    } else if (this._contractType.isARC4) {
      return new ARC4ABIMethodConfig({
        allowedCompletionTypes: conventionalDefaults?.allowedCompletionTypes ?? unspecifiedDefaults.allowedCompletionTypes,
        create: conventionalDefaults?.create ?? unspecifiedDefaults.create,
        sourceLocation: methodLocation,
        name: functionType.name,
        resourceEncoding: 'value',
        validateEncoding: null,
        readonly: decorator?.readonly ?? false,
        defaultArgs: new Map(),
      })
    }
    return null
  }

  private validateDecoratorRoutingData(
    functionType: FunctionPType,
    decorator: RoutingDecoratorData | undefined,
    impliedByConvention: RoutingProps | undefined,
  ) {
    if (!decorator || !impliedByConvention || decorator.type === Constants.symbolNames.readonlyDecoratorName) return

    if (
      decorator.allowedCompletionTypes !== undefined &&
      impliedByConvention.allowedCompletionTypes !== undefined &&
      !sameSets(decorator.allowedCompletionTypes, impliedByConvention.allowedCompletionTypes)
    ) {
      const impliedOcaNames = impliedByConvention.allowedCompletionTypes.map((oca) => OnCompletionAction[oca]).join(', ')
      logger.error(
        decorator.allowedCompletionTypesLocation ?? decorator.sourceLocation,
        `allowActions for conventional routing method '${functionType.name}' must be: ${impliedOcaNames}`,
      )
    }
    if (decorator.create !== undefined && impliedByConvention.create !== undefined && decorator.create !== impliedByConvention.create) {
      const impliedCreateAction = ARC4CreateOption[impliedByConvention.create]
      logger.error(
        decorator.createLocation ?? decorator.sourceLocation,
        `onCreate for conventional routing method '${functionType.name}' must be: ${impliedCreateAction}`,
      )
    }
  }

  /**
   * Get routing properties inferred by conventional naming
   * @param methodName The name of the method
   * @private
   */
  private getConventionalRoutingConfig(methodName: string): RoutingProps | undefined {
    switch (methodName) {
      case Constants.symbolNames.conventionalRouting.closeOutOfApplicationMethodName:
        return {
          allowedCompletionTypes: [OnCompletionAction.CloseOut],
          create: ARC4CreateOption.disallow,
        }
      case Constants.symbolNames.conventionalRouting.createApplicationMethodName:
        return {
          create: ARC4CreateOption.require,
        }
      case Constants.symbolNames.conventionalRouting.deleteApplicationMethodName:
        return {
          allowedCompletionTypes: [OnCompletionAction.DeleteApplication],
        }
      case Constants.symbolNames.conventionalRouting.optInToApplicationMethodName:
        return {
          allowedCompletionTypes: [OnCompletionAction.OptIn],
        }
      case Constants.symbolNames.conventionalRouting.updateApplicationMethodName:
        return {
          allowedCompletionTypes: [OnCompletionAction.UpdateApplication],
          create: ARC4CreateOption.disallow,
        }
      default:
        return undefined
    }
  }

  checkBareMethodTypes(functionType: FunctionPType, sourceLocation: SourceLocation) {
    codeInvariant(functionType.parameters.length === 0, 'Bare methods cannot have any parameters', sourceLocation)
    codeInvariant(functionType.returnType.equals(voidPType), 'Bare method return type must be void', sourceLocation)
  }

  private buildDefaultArgument({
    methodName,
    parameterName,
    config,
    decoratorLocation,
  }: {
    methodName: string
    parameterName: string
    config: Arc4AbiDecoratorData['defaultArguments'][string]
    decoratorLocation: SourceLocation
  }): ABIMethodArgMemberDefault | ABIMethodArgConstantDefault {
    const paramType = this._contractType.methods[methodName].parameters.find(([p]) => p === parameterName)?.[1]
    codeInvariant(
      paramType,
      `Default argument specification '${parameterName}' does not match any parameters on the target method`,
      decoratorLocation,
    )
    if (config.type === 'constant') {
      return nodeFactory.aBIMethodArgConstantDefault({
        value: requireExpressionOfType(config.value, paramType),
      })
    }
    const methodType = this._contractType.methods[config.name]
    if (methodType) {
      codeInvariant(
        methodType.returnType.equals(paramType),
        `Default argument specification for '${parameterName}' does not match parameter type`,
        decoratorLocation,
      )
      return nodeFactory.aBIMethodArgMemberDefault({
        name: config.name,
      })
    }
    const propertyType = this._contractType.properties[config.name]
    if (propertyType instanceof GlobalStateType || propertyType instanceof LocalStateType) {
      codeInvariant(
        propertyType.contentType.equals(paramType),
        `Default argument specification for '${parameterName}' does not match parameter type`,
        decoratorLocation,
      )
      return nodeFactory.aBIMethodArgMemberDefault({
        name: config.name,
      })
    }
    throw new CodeError('Unsupported default argument config', { sourceLocation: decoratorLocation })
  }
}
