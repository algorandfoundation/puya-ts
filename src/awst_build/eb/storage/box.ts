import { Expression } from '../../../awst/nodes'
import { bytesPType, PType } from '../../ptypes'
import { FunctionBuilder, InstanceBuilder, InstanceExpressionBuilder, NodeBuilder } from '../index'
import { BoxPType } from '../../ptypes/ptype-classes'
import { codeInvariant, invariant } from '../../../util'
import { SourceLocation } from '../../../awst/source-location'
import { ObjectLiteralExpressionBuilder } from '../literal/object-literal-expression-builder'
import { requireExpressionOfType } from '../util'
import { CodeError } from '../../../errors'
import { ValueProxy } from './value-proxy'
import { nodeFactory } from '../../../awst/node-factory'
import { typeRegistry } from '../../type-registry'

export class BoxFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const [contentPType] = typeArgs
    if (args.length !== 1) {
      throw CodeError.unexpectedUnhandledArgs({ sourceLocation })
    }
    const [arg0] = args
    codeInvariant(arg0 instanceof ObjectLiteralExpressionBuilder, 'Expected object literal')

    if (!arg0.hasProperty('key')) throw new CodeError(`Missing required property 'key'`)

    const key: Expression = requireExpressionOfType(arg0.memberAccess('key', sourceLocation), bytesPType, sourceLocation)
    codeInvariant(contentPType, `Generic arg 'TValue'`)
    const ptype = new BoxPType({ content: contentPType })
    return new BoxExpressionBuilder(key, ptype)
  }
}

export class BoxExpressionBuilder extends InstanceExpressionBuilder<BoxPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof BoxPType, 'BoxExpressionBuilder must be constructed with ptype of BoxPType')
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'value':
        return new BoxValueExpressionBuilder(
          nodeFactory.boxValueExpression({
            key: this._expr,
            sourceLocation,
            wtype: this.ptype.contentType.wtypeOrThrow,
            existsAssertionMessage: '',
          }),
          this.ptype.contentType,
        )
    }
    return super.memberAccess(name, sourceLocation)
  }
}

/**
 * Wraps the box value expression and watches for certain expressions which can be optimized.
 *
 * For example box.value.bytes.slice(...) can be optimized to use box_extract directly rather
 * than reading the entire box into memory and then slicing it. All unhandled scenarios are proxied
 * through to the underlying builder for the given type.
 */
export class BoxValueExpressionBuilder extends ValueProxy<PType> {
  assign(other: InstanceBuilder, sourceLocation: SourceLocation): InstanceBuilder {
    const value = requireExpressionOfType(other, this.ptype, sourceLocation)
    return typeRegistry.getInstanceEb(
      nodeFactory.assignmentExpression({
        target: this.resolveLValue(),
        value,
        sourceLocation,
        wtype: this.ptype.wtypeOrThrow,
      }),
      this.ptype,
    )
  }
}
