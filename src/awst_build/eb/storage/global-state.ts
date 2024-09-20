import type { NodeBuilder } from '../index'
import { FunctionBuilder, InstanceBuilder, InstanceExpressionBuilder } from '../index'
import type { SourceLocation } from '../../../awst/source-location'
import { boolPType, stringPType } from '../../ptypes'
import { bytesPType } from '../../ptypes'
import type { AppStateExpression, Expression, LValue } from '../../../awst/nodes'
import { BytesConstant } from '../../../awst/nodes'
import type { ContractClassPType, PType } from '../../ptypes'
import { GlobalStateType } from '../../ptypes'
import { codeInvariant, invariant } from '../../../util'
import { CodeError } from '../../../errors'
import { nodeFactory } from '../../../awst/node-factory'
import { AppStorageDeclaration } from '../../contract-data'
import { typeRegistry } from '../../type-registry'
import { BooleanExpressionBuilder } from '../boolean-expression-builder'
import { parseFunctionArgs } from '../util/arg-parsing'
import { stateKeyWType } from '../../../awst/wtypes'
import { extractKey } from './util'

export class GlobalStateFunctionBuilder extends FunctionBuilder {
  constructor(sourceLocation: SourceLocation) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
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

    return new GlobalStateFunctionResultBuilder(extractKey(key, stateKeyWType), ptype, {
      initialValue: initialValue?.resolve(),
      sourceLocation,
    })
  }
}

export class GlobalStateExpressionBuilder extends InstanceExpressionBuilder<GlobalStateType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof GlobalStateType, 'ptype must be instance of GlobalStateType')
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'value':
        return typeRegistry.getInstanceEb(this.buildField(sourceLocation), this.ptype.contentType)
      case 'hasValue':
        return new BooleanExpressionBuilder(
          nodeFactory.stateExists({
            field: this.buildField(sourceLocation),
            wtype: boolPType.wtype,
            sourceLocation,
          }),
        )
    }
    return super.memberAccess(name, sourceLocation)
  }

  private buildField(sourceLocation: SourceLocation): AppStateExpression {
    return nodeFactory.appStateExpression({
      key: this._expr,
      wtype: this.ptype.contentType.wtypeOrThrow,
      existsAssertionMessage: 'check GlobalState exists',
      sourceLocation,
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

  buildStorageDeclaration(memberName: string, memberLocation: SourceLocation, contractType: ContractClassPType): AppStorageDeclaration {
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
      description: null,
      definedIn: contractType,
    })
  }
}
