import type { NodeBuilder } from '../index'
import { FunctionBuilder, InstanceBuilder, InstanceExpressionBuilder } from '../index'
import type { SourceLocation } from '../../../awst/source-location'
import type { PType } from '../../ptypes'
import { bytesPType } from '../../ptypes'
import type { AppStateExpression, Expression, LValue } from '../../../awst/nodes'
import { BytesConstant } from '../../../awst/nodes'
import type { ContractClassPType } from '../../ptypes'
import { LocalStateType } from '../../ptypes'
import { codeInvariant, invariant } from '../../../util'
import { CodeError } from '../../../errors'
import { ObjectLiteralExpressionBuilder } from '../literal/object-literal-expression-builder'
import { requireExpressionOfType } from '../util'
import { nodeFactory } from '../../../awst/node-factory'
import { AppStorageDeclaration } from '../../contract-data'
import { typeRegistry } from '../../type-registry'

export class LocalStateFunctionBuilder extends FunctionBuilder {
  constructor(sourceLocation: SourceLocation) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const [contentPType] = typeArgs
    let key: Expression | undefined = undefined
    switch (args.length) {
      case 0:
        break
      case 1: {
        const [arg0] = args
        codeInvariant(arg0 instanceof ObjectLiteralExpressionBuilder, 'Expected object literal')

        if (arg0.hasProperty('key')) {
          key = requireExpressionOfType(arg0.memberAccess('key', sourceLocation), bytesPType, sourceLocation)
        }
        break
      }
      default:
        throw CodeError.unexpectedUnhandledArgs({ sourceLocation })
    }
    codeInvariant(contentPType, `Generic type 'ValueType' is required if not providing an initial value`)
    const ptype = new LocalStateType({ content: contentPType })
    return new LocalStateFunctionResultBuilder(key, ptype, { sourceLocation })
  }
}

export class LocalStateExpressionBuilder extends InstanceExpressionBuilder<LocalStateType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof LocalStateType, 'ptype must be instance of LocalStateType')
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'value':
        // TODO: use value proxy
        return typeRegistry.getInstanceEb(this.buildField(sourceLocation), this.ptype.contentType)
    }
    return super.memberAccess(name, sourceLocation)
  }

  private buildField(sourceLocation: SourceLocation): AppStateExpression {
    return nodeFactory.appStateExpression({
      key: this._expr,
      wtype: this.ptype.contentType.wtypeOrThrow,
      existsAssertionMessage: 'check LocalState exists',
      sourceLocation,
    })
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
  private _ptype: LocalStateType
  private _expr: Expression | undefined
  constructor(expr: Expression | undefined, ptype: PType, config: { sourceLocation: SourceLocation }) {
    const sourceLocation = expr?.sourceLocation ?? config?.sourceLocation
    invariant(sourceLocation, 'Must have expression or config')
    super(sourceLocation)
    invariant(ptype instanceof LocalStateType, 'ptype must be LocalStateType')
    this._ptype = ptype
    this._expr = expr
  }

  get ptype(): LocalStateType {
    return this._ptype
  }

  buildStorageDefinition(memberName: string, memberLocation: SourceLocation, contractType: ContractClassPType): AppStorageDeclaration {
    if (this._expr)
      codeInvariant(
        this._expr instanceof BytesConstant,
        `key is must be a compile time constant value if ${this.typeDescription} is assigned to a contract member`,
      )
    return new AppStorageDeclaration({
      sourceLocation: memberLocation,
      ptype: this._ptype,
      memberName: memberName,
      keyOverride: this._expr,
      description: undefined,
      definedIn: contractType,
    })
  }
}
