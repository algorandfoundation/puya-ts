import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import { EqualityComparison } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { wtypes } from '../../../awst/wtypes'
import { CodeError } from '../../../errors'
import type { PType } from '../../ptypes'
import type { ARC4EncodedType } from '../../ptypes/arc4-types'
import { BooleanExpressionBuilder } from '../boolean-expression-builder'
import { BytesExpressionBuilder } from '../bytes-expression-builder'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { BuilderComparisonOp, FunctionBuilder, InstanceExpressionBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'

export class Arc4EncodedBaseExpressionBuilder<T extends ARC4EncodedType> extends InstanceExpressionBuilder<T> {
  constructor(expr: Expression, ptype: T) {
    super(expr, ptype)
  }

  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    switch (op) {
      case BuilderComparisonOp.eq:
      case BuilderComparisonOp.ne:
        throw new CodeError(`${op} operator is not supported on ${this.typeDescription}. Use 'equals' method instead`, { sourceLocation })
    }
    return super.compare(other, op, sourceLocation)
  }

  //
  // compare(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
  //   switch (op) {
  //     case Bu
  //   }
  //   return super.binaryOp(other, op, sourceLocation);
  // }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'bytes':
        return new BytesExpressionBuilder(this.toBytes(sourceLocation))
      case 'equals':
        return new Arc4EqualsFunctionBuilder(this, sourceLocation)
    }
    return super.memberAccess(name, sourceLocation)
  }

  toBytes(sourceLocation: SourceLocation): Expression {
    return nodeFactory.reinterpretCast({
      expr: this.resolve(),
      wtype: wtypes.bytesWType,
      sourceLocation,
    })
  }
}

class Arc4EqualsFunctionBuilder extends FunctionBuilder {
  constructor(
    private left: Arc4EncodedBaseExpressionBuilder<ARC4EncodedType>,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [right],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: 'equals',
      argSpec: (a) => [a.required(this.left.ptype)],
    })
    return new BooleanExpressionBuilder(
      nodeFactory.bytesComparisonExpression({
        operator: EqualityComparison.eq,
        lhs: this.left.toBytes(sourceLocation),
        rhs: right.toBytes(sourceLocation),
        sourceLocation,
      }),
    )
  }
}
