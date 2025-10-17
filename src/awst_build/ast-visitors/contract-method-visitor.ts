import type ts from 'typescript'
import type { ResourceEncoding } from '../../awst'
import { ContractReference, OnCompletionAction } from '../../awst/models'
import { nodeFactory } from '../../awst/node-factory'
import type { ABIMethodArgConstantDefault, ABIMethodArgMemberDefault, ARC4MethodConfig } from '../../awst/nodes'
import * as awst from '../../awst/nodes'
import { ARC4ABIMethodConfig, ARC4BareMethodConfig, ARC4CreateOption } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { Constants } from '../../constants'
import { CodeError } from '../../errors'
import { logger } from '../../logger'
import { codeInvariant, invariant, isIn, sameSets } from '../../util'
import { ptypeToAbiPType } from '../arc4-util'
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

    const arc4MethodConfig = this.buildArc4Config({
      functionType: this._functionType,
      decorator,
      modifiers,
      methodLocation: sourceLocation,
    })

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

  get result() {
    const { args, body, documentation } = this.buildFunctionAwst()

    return new awst.ContractMethod({
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

  public static buildContractMethod(node: ts.MethodDeclaration, contractType: ContractClassPType): () => awst.ContractMethod {
    return visitInChildContext(this, node, contractType)
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
  }): awst.ARC4MethodConfig | null {
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

    if (decorator?.type === 'arc4.baremethod') {
      this.checkBareMethodTypes(functionType, methodLocation)
      return new ARC4BareMethodConfig({
        sourceLocation: decorator.sourceLocation,
        allowedCompletionTypes:
          decorator.allowedCompletionTypes ?? conventionalDefaults?.allowedCompletionTypes ?? unspecifiedDefaults.allowedCompletionTypes,
        create: decorator.create ?? conventionalDefaults?.create ?? unspecifiedDefaults.create,
      })
    }

    if (decorator?.type === 'arc4.abimethod') {
      this.checkABIMethodTypes(functionType, decorator.resourceEncoding ?? 'value', methodLocation)
      return new ARC4ABIMethodConfig({
        readonly: decorator.readonly ?? false,
        sourceLocation: decorator.sourceLocation,
        allowedCompletionTypes:
          decorator.allowedCompletionTypes ?? conventionalDefaults?.allowedCompletionTypes ?? unspecifiedDefaults.allowedCompletionTypes,
        create: decorator.create ?? conventionalDefaults?.create ?? unspecifiedDefaults.create,
        name: decorator.nameOverride ?? functionType.name,
        resourceEncoding: decorator.resourceEncoding ?? 'value',
        validateEncoding: decorator.validateInputs ?? null,
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
    } else if (isPublic && this._contractType.isARC4) {
      this.checkABIMethodTypes(functionType, 'value', methodLocation)
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
    if (!decorator || !impliedByConvention || decorator.type === 'arc4.readonly') return

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

  checkABIMethodTypes(functionType: FunctionPType, resourceEncoding: ResourceEncoding, sourceLocation: SourceLocation) {
    for (const [, paramType] of functionType.parameters) {
      codeInvariant(
        ptypeToAbiPType(paramType, 'in', resourceEncoding, sourceLocation),
        'ABI method parameter types must have an ARC4 equivalent',
        sourceLocation,
      )
    }
    codeInvariant(
      ptypeToAbiPType(functionType.returnType, 'out', resourceEncoding, sourceLocation),
      'ABI method return type must have an ARC4 equivalent',
      sourceLocation,
    )
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
    const [, paramType] = this._contractType.methods[methodName].parameters.find(([p]) => p === parameterName) ?? [undefined, undefined]
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
