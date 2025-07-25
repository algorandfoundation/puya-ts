import { nodeFactory } from '../../../awst/node-factory'
import type { AppStateExpression, Expression } from '../../../awst/nodes'
import { BytesConstant } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { wtypes } from '../../../awst/wtypes'
import { GlobalStateNumber } from '../../../code-fix/global-state-number'
import { logger } from '../../../logger'
import { codeInvariant, invariant } from '../../../util'
import { AppStorageDeclaration } from '../../models/app-storage-declaration'
import type { ContractClassPType, PType } from '../../ptypes'
import { boolPType, bytesPType, GlobalStateGeneric, GlobalStateType, numberPType, stringPType } from '../../ptypes'
import { typeRegistry } from '../../type-registry'
import { BooleanExpressionBuilder } from '../boolean-expression-builder'
import type { NodeBuilder } from '../index'
import { FunctionBuilder, InstanceExpressionBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'
import { VoidExpressionBuilder } from '../void-expression-builder'
import { extractKey } from './util'

export class GlobalStateFunctionBuilder extends FunctionBuilder {
  constructor(sourceLocation: SourceLocation) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const ptype = GlobalStateGeneric.parameterise(typeArgs)
    if (ptype.contentType.equals(numberPType)) {
      logger.addCodeFix(new GlobalStateNumber({ sourceLocation }))
    }
    const {
      args: [{ initialValue, key }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      argSpec: (a) => [
        a.obj({
          initialValue: a.optional(ptype.contentType),
          key: a.optional(stringPType, bytesPType),
        }),
      ],
      funcName: this.typeDescription,
      callLocation: sourceLocation,
    })

    return new GlobalStateFunctionResultBuilder(
      extractKey(key, wtypes.stateKeyWType, sourceLocation),
      ptype,
      initialValue?.resolve(),
      sourceLocation,
    )
  }
}

class GlobalStateDeleteFunctionBuilder extends FunctionBuilder {
  constructor(
    private key: AppStateExpression,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: 'GlobalState.delete',
      argSpec: () => [],
    })
    return new VoidExpressionBuilder(
      nodeFactory.stateDelete({
        field: this.key,
        sourceLocation,
        wtype: wtypes.voidWType,
      }),
    )
  }
}

export class GlobalStateExpressionBuilder extends InstanceExpressionBuilder<GlobalStateType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof GlobalStateType, 'ptype must be instance of GlobalStateType')
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'delete':
        return new GlobalStateDeleteFunctionBuilder(this.buildField(this.sourceLocation), sourceLocation)
      case 'value':
        return typeRegistry.getInstanceEb(this.buildField(sourceLocation), this.ptype.contentType)
      case 'hasValue':
        return new BooleanExpressionBuilder(
          nodeFactory.stateExists({
            field: this.buildField(this.sourceLocation),
            wtype: boolPType.wtype,
            sourceLocation,
          }),
        )
    }
    return super.memberAccess(name, sourceLocation)
  }

  protected buildField(sourceLocation: SourceLocation): AppStateExpression {
    return nodeFactory.appStateExpression({
      key: this._expr,
      wtype: this.ptype.contentType.wtypeOrThrow,
      existsAssertionMessage: 'check GlobalState exists',
      sourceLocation,
    })
  }
}

export class GlobalStateFunctionResultBuilder extends GlobalStateExpressionBuilder {
  resolve(): Expression {
    codeInvariant(
      this._keyExpr,
      'Global state must have explicit key provided if not being assigned to a contract property',
      this.sourceLocation,
    )
    codeInvariant(!this.initialValue, 'Global state can only have an initial value specified if being assigned to a contract property')
    return this._expr
  }
  public readonly initialValue: Expression | undefined

  private readonly _keyExpr: Expression | undefined

  constructor(expr: Expression | undefined, ptype: PType, initialValue: Expression | undefined, sourceLocation: SourceLocation) {
    super(expr ?? nodeFactory.voidConstant({ sourceLocation }), ptype)
    this.initialValue = initialValue
    this._keyExpr = expr
  }

  protected buildField(sourceLocation: SourceLocation): AppStateExpression {
    codeInvariant(
      this._keyExpr,
      'Global state must have explicit key provided if not being assigned to a contract property',
      this.sourceLocation,
    )
    return super.buildField(sourceLocation)
  }

  buildStorageDeclaration(
    memberName: string,
    memberLocation: SourceLocation,
    memberDescription: string | null,
    contractType: ContractClassPType,
  ): AppStorageDeclaration {
    if (this._keyExpr)
      codeInvariant(
        this._keyExpr instanceof BytesConstant,
        `key must be a compile time constant value if ${this.typeDescription} is assigned to a contract member`,
      )
    return new AppStorageDeclaration({
      sourceLocation: memberLocation,
      ptype: this.ptype,
      memberName: memberName,
      keyOverride: this._keyExpr ?? null,
      description: memberDescription,
      definedIn: contractType,
    })
  }
}
