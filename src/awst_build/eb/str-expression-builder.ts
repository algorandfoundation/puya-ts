import { SourceLocation } from '../../awst/source-location'
import { nodeFactory } from '../../awst/node-factory'
import { CodeError } from '../../errors'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { requireExpressionsOfType } from './util'
import { awst, wtypes } from '../../awst'
import { FunctionBuilder, InstanceBuilder, InstanceExpressionBuilder, NodeBuilder } from './index'
import { bytesPType, strPType } from '../ptypes'
import { LiteralExpressionBuilder } from './literal-expression-builder'
import { BytesBinaryOperator } from '../../awst/nodes'

export class StrFunctionBuilder extends FunctionBuilder {
  taggedTemplate(head: string, spans: ReadonlyArray<readonly [InstanceBuilder, string]>, sourceLocation: SourceLocation): InstanceBuilder {
    // TODO: convert head and concat spans
    let result: awst.Expression = nodeFactory.stringConstant({
      sourceLocation,
      value: head,
    })
    for (const [value, joiningText] of spans) {
      const valueBytes = value.ptype?.equals(strPType) ? value.resolve() : value.toBytes(sourceLocation)
      result = nodeFactory.bytesBinaryOperation({
        left: result,
        right: valueBytes,
        op: BytesBinaryOperator.add,
        sourceLocation,
        wtype: wtypes.stringWType,
      })
      if (joiningText) {
        result = nodeFactory.bytesBinaryOperation({
          left: result,
          right: nodeFactory.stringConstant({
            sourceLocation,
            value: joiningText,
          }),
          op: BytesBinaryOperator.add,
          sourceLocation,
          wtype: wtypes.stringWType,
        })
      }
    }
    return new StrExpressionBuilder(result)
  }

  call(args: Array<InstanceBuilder>, sourceLocation: SourceLocation): InstanceBuilder {
    if (args.length === 0) {
      return new StrExpressionBuilder(
        nodeFactory.stringConstant({
          sourceLocation,
          value: '',
        }),
      )
    }
    if (args.length === 1) {
      const [arg0] = args
      if (arg0 instanceof LiteralExpressionBuilder) {
        throw new CodeError('TODO: Handle literal')
      } else {
        if (arg0.ptype?.equals(bytesPType)) {
          return new StrExpressionBuilder(
            nodeFactory.reinterpretCast({
              expr: arg0.resolve(),
              sourceLocation,
              wtype: wtypes.stringWType,
            }),
          )
        }
      }
    }
    // const [arg0] = args
    // if (arg0 instanceof Literal) {
    //   if (typeof arg0.value === 'string') {
    //     return new StrExpressionBuilder(
    //       nodeFactory.stringConstant({
    //         sourceLocation,
    //         value: arg0.value,
    //       }),
    //     )
    //   } else if (arg0.value instanceof Uint8Array) {
    //     return new StrExpressionBuilder(
    //       nodeFactory.reinterpretCast({
    //         expr: nodeFactory.bytesConstant({
    //           sourceLocation,
    //           value: arg0.value,
    //         }),
    //         sourceLocation,
    //         wtype: wtypes.stringWType,
    //       }),
    //     )
    //   }
    // }
    throw CodeError.unexpectedUnhandledArgs({ sourceLocation })
  }
}

export class StrExpressionBuilder extends InstanceExpressionBuilder {
  get ptype() {
    return strPType
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'concat':
        return new ConcatExpressionBuilder(this._expr)
    }
    return super.memberAccess(name, sourceLocation)
  }

  toBytes(sourceLocation: SourceLocation): awst.Expression {
    return nodeFactory.reinterpretCast({
      expr: this._expr,
      sourceLocation,
      wtype: wtypes.bytesWType,
    })
  }
}

export class ConcatExpressionBuilder extends FunctionBuilder {
  constructor(private expr: awst.Expression) {
    super(expr.sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, sourceLocation: SourceLocation) {
    const [other] = requireExpressionsOfType(args, [strPType], sourceLocation)
    return new StrExpressionBuilder(
      intrinsicFactory.bytesConcat({
        left: this.expr,
        right: other,
        sourceLocation: sourceLocation,
      }),
    )
  }
}
