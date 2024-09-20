import type { BuilderComparisonOp, InstanceBuilder, NodeBuilder } from '../index'
import { InstanceExpressionBuilder } from '../index'
import type { PType } from '../../ptypes'
import { uint64PType } from '../../ptypes'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { instanceEb } from '../../type-registry'
import { nodeFactory } from '../../../awst/node-factory'
import { boolWType, WTuple } from '../../../awst/wtypes'
import { requireExpressionOfType } from '../util'
import { compareUint64 } from '../util/compare-uint64'
import { intrinsicFactory } from '../../../awst/intrinsic-factory'

export type FieldMapping = Record<string, [string, PType]>

export abstract class ReferenceTypeExpressionBuilder extends InstanceExpressionBuilder<PType> {
  constructor(
    expr: Expression,
    protected options: {
      ptype: PType
      backingType: PType
      backingMember: string
      fieldMapping: FieldMapping
      fieldOpCode: string
      fieldBoolComment: string
    },
  ) {
    super(expr, options.ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    if (name === this.options.backingMember) {
      return instanceEb(
        nodeFactory.reinterpretCast({
          expr: this.resolve(),
          wtype: this.options.backingType.wtypeOrThrow,
          sourceLocation,
        }),
        this.options.backingType,
      )
    }
    if (name in this.options.fieldMapping) {
      const [immediate, resultType] = this.options.fieldMapping[name]
      const op = nodeFactory.intrinsicCall({
        opCode: this.options.fieldOpCode,
        immediates: [immediate],
        stackArgs: [this.resolve()],
        wtype: new WTuple({ types: [resultType.wtypeOrThrow, boolWType], immutable: true }),
        sourceLocation,
      })
      return instanceEb(nodeFactory.checkedMaybe({ expr: op, comment: this.options.fieldBoolComment }), resultType)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export abstract class Uint64BackedReferenceTypeExpressionBuilder extends ReferenceTypeExpressionBuilder {
  constructor(
    expr: Expression,
    options: {
      ptype: PType
      backingMember: string
      fieldMapping: FieldMapping
      fieldOpCode: string
      fieldBoolComment: string
    },
  ) {
    super(expr, {
      backingType: uint64PType,
      ...options,
    })
  }

  toBytes(sourceLocation: SourceLocation): Expression {
    return intrinsicFactory.itob({ value: this.resolve(), sourceLocation })
  }
  boolEval(sourceLocation: SourceLocation, negate: boolean = false): Expression {
    if (negate) {
      return nodeFactory.not({
        expr: this.resolve(),
        sourceLocation,
      })
    }
    return nodeFactory.reinterpretCast({
      sourceLocation,
      expr: this.resolve(),
      wtype: boolWType,
    })
  }

  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    const otherExpr = requireExpressionOfType(other, this.ptype)
    return compareUint64(this.resolve(), otherExpr, op, sourceLocation, this.typeDescription)
  }
}
