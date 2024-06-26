import { FunctionBuilder, InstanceBuilder } from '../index'
import { SourceLocation } from '../../../awst/source-location'
import { bytesPType, PType } from '../../ptypes'
import { AppStorageDefinition, AppStorageKind, BytesConstant, BytesEncoding, Expression, LValue } from '../../../awst/nodes'
import { ContractClassType, GlobalStateType } from '../../ptypes/ptype-classes'
import { codeInvariant, invariant, utf8ToUint8Array } from '../../../util'
import { CodeError } from '../../../errors'
import { ObjectLiteralExpressionBuilder } from '../object-literal-expression-builder'
import { requireExpressionOfType, requireInstanceBuilder } from '../util'
import { nodeFactory } from '../../../awst/node-factory'
import { AppStorageDeclaration } from '../../contract-data'

export class GlobalStateFunctionBuilder extends FunctionBuilder {
  constructor(sourceLocation: SourceLocation) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    let [contentPType] = typeArgs
    let initialValue: Expression | undefined
    let key: Expression | undefined = undefined
    switch (args.length) {
      case 0:
        break
      case 1: {
        const [arg0] = args
        codeInvariant(arg0 instanceof ObjectLiteralExpressionBuilder, 'Expected object literal')
        if (arg0.hasProperty('initialValue')) {
          const initialValueBuilder = requireInstanceBuilder(arg0.resolveProperty('initialValue', sourceLocation), sourceLocation)
          if (contentPType) {
            initialValue = requireExpressionOfType(initialValueBuilder, contentPType, sourceLocation)
          } else {
            initialValue = initialValueBuilder.resolve()
            invariant(initialValueBuilder.ptype, 'Builder must have a ptype')
            contentPType = initialValueBuilder.ptype
          }
        }
        if (arg0.hasProperty('key')) {
          key = requireExpressionOfType(arg0.resolveProperty('key', sourceLocation), bytesPType, sourceLocation)
        }
        break
      }
      default:
        throw CodeError.unexpectedUnhandledArgs({ sourceLocation })
    }
    codeInvariant(contentPType, `Generic type 'ValueType' is required if not providing an initial value`)
    const ptype = new GlobalStateType({ content: contentPType })
    return new GlobalStateFunctionResultBuilder(key, ptype, { initialValue, sourceLocation })
  }
}

export class GlobalStateFunctionResultBuilder extends InstanceBuilder {
  resolve(): Expression {
    throw new Error('Method not implemented.')
  }
  resolveLValue(): LValue {
    throw CodeError.invalidAssignmentTarget({ name: this.typeDescription, sourceLocation: this.sourceLocation })
  }
  private _ptype: GlobalStateType<PType>
  private _expr: Expression | undefined
  constructor(expr: Expression | undefined, ptype: PType, config: { initialValue?: Expression; sourceLocation: SourceLocation }) {
    const sourceLocation = expr?.sourceLocation ?? config?.sourceLocation
    invariant(sourceLocation, 'Must have expression or config')
    super(sourceLocation)
    invariant(ptype instanceof GlobalStateType, 'ptype must be GlobalStateType')
    this._ptype = ptype
    this._expr = expr
  }

  get ptype(): PType {
    return this._ptype
  }

  buildStorageDefinition(memberName: string, memberLocation: SourceLocation, contractType: ContractClassType): AppStorageDeclaration {
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
