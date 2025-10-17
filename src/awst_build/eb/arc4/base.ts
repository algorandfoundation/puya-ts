import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import { EqualityComparison } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { wtypes } from '../../../awst/wtypes'
import { tryConvertEnum } from '../../../util'
import { biguintPType, bytesPType, type PType, uint64PType, voidPType } from '../../ptypes'
import type { ARC4EncodedType } from '../../ptypes/arc4-types'
import { instanceEb } from '../../type-registry'
import { BooleanExpressionBuilder } from '../boolean-expression-builder'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { BuilderComparisonOp, FunctionBuilder, InstanceExpressionBuilder } from '../index'
import { requireBuilderOfType } from '../util'
import { parseFunctionArgs } from '../util/arg-parsing'

export class Arc4EncodedBaseExpressionBuilder<T extends ARC4EncodedType> extends InstanceExpressionBuilder<T> {
  constructor(expr: Expression, ptype: T) {
    super(expr, ptype)
  }

  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    const equalityOp = tryConvertEnum(op, BuilderComparisonOp, EqualityComparison)

    switch (equalityOp) {
      case EqualityComparison.eq:
      case EqualityComparison.ne:
        return new BooleanExpressionBuilder(
          nodeFactory.bytesComparisonExpression({
            operator: equalityOp,
            lhs: this.toBytes(sourceLocation).resolve(),
            rhs: requireBuilderOfType(other, this.ptype).toBytes(sourceLocation).resolve(),
            sourceLocation,
          }),
        )
    }
    return super.compare(other, op, sourceLocation)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'bytes':
        return this.toBytes(sourceLocation)
      case 'equals':
        return new Arc4EqualsFunctionBuilder(this, sourceLocation)
      case 'validate':
        return new ValidateFunctionBuilder(this, sourceLocation)

      case 'native':
        if (this.ptype.nativeType === undefined) break
        return instanceEb(
          nodeFactory.aRC4Decode({
            value: this.resolve(),
            sourceLocation,
            wtype: this.ptype.nativeType.wtypeOrThrow,
          }),
          this.ptype.nativeType,
        )
    }
    return super.memberAccess(name, sourceLocation)
  }

  toBytes(sourceLocation: SourceLocation): InstanceBuilder {
    return instanceEb(
      nodeFactory.reinterpretCast({
        expr: this.resolve(),
        wtype: wtypes.bytesWType,
        sourceLocation,
      }),
      bytesPType,
    )
  }
}

class ValidateFunctionBuilder extends FunctionBuilder {
  constructor(
    private target: Arc4EncodedBaseExpressionBuilder<ARC4EncodedType>,
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
      funcName: 'validate',
      argSpec: () => [],
    })

    const expr = nodeFactory.aRC4FromBytes({
      value: this.target.toBytes(this.target.sourceLocation).resolve(),
      validate: true,
      wtype: this.target.ptype.wtype,
      sourceLocation,
    })

    return instanceEb(
      nodeFactory.commaExpression({
        expressions: [expr, nodeFactory.voidConstant({ sourceLocation })],
        sourceLocation,
      }),
      voidPType,
    )
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
        lhs: this.left.toBytes(sourceLocation).resolve(),
        rhs: right.toBytes(sourceLocation).resolve(),
        sourceLocation,
      }),
    )
  }
}

export class AsUint64FunctionBuilder extends FunctionBuilder {
  constructor(
    private expr: Arc4EncodedBaseExpressionBuilder<ARC4EncodedType>,
    location: SourceLocation,
  ) {
    super(location)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    return instanceEb(
      nodeFactory.aRC4Decode({
        value: this.expr.resolve(),
        sourceLocation,
        wtype: uint64PType.wtype,
      }),
      uint64PType,
    )
  }
}

export class AsBigUintFunctionBuilder extends FunctionBuilder {
  constructor(
    private expr: Arc4EncodedBaseExpressionBuilder<ARC4EncodedType>,
    location: SourceLocation,
  ) {
    super(location)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    return instanceEb(
      nodeFactory.aRC4Decode({
        value: this.expr.resolve(),
        sourceLocation,
        wtype: biguintPType.wtype,
      }),
      biguintPType,
    )
  }
}
