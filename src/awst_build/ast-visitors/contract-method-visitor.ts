import type ts from 'typescript'
import { ContractReference, OnCompletionAction } from '../../awst/models'
import { nodeFactory } from '../../awst/node-factory'
import type { ABIMethodArgConstantDefault, ABIMethodArgMemberDefault } from '../../awst/nodes'
import * as awst from '../../awst/nodes'
import { ARC4ABIMethodConfig, ARC4BareMethodConfig, ARC4CreateOption } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { Constants } from '../../constants'
import { CodeError } from '../../errors'
import { logger } from '../../logger'
import { codeInvariant, invariant, isIn } from '../../util'
import type { AwstBuildContext } from '../context/awst-build-context'
import type { NodeBuilder } from '../eb'
import { ContractSuperBuilder, ContractThisBuilder } from '../eb/contract-builder'
import { requireExpressionOfType } from '../eb/util'
import type { Arc4AbiDecoratorData, DecoratorData } from '../models/decorator-data'
import type { ContractClassPType, FunctionPType } from '../ptypes'
import { GlobalStateType, LocalStateType } from '../ptypes'
import { DecoratorVisitor } from './decorator-visitor'
import { FunctionVisitor } from './function-visitor'

export class ContractMethodBaseVisitor extends FunctionVisitor {
  protected readonly _contractType: ContractClassPType
  constructor(ctx: AwstBuildContext, node: ts.MethodDeclaration | ts.ConstructorDeclaration, contractType: ContractClassPType) {
    super(ctx, node)
    this._contractType = contractType
  }
  visitSuperKeyword(node: ts.SuperExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)

    // Only the polytype clustered class should have more than one base type, and it shouldn't have
    // any user code with super calls
    invariant(this._contractType.baseTypes.length === 1, 'Super keyword only valid if contract has a single base type')
    return new ContractSuperBuilder(this._contractType.baseTypes[0], sourceLocation, this.context)
  }

  visitThisKeyword(node: ts.ThisExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    return new ContractThisBuilder(this._contractType, sourceLocation, this.context)
  }
}

export class ContractMethodVisitor extends ContractMethodBaseVisitor {
  private readonly _result: awst.ContractMethod

  constructor(ctx: AwstBuildContext, node: ts.MethodDeclaration, contractType: ContractClassPType) {
    super(ctx, node, contractType)
    const sourceLocation = this.sourceLocation(node)
    const { args, body, documentation } = this.buildFunctionAwst(node)
    const cref = ContractReference.fromPType(this._contractType)

    const decorator = DecoratorVisitor.buildContractMethodData(ctx, node)

    const modifiers = this.parseMemberModifiers(node)

    const arc4MethodConfig = this.buildArc4Config({
      functionType: this._functionType,
      decorator,
      modifiers,
      methodLocation: sourceLocation,
    })

    this._result = new awst.ContractMethod({
      arc4MethodConfig: arc4MethodConfig ?? null,
      memberName: this._functionType.name,
      sourceLocation,
      args,
      returnType: this._functionType.returnType.wtypeOrThrow,
      body,
      cref,
      documentation,
      inline: null,
    })
  }

  get result() {
    return this._result
  }

  public static buildContractMethod(
    parentCtx: AwstBuildContext,
    node: ts.MethodDeclaration,
    contractType: ContractClassPType,
  ): awst.ContractMethod {
    return new ContractMethodVisitor(parentCtx.createChildContext(), node, contractType).result
  }

  private buildArc4Config({
    functionType,
    decorator,
    modifiers: { isPublic, isStatic },
    methodLocation,
  }: {
    functionType: FunctionPType
    decorator: DecoratorData | undefined
    modifiers: { isPublic: boolean; isStatic: boolean }
    methodLocation: SourceLocation
  }): awst.ContractMethod['arc4MethodConfig'] | null {
    const isProgramMethod = isIn(functionType.name, [Constants.approvalProgramMethodName, Constants.clearStateProgramMethodName])

    if (decorator && isIn(decorator.type, [Constants.arc4BareDecoratorName, Constants.arc4AbiDecoratorName])) {
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

    if (decorator?.type === 'arc4.baremethod') {
      return new ARC4BareMethodConfig({
        sourceLocation: decorator.sourceLocation,
        allowedCompletionTypes: decorator.ocas,
        create: decorator.create,
      })
    }

    if (decorator?.type === 'arc4.abimethod') {
      return new ARC4ABIMethodConfig({
        sourceLocation: decorator.sourceLocation,
        allowedCompletionTypes: decorator.ocas,
        create: decorator.create,
        name: decorator.nameOverride ?? functionType.name,
        readonly: decorator.readonly,
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
      return new ARC4ABIMethodConfig({
        sourceLocation: methodLocation,
        allowedCompletionTypes: [OnCompletionAction.NoOp],
        create: ARC4CreateOption.disallow,
        name: functionType.name,
        readonly: false,
        defaultArgs: new Map(),
      })
    }
    return null
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
