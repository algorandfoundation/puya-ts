import { awst, wtypes } from '../../awst'
import { FunctionBuilder, InstanceBuilder, InstanceExpressionBuilder, NodeBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { nodeFactory } from '../../awst/node-factory'
import { CodeError } from '../../errors'
import { UInt64ExpressionBuilder } from './uint64-expression-builder'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { requireExpressionsOfType } from './util'
import { BytesFunction, bytesPType, PType, uint64PType } from '../ptypes'

export class BytesFunctionBuilder extends FunctionBuilder {
  get ptype(): PType | undefined {
    return BytesFunction
  }

  taggedTemplate(head: string, spans: ReadonlyArray<readonly [InstanceBuilder, string]>, sourceLocation: SourceLocation): InstanceBuilder {
    // TODO: convert head and concat spans
    return new BytesExpressionBuilder(
      nodeFactory.bytesConstant({
        sourceLocation,
        value: new Uint8Array(),
      }),
    )
  }

  call(args: Array<InstanceBuilder>, sourceLocation: SourceLocation): InstanceBuilder {
    if (args.length === 0) {
      return new BytesExpressionBuilder(
        nodeFactory.bytesConstant({
          sourceLocation,
          value: new Uint8Array(),
        }),
      )
    }
    // const [arg0] = args
    // if (arg0 instanceof Literal && arg0.value instanceof Uint8Array) {
    //   return new BytesExpressionBuilder(
    //     nodeFactory.bytesConstant({
    //       sourceLocation,
    //       value: arg0.value,
    //     }),
    //   )
    // }
    throw CodeError.unexpectedUnhandledArgs({ sourceLocation })
  }
}

export class BytesExpressionBuilder extends InstanceExpressionBuilder {
  get ptype() {
    return bytesPType
  }
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'length':
        return new UInt64ExpressionBuilder(
          intrinsicFactory.bytesLen({
            value: this._expr,
            sourceLocation,
          }),
        )
      case 'concat':
        return new ConcatExpressionBuilder(this._expr)
      case 'at':
        return new BytesAtBuilder(this._expr)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export class ConcatExpressionBuilder extends FunctionBuilder {
  constructor(private expr: awst.Expression) {
    super(expr.sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, sourceLocation: SourceLocation) {
    const [other] = requireExpressionsOfType(args, [bytesPType], sourceLocation)
    return new BytesExpressionBuilder(
      intrinsicFactory.bytesConcat({
        left: this.expr,
        right: other,
        sourceLocation: sourceLocation,
      }),
    )
  }
}

export class BytesSliceBuilder extends FunctionBuilder {
  constructor(private expr: awst.Expression) {
    super(expr.sourceLocation)
  }
  call(args: ReadonlyArray<InstanceBuilder>, sourceLocation: SourceLocation) {
    // TODO: Needs to do range check on target and handle negative values
    // TODO: Also handle single arg
    const [start, stop] = requireExpressionsOfType(args, [uint64PType, uint64PType], sourceLocation)
    return new BytesExpressionBuilder(
      nodeFactory.sliceExpression({
        base: this.expr,
        sourceLocation: sourceLocation,
        beginIndex: start,
        endIndex: stop,
        wtype: wtypes.bytesWType,
      }),
    )
  }
}

export class BytesAtBuilder extends FunctionBuilder {
  constructor(private expr: awst.Expression) {
    super(expr.sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, sourceLocation: SourceLocation) {
    const [index] = requireExpressionsOfType(args, [uint64PType], sourceLocation)
    // TODO: Needs to do range check on target and handle negative values
    return new BytesExpressionBuilder(
      nodeFactory.sliceExpression({
        base: this.expr,
        sourceLocation: sourceLocation,
        beginIndex: index,
        endIndex: nodeFactory.uInt64Constant({ value: 1n, sourceLocation }),
        wtype: wtypes.bytesWType,
      }),
    )
  }
}
