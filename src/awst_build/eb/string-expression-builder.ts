import { SourceLocation } from '../../awst/source-location'
import { nodeFactory } from '../../awst/node-factory'
import { CodeError } from '../../errors'
import { awst, wtypes } from '../../awst'
import { FunctionBuilder, InstanceBuilder, InstanceExpressionBuilder, LiteralExpressionBuilder, NodeBuilder } from './index'
import { bytesPType, PType, stringPType } from '../ptypes'
import { BytesBinaryOperator, BytesEncoding, EqualityComparison, Expression } from '../../awst/nodes'
import { requireExpressionOfType } from './util'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { utf8ToUint8Array } from '../../util'
import { UInt64ExpressionBuilder } from './uint64-expression-builder'

export class StringFunctionBuilder extends FunctionBuilder {
  taggedTemplate(head: string, spans: ReadonlyArray<readonly [InstanceBuilder, string]>, sourceLocation: SourceLocation): InstanceBuilder {
    let result: awst.Expression = nodeFactory.stringConstant({
      sourceLocation,
      value: head,
    })
    for (const [value, joiningText] of spans) {
      const valueBytes = value.ptype?.equals(stringPType) ? value.resolve() : value.toBytes(sourceLocation)
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
    return new StringExpressionBuilder(result)
  }

  call(args: Array<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    if (args.length === 0) {
      return new StringExpressionBuilder(
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
        if (arg0.ptype.equals(bytesPType)) {
          return new StringExpressionBuilder(
            nodeFactory.reinterpretCast({
              expr: arg0.resolve(),
              sourceLocation,
              wtype: wtypes.stringWType,
            }),
          )
        }
      }
    }
    throw CodeError.unexpectedUnhandledArgs({ sourceLocation })
  }
}

export class StringExpressionBuilder extends InstanceExpressionBuilder {
  get ptype() {
    return stringPType
  }

  boolEval(sourceLocation: SourceLocation, negate = false): Expression {
    return nodeFactory.bytesComparisonExpression({
      lhs: this._expr,
      rhs: nodeFactory.bytesConstant({ value: new Uint8Array(), sourceLocation }),
      sourceLocation,
      wtype: wtypes.boolWType,
      operator: negate ? EqualityComparison.eq : EqualityComparison.ne,
    })
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'concat':
        return new ConcatExpressionBuilder(this._expr)
    }
    return super.memberAccess(name, sourceLocation)
  }
  toBytes(sourceLocation: SourceLocation): awst.Expression {
    if (this._expr instanceof awst.StringConstant) {
      return nodeFactory.bytesConstant({
        value: utf8ToUint8Array(this._expr.value),
        encoding: BytesEncoding.utf8,
        sourceLocation: this._expr.sourceLocation,
      })
    }
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

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation) {
    const others = args.map((a) => requireExpressionOfType(a, stringPType, sourceLocation))
    return new StringExpressionBuilder(
      others.reduce(
        (acc, cur) =>
          intrinsicFactory.bytesConcat({
            left: acc,
            right: cur,
            sourceLocation: sourceLocation,
          }),
        this.expr,
      ),
    )
  }
}
