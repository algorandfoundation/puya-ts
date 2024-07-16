import { accept, Visitor } from '../visitor/visitor'
import { SourceFileContext } from './context'
import ts from 'typescript'
import * as awst from '../awst/nodes'
import { AppStorageDefinition, ContractFragment, ContractMethod } from '../awst/nodes'
import { ClassElements } from '../visitor/syntax-names'
import { AwstBuildFailureError, NotSupported, TodoError } from '../errors'
import { codeInvariant, invariant } from '../util'
import { Constants } from '../constants'
import { FunctionVisitor } from './function-visitor'
import { logger } from '../logger'
import { BaseVisitor } from './base-visitor'
import { GlobalStateFunctionResultBuilder } from './eb/storage/global-state'
import { ContractClassPType } from './ptypes/ptype-classes'
import { nodeFactory } from '../awst/node-factory'
import { DecoratorData, DecoratorVisitor } from './decorator-visitor'
import { SourceLocation } from '../awst/source-location'
import { ARC4CreateOption, OnCompletionAction } from '../awst/arc4'

export class ContractContext extends SourceFileContext {
  constructor(parent: SourceFileContext) {
    super(parent.sourceFile, parent.program, parent.nameResolver.createChild())
  }
}

export class ContractVisitor extends BaseVisitor<ContractContext> implements Visitor<ClassElements, void> {
  private _ctor?: ContractMethod
  private _subroutines: ContractMethod[] = []
  private _approvalProgram?: ContractMethod
  private _clearStateProgram?: ContractMethod
  private _className: string
  private _contractPType: ContractClassPType
  private _appState = new Map<string, AppStorageDefinition>()
  public readonly result: ContractFragment
  public accept = <TNode extends ts.Node>(node: TNode) => accept<ContractVisitor, TNode>(this, node)

  constructor(ctx: ContractContext, classDec: ts.ClassDeclaration) {
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
      approvalProgram: this._approvalProgram,
      clearProgram: this._clearStateProgram,
      isAbstract,
      isArc4: contractPtype.isARC4,
      bases: [
        nodeFactory.contractReference({
          className: contractPtype.baseType.name,
          moduleName: contractPtype.baseType.module,
        }),
      ],
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
    if (decorator?.type === 'arc4.baremethod') {
      return {
        source_location: decorator.sourceLocation,
        allowed_completion_types: decorator.ocas,
        create: decorator.create,
        is_bare: true,
      }
    } else if (decorator?.type === 'arc4.abimethod') {
      return {
        source_location: decorator.sourceLocation,
        allowed_completion_types: decorator.ocas,
        create: decorator.create,
        is_bare: false,
        name: decorator.nameOverride ?? methodName,
        readonly: decorator.readonly,
        default_args: {}, // TODO
        structs: {}, // TODO
      }
    } else if (isPublic && this._contractPType.isARC4) {
      return {
        source_location: methodLocation,
        allowed_completion_types: [OnCompletionAction.NoOp],
        is_bare: false,
        create: ARC4CreateOption.Disallow,
        name: methodName,
        readonly: false,
        default_args: {}, // TODO
        structs: {}, // TODO
      }
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

  public static buildContract(ctx: SourceFileContext, classDec: ts.ClassDeclaration): awst.ContractFragment {
    return new ContractVisitor(new ContractContext(ctx), classDec).result
  }
}
