import ts from 'typescript'
import type { DefaultArgumentSource } from '../awst/models'
import { ARC4ABIMethodConfig, ARC4BareMethodConfig, ARC4CreateOption, ContractReference, OnCompletionAction } from '../awst/models'
import * as awst from '../awst/nodes'
import type { SourceLocation } from '../awst/source-location'
import { Constants } from '../constants'
import { CodeError, TodoError } from '../errors'
import { logger } from '../logger'
import { codeInvariant, isIn } from '../util'
import { getArc4StructDef, getFunctionTypes, ptypeToArc4PType } from './arc4-util'
import type { AwstBuildContext } from './context/awst-build-context'
import type { Arc4AbiDecoratorData, DecoratorData } from './decorator-visitor'
import { DecoratorVisitor } from './decorator-visitor'
import type { NodeBuilder } from './eb'
import { ContractSuperBuilder, ContractThisBuilder } from './eb/contract-builder'
import { isValidLiteralForPType } from './eb/util'
import { FunctionVisitor } from './function-visitor'
import type { FunctionPType } from './ptypes'
import { ContractClassPType, GlobalStateType } from './ptypes'
import { ARC4StructType } from './ptypes/arc4-types'

export class ContractMethodBaseVisitor extends FunctionVisitor {
  visitSuperKeyword(node: ts.SuperExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const ptype = this.context.getPTypeForNode(node)
    if (ptype instanceof ContractClassPType) {
      return new ContractSuperBuilder(ptype, sourceLocation, this.context)
    }
    throw new CodeError(`'super' keyword is not valid outside of a contract type`, { sourceLocation })
  }

  visitThisKeyword(node: ts.ThisExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const ptype = this.context.getPTypeForNode(node)
    if (ptype instanceof ContractClassPType) {
      return new ContractThisBuilder(ptype, sourceLocation, this.context)
    }
    throw new CodeError(`'this' keyword is not valid outside of a contract type`, { sourceLocation })
  }
}

export class ContractMethodVisitor extends ContractMethodBaseVisitor {
  private readonly _result: awst.ContractMethod
  private readonly _contractType: ContractClassPType

  constructor(ctx: AwstBuildContext, node: ts.MethodDeclaration, contractType: ContractClassPType) {
    super(ctx, node)
    this._contractType = contractType
    const sourceLocation = this.sourceLocation(node)
    const { args, body, documentation } = this.buildFunctionAwst(node)
    const cref = ContractReference.fromPType(this._contractType)

    const decorators = (node.modifiers ?? []).flatMap((modifier) => {
      if (!ts.isDecorator(modifier)) return []

      return DecoratorVisitor.buildDecoratorData(this.context, modifier)
    })

    if (decorators.length > 1) {
      logger.error(
        sourceLocation,
        'Only one decorator is allowed per method. Multiple on complete actions can be provided in a single decorator',
      )
    }

    const modifiers = this.parseMemberModifiers(node)

    const arc4MethodConfig = this.buildArc4Config({
      functionType: this._functionType,
      decorator: decorators[0],
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

    const funcTypes = getFunctionTypes(functionType, methodLocation)

    const mappedTypes = Object.entries(funcTypes).map(([n, t]) => [n, ptypeToArc4PType(t, methodLocation)])

    const structs = Object.fromEntries(
      mappedTypes
        .filter((mappedType): mappedType is [string, ARC4StructType] => mappedType[1] instanceof ARC4StructType)
        .map(([p, t]) => [p, getArc4StructDef(t)]),
    )

    if (decorator?.type === 'arc4.abimethod') {
      return new ARC4ABIMethodConfig({
        sourceLocation: decorator.sourceLocation,
        allowedCompletionTypes: decorator.ocas,
        create: decorator.create,
        name: decorator.nameOverride ?? functionType.name,
        readonly: decorator.readonly,
        defaultArgs: Object.fromEntries(
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
        structs,
      })
    } else if (isPublic && this._contractType.isARC4) {
      return new ARC4ABIMethodConfig({
        sourceLocation: methodLocation,
        allowedCompletionTypes: [OnCompletionAction.NoOp],

        create: ARC4CreateOption.Disallow,
        name: functionType.name,
        readonly: false,
        defaultArgs: {},
        structs,
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
  }): DefaultArgumentSource {
    const [, paramType] = this._contractType.methods[methodName].parameters.find(([p]) => p === parameterName) ?? [undefined, undefined]
    codeInvariant(
      paramType,
      `Default argument specification '${parameterName}' does not match any parameters on the target method`,
      decoratorLocation,
    )
    if (config.type === 'constant') {
      codeInvariant(isValidLiteralForPType(config.value, paramType), `Literal cannot be converted to type ${paramType}`, decoratorLocation)

      return {
        source: 'constant',
        value: config.value,
      }
    }
    const methodType = this._contractType.methods[config.name]
    if (methodType) {
      codeInvariant(
        methodType.returnType.equals(paramType),
        `Default argument specification for '${parameterName}' does not match parameter type`,
        decoratorLocation,
      )
      return {
        source: 'abi-method',
        memberName: config.name,
      }
    }
    const propertyType = this._contractType.properties[config.name]
    if (propertyType instanceof GlobalStateType) {
      codeInvariant(
        propertyType.contentType.equals(paramType),
        `Default argument specification for '${parameterName}' does not match parameter type`,
        decoratorLocation,
      )
      return {
        source: 'global-state',
        memberName: config.name,
      }
    }
    throw new TodoError('Unsupported default argument config')
  }
}
