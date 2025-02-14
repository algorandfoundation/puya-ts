import { nodeFactory } from '../../../awst/node-factory'
import type { AppStateExpression, Expression, LValue } from '../../../awst/nodes'
import { BytesConstant } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { wtypes } from '../../../awst/wtypes'

import { CodeError } from '../../../errors'
import { codeInvariant, invariant } from '../../../util'
import { AppStorageDeclaration } from '../../models/app-storage-declaration'
import type { ContractClassPType, PType } from '../../ptypes'
import { boolPType, bytesPType, GlobalStateType, stringPType } from '../../ptypes'
import { typeRegistry } from '../../type-registry'
import { BooleanExpressionBuilder } from '../boolean-expression-builder'
import type { NodeBuilder } from '../index'
import { FunctionBuilder, InstanceBuilder, InstanceExpressionBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'
import { VoidExpressionBuilder } from '../void-expression-builder'
import { extractKey } from './util'

export class GlobalStateFunctionBuilder extends FunctionBuilder {
  constructor(sourceLocation: SourceLocation) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const [contentPType] = typeArgs
    const {
      args: [{ initialValue, key }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      argSpec: (a) => [
        a.obj({
          initialValue: a.optional(contentPType),
          key: a.optional(stringPType, bytesPType),
        }),
      ],
      funcName: this.typeDescription,
      callLocation: sourceLocation,
    })
    const ptype = new GlobalStateType({ content: contentPType })

    return new GlobalStateFunctionResultBuilder(extractKey(key, wtypes.stateKeyWType), ptype, {
      initialValue: initialValue?.resolve(),
      sourceLocation,
    })
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
        return new GlobalStateDeleteFunctionBuilder(this.buildField(), sourceLocation)
      case 'value':
        return typeRegistry.getInstanceEb(this.buildField(), this.ptype.contentType)
      case 'hasValue':
        return new BooleanExpressionBuilder(
          nodeFactory.stateExists({
            field: this.buildField(),
            wtype: boolPType.wtype,
            sourceLocation,
          }),
        )
    }
    return super.memberAccess(name, sourceLocation)
  }

  private buildField(): AppStateExpression {
    return nodeFactory.appStateExpression({
      key: this._expr,
      wtype: this.ptype.contentType.wtypeOrThrow,
      existsAssertionMessage: 'check GlobalState exists',
      sourceLocation: this.sourceLocation,
    })
  }
}

export class GlobalStateFunctionResultBuilder extends InstanceBuilder<GlobalStateType> {
  resolve(): Expression {
    codeInvariant(
      this._expr,
      'Global state must have explicit key provided if not being assigned to a contract property',
      this.sourceLocation,
    )
    return this._expr
  }
  resolveLValue(): LValue {
    throw CodeError.invalidAssignmentTarget({ name: this.typeDescription, sourceLocation: this.sourceLocation })
  }
  private _ptype: GlobalStateType
  private _expr: Expression | undefined
  public readonly initialValue: Expression | undefined
  constructor(expr: Expression | undefined, ptype: PType, config: { initialValue?: Expression; sourceLocation: SourceLocation }) {
    const sourceLocation = expr?.sourceLocation ?? config?.sourceLocation
    invariant(sourceLocation, 'Must have expression or config')
    super(sourceLocation)
    invariant(ptype instanceof GlobalStateType, 'ptype must be GlobalStateType')
    this._ptype = ptype
    this._expr = expr
    this.initialValue = config.initialValue
  }

  get ptype(): GlobalStateType {
    return this._ptype
  }

  buildStorageDeclaration(
    memberName: string,
    memberLocation: SourceLocation,
    memberDescription: string | null,
    contractType: ContractClassPType,
  ): AppStorageDeclaration {
    if (this._expr)
      codeInvariant(
        this._expr instanceof BytesConstant,
        `key must be a compile time constant value if ${this.typeDescription} is assigned to a contract member`,
      )
    return new AppStorageDeclaration({
      sourceLocation: memberLocation,
      ptype: this._ptype,
      memberName: memberName,
      keyOverride: this._expr ?? null,
      description: memberDescription,
      definedIn: contractType,
    })
  }
}
