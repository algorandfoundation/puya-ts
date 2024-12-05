import { nodeFactory } from '../../../awst/node-factory'
import type { AppAccountStateExpression, AppStateExpression, Expression, LValue } from '../../../awst/nodes'
import { BytesConstant } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { wtypes } from '../../../awst/wtypes'
import { CodeError } from '../../../errors'
import { codeInvariant, invariant } from '../../../util'
import { AppStorageDeclaration } from '../../models/app-storage-declaration'

import type { ContractClassPType, PType } from '../../ptypes'
import { accountPType, boolPType, bytesPType, LocalStateType, stringPType } from '../../ptypes'
import { instanceEb } from '../../type-registry'
import { FunctionBuilder, InstanceBuilder, InstanceExpressionBuilder, NodeBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'
import { VoidExpressionBuilder } from '../void-expression-builder'
import { extractKey } from './util'

export class LocalStateFunctionBuilder extends FunctionBuilder {
  constructor(sourceLocation: SourceLocation) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const [contentPType] = typeArgs
    const {
      args: [{ key }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      argSpec: (a) => [
        a.obj({
          key: a.optional(stringPType, bytesPType),
        }),
      ],
      funcName: this.typeDescription,
      callLocation: sourceLocation,
    })
    const ptype = new LocalStateType({ content: contentPType })
    return new LocalStateFunctionResultBuilder(extractKey(key, wtypes.stateKeyWType), ptype, { sourceLocation })
  }
}

export class LocalStateExpressionBuilder extends InstanceExpressionBuilder<LocalStateType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof LocalStateType, 'ptype must be instance of LocalStateType')
    super(expr, ptype)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [account],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: 'LocalState',
      argSpec: (a) => [a.required(accountPType)],
    })

    return new LocalStateForAccountExpressionBuilder(this.buildField(account.resolve(), sourceLocation), this.ptype.contentType)
  }

  private buildField(account: Expression, sourceLocation: SourceLocation): AppAccountStateExpression {
    return nodeFactory.appAccountStateExpression({
      key: this._expr,
      account,
      wtype: this.ptype.contentType.wtypeOrThrow,
      existsAssertionMessage: 'check LocalState exists',
      sourceLocation,
    })
  }
}

export class LocalStateForAccountExpressionBuilder extends NodeBuilder {
  ptype: undefined

  constructor(
    private key: AppAccountStateExpression,
    private contentType: PType,
  ) {
    super(key.sourceLocation)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'value':
        return instanceEb(
          nodeFactory.appAccountStateExpression({
            ...this.key,
            sourceLocation,
          }),
          this.contentType,
        )
      case 'hasValue':
        return instanceEb(
          nodeFactory.stateExists({
            field: this.key,
            sourceLocation,
            wtype: wtypes.boolWType,
          }),
          boolPType,
        )
      case 'delete':
        return new LocalStateDeleteFunctionBuilder(this.key, sourceLocation)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

class LocalStateDeleteFunctionBuilder extends FunctionBuilder {
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
      funcName: 'LocalState.delete',
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

export class LocalStateFunctionResultBuilder extends InstanceBuilder<LocalStateType> {
  resolve(): Expression {
    codeInvariant(
      this._expr,
      'Local state must have explicit key provided if not being assigned to a contract property',
      this.sourceLocation,
    )
    return this._expr
  }
  resolveLValue(): LValue {
    throw CodeError.invalidAssignmentTarget({ name: this.typeDescription, sourceLocation: this.sourceLocation })
  }

  private _expr: Expression | undefined
  constructor(expr: Expression | undefined, ptype: PType, config: { sourceLocation: SourceLocation }) {
    const sourceLocation = expr?.sourceLocation ?? config?.sourceLocation
    invariant(sourceLocation, 'Must have expression or config')
    super(sourceLocation)
    invariant(ptype instanceof LocalStateType, 'ptype must be LocalStateType')
    this._expr = expr
    this.ptype = ptype
  }
  readonly ptype: LocalStateType

  buildStorageDeclaration(
    memberName: string,
    memberLocation: SourceLocation,
    memberDescription: string | null,
    contractType: ContractClassPType,
  ): AppStorageDeclaration {
    if (this._expr)
      codeInvariant(
        this._expr instanceof BytesConstant,
        `key is must be a compile time constant value if ${this.typeDescription} is assigned to a contract member`,
      )
    return new AppStorageDeclaration({
      sourceLocation: memberLocation,
      ptype: this.ptype,
      memberName: memberName,
      keyOverride: this._expr ?? null,
      description: memberDescription,
      definedIn: contractType,
    })
  }
}
