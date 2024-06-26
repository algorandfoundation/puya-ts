import { FunctionBuilder, InstanceBuilder, InstanceExpressionBuilder } from '../index'
import { SourceLocation } from '../../../awst/source-location'
import { bytesPType, PType } from '../../ptypes'
import { Expression } from '../../../awst/nodes'
import { GlobalStateType } from '../../ptypes/ptype-classes'
import { codeInvariant, invariant } from '../../../util'
import { CodeError } from '../../../errors'
import { ObjectLiteralExpressionBuilder } from '../object-literal-expression-builder'
import { requireExpressionOfType, requireInstanceBuilder } from '../util'
import { nodeFactory } from '../../../awst/node-factory'

export class GlobalStateFunctionBuilder extends FunctionBuilder {
  constructor(sourceLocation: SourceLocation) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    let [contentPType] = typeArgs
    let initialValue: Expression | undefined
    let key: Expression = nodeFactory.bytesConstant({ value: new Uint8Array(), sourceLocation })
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
    return new GlobalStateFunctionResult(key, ptype, { initialValue })
  }
}

export class GlobalStateProxyBuilder extends InstanceExpressionBuilder {
  private _ptype: PType
  constructor(expr: Expression, ptype: PType) {
    super(expr)
    invariant(ptype instanceof GlobalStateType, 'ptype must be GlobalStateType')
    this._ptype = ptype
  }

  get ptype(): PType | undefined {
    return this._ptype
  }
}
export class GlobalStateFunctionResult extends GlobalStateProxyBuilder {
  constructor(expr: Expression, ptype: PType, { initialValue }: { initialValue?: Expression }) {
    super(expr, ptype)
  }
}
