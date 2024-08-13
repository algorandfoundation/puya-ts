import type { Visitor } from '../visitor/visitor'
import { accept } from '../visitor/visitor'
import ts from 'typescript'
import type * as awst from '../awst/nodes'
import type { AppStorageDefinition, ContractMethod } from '../awst/nodes'
import { ContractFragment } from '../awst/nodes'
import type { ClassElements } from '../visitor/syntax-names'
import { AwstBuildFailureError, NotSupported, TodoError } from '../errors'
import { codeInvariant, invariant } from '../util'
import { Constants } from '../constants'
import { FunctionVisitor } from './function-visitor'
import { logger } from '../logger'
import { BaseVisitor } from './base-visitor'
import { GlobalStateFunctionResultBuilder } from './eb/storage/global-state'
import { arc4BareMethodDecorator, BaseContractType, ContractClassPType, ContractType, GlobalStateType } from './ptypes'
import type { Arc4AbiDecoratorData, DecoratorData } from './decorator-visitor'
import { DecoratorVisitor } from './decorator-visitor'
import type { SourceLocation } from '../awst/source-location'
import type { DefaultArgumentSource } from '../awst/models'
import { ARC4BareMethodConfig } from '../awst/models'
import { ARC4ABIMethodConfig } from '../awst/models'
import { ContractReference } from '../awst/models'
import { ARC4CreateOption, OnCompletionAction } from '../awst/models'
import { isValidLiteralForPType } from './eb/util'
import type { VisitorContext } from './context/base-context'
import { nodeFactory } from '../awst/node-factory'
import { boolWType } from '../awst/wtypes'

export class ContractVisitor extends BaseVisitor implements Visitor<ClassElements, void> {
  private _ctor?: ContractMethod
  private _subroutines: ContractMethod[] = []
  private _approvalProgram?: ContractMethod
  private _clearStateProgram?: ContractMethod
  private _className: string
  private _contractPType: ContractClassPType
  private _appState = new Map<string, AppStorageDefinition>()
  public readonly result: ContractFragment
  public accept = <TNode extends ts.Node>(node: TNode) => accept<ContractVisitor, TNode>(this, node)

  constructor(ctx: VisitorContext, classDec: ts.ClassDeclaration) {
    super(ctx)
    const sourceLocation = this.context.getSourceLocation(classDec)
    codeInvariant(classDec.name, 'Anonymous classes are not supported for contracts', sourceLocation)
    this._className = this.textVisitor.accept(classDec.name)

    const contractPtype = this.context.getPTypeForNode(classDec)
    invariant(contractPtype instanceof ContractClassPType, 'Contract PType must be ContractClassType')
    invariant(contractPtype.baseType, 'Contract must have base type')
    this._contractPType = contractPtype

    const isAbstract = Boolean(classDec.modifiers?.some((m) => m.kind === ts.SyntaxKind.AbstractKeyword))

    for (const member of classDec.members) {
      try {
        this.accept(member)
      } catch (e) {
        // Ignore this error and continue visiting other members, so we can show additional errors
        if (!(e instanceof AwstBuildFailureError)) {
          throw e
        }
      }
    }

    this.result = new ContractFragment({
      name: this._className,
      nameOverride: undefined,
      appState: this._appState,
      init: this._ctor,
      subroutines: this._subroutines,
      docstring: undefined,
      approvalProgram: this._approvalProgram ?? this.makeDefaultApprovalProgram(sourceLocation, contractPtype),
      clearProgram: this._clearStateProgram ?? this.makeDefaultClearStateProgram(sourceLocation, contractPtype),
      isAbstract,
      isArc4: contractPtype.isARC4,
      bases: this.buildContractReferences(contractPtype),
      moduleName: this._contractPType.module,
      reservedScratchSpace: new Set(),
      methods: new Map(),
      sourceLocation: sourceLocation,
      stateTotals: {
        globalBytes: undefined,
        globalUints: undefined,
        localBytes: undefined,
        localUints: undefined,
      },
    })
  }

  private makeDefaultClearStateProgram(sourceLocation: SourceLocation, contractType: ContractClassPType) {
    return nodeFactory.contractMethod({
      name: Constants.clearStateProgramMethodName,
      moduleName: contractType.module,
      args: [],
      arc4MethodConfig: undefined,
      sourceLocation,
      className: contractType.name,
      returnType: boolWType,
      body: nodeFactory.block(
        {
          sourceLocation,
        },
        nodeFactory.returnStatement({
          sourceLocation,
          value: nodeFactory.boolConstant({ value: true, sourceLocation }),
        }),
      ),
    })
  }
  private makeDefaultApprovalProgram(sourceLocation: SourceLocation, contractType: ContractClassPType) {
    // TODO: This should be updated to return the arc4 router node, and should only be used if it's an arc4 contract
    return nodeFactory.contractMethod({
      name: Constants.approvalProgramMethodName,
      moduleName: contractType.module,
      args: [],
      arc4MethodConfig: undefined,
      sourceLocation,
      className: contractType.name,
      returnType: boolWType,
      body: nodeFactory.block(
        {
          sourceLocation,
        },
        nodeFactory.returnStatement({
          sourceLocation,
          value: nodeFactory.boolConstant({ value: true, sourceLocation }),
        }),
      ),
    })
  }

  private buildContractReferences(contractType: ContractClassPType): ContractReference[] {
    const baseType = contractType.baseType
    if (baseType === undefined || baseType.equals(BaseContractType) || baseType.equals(ContractType)) {
      return []
    } else {
      return [
        new ContractReference({
          className: baseType.name,
          moduleName: baseType.module,
        }),
      ]
    }
  }

  visitClassStaticBlockDeclaration(node: ts.ClassStaticBlockDeclaration): void {
    throw new TodoError('visitClassStaticBlockDeclaration')
  }
  visitConstructor(node: ts.ConstructorDeclaration): void {
    this._ctor = FunctionVisitor.buildConstructor(this.context, node, { className: this._className })
  }
  visitGetAccessor(node: ts.GetAccessorDeclaration): void {
    throw new TodoError('visitGetAccessor')
  }
  visitIndexSignature(node: ts.IndexSignatureDeclaration): void {
    throw new NotSupported('Index signatures')
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
    const [, paramType] = this._contractPType.methods[methodName].parameters.find(([p]) => p === parameterName) ?? [undefined, undefined]
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
    const methodType = this._contractPType.methods[config.name]
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
    const propertyType = this._contractPType.properties[config.name]
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

  private buildArc4Config({
    decorator,
    methodName,
    isPublic,
    methodLocation,
  }: {
    methodName: string
    decorator: DecoratorData | undefined
    isPublic: boolean
    methodLocation: SourceLocation
  }): awst.ContractMethod['arc4MethodConfig'] {
    if (!isPublic && decorator && [Constants.arc4BareDecoratorName, Constants.arc4AbiDecoratorName].includes(decorator.type)) {
      logger.error(methodLocation, 'Private method cannot be exposed as an abi method')
    }

    if (decorator?.type === 'arc4.baremethod') {
      return new ARC4BareMethodConfig({
        sourceLocation: decorator.sourceLocation,
        allowedCompletionTypes: decorator.ocas,
        create: decorator.create,
      })
    } else if (decorator?.type === 'arc4.abimethod') {
      return new ARC4ABIMethodConfig({
        sourceLocation: decorator.sourceLocation,
        allowedCompletionTypes: decorator.ocas,
        create: decorator.create,
        name: decorator.nameOverride ?? methodName,
        readonly: decorator.readonly,
        defaultArgs: Object.fromEntries(
          Object.entries(decorator.defaultArguments).map(([parameterName, argConfig]) => [
            parameterName,
            this.buildDefaultArgument({
              methodName,
              parameterName,
              config: argConfig,
              decoratorLocation: decorator.sourceLocation,
            }),
          ]),
        ),
        structs: {}, // TODO
      })
    } else if (isPublic && this._contractPType.isARC4) {
      return new ARC4ABIMethodConfig({
        sourceLocation: methodLocation,
        allowedCompletionTypes: [OnCompletionAction.NoOp],

        create: ARC4CreateOption.Disallow,
        name: methodName,
        readonly: false,
        defaultArgs: {},
        structs: {}, // TODO
      })
    }
  }

  visitMethodDeclaration(node: ts.MethodDeclaration): void {
    const sourceLocation = this.sourceLocation(node)
    const methodName = this.textVisitor.accept(node.name)

    const decorators = (node.modifiers ?? []).flatMap((modifier) => {
      if (!ts.isDecorator(modifier)) return []

      return DecoratorVisitor.buildDecoratorData(this.context, modifier)
    })
    const isPublic = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.PublicKeyword) === true

    if (decorators.length > 1) {
      logger.error(
        sourceLocation,
        'Only one decorator is allowed per method. Multiple on complete actions can be provided in a single decorator',
      )
    }

    switch (methodName) {
      case Constants.approvalProgramMethodName:
        if (decorators.length) logger.error(sourceLocation, `${Constants.approvalProgramMethodName} should not have a decorator`)
        this._approvalProgram = FunctionVisitor.buildContractMethod(this.context, node, { className: this._className })
        break
      case Constants.clearStateProgramMethodName:
        if (decorators.length) logger.error(sourceLocation, `${Constants.clearStateProgramMethodName} should not have a decorator`)
        this._clearStateProgram = FunctionVisitor.buildContractMethod(this.context, node, { className: this._className })
        break
      default:
        this._subroutines.push(
          FunctionVisitor.buildContractMethod(this.context, node, {
            className: this._className,
            arc4MethodConfig: this.buildArc4Config({
              decorator: decorators[0],
              methodName,
              isPublic,
              methodLocation: sourceLocation,
            }),
          }),
        )
    }
  }
  visitPropertyDeclaration(node: ts.PropertyDeclaration): void {
    const sourceLocation = this.sourceLocation(node)
    codeInvariant(!node.questionToken, 'Optional properties are not supported', sourceLocation)
    codeInvariant(!node.exclamationToken, 'Non-null assertion operators on properties are not supported', sourceLocation)
    // TODO: Check modifiers?

    const propertyName = this.textVisitor.accept(node.name)
    codeInvariant(node.initializer, 'Properties must have an initializer', sourceLocation)
    if (node.type) {
      logger.info(sourceLocation, 'Type annotations are not required on initialized properties')
    }
    const initializer = this.accept(node.initializer)

    if (initializer instanceof GlobalStateFunctionResultBuilder) {
      const storageDef = initializer.buildStorageDefinition(propertyName, this.sourceLocation(node.name), this._contractPType)
      this._appState.set(propertyName, storageDef.definition)
    }

    return
    // TODO: do something with initializer
  }
  visitSemicolonClassElement(node: ts.SemicolonClassElement): void {
    // Ignore
  }
  visitSetAccessor(node: ts.SetAccessorDeclaration): void {
    throw new TodoError('visitSetAccessor')
  }

  public static buildContract(ctx: VisitorContext, classDec: ts.ClassDeclaration): awst.ContractFragment {
    return new ContractVisitor(ctx.createChildContext(), classDec).result
  }
}
