import { intrinsicFactory } from '../../../awst/intrinsic-factory'
import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { wtypes } from '../../../awst/wtypes'
import type { PType } from '../../ptypes'
import { BytesPType, uint64PType } from '../../ptypes'
import { instanceEb } from '../../type-registry'
import type { BuilderComparisonOp, InstanceBuilder, NodeBuilder } from '../index'
import { InstanceExpressionBuilder } from '../index'
import { requireExpressionOfType } from '../util'
import { compareUint64 } from '../util/compare-uint64'

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
        wtype: new wtypes.WTuple({ types: [resultType.wtypeOrThrow, wtypes.boolWType], immutable: true }),
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

  toBytes(sourceLocation: SourceLocation): InstanceBuilder {
    return instanceEb(intrinsicFactory.itob({ value: this.resolve(), sourceLocation }), new BytesPType({ length: 8n }))
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
      wtype: wtypes.boolWType,
    })
  }

  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    const otherExpr = requireExpressionOfType(other, this.ptype)
    return compareUint64(this.resolve(), otherExpr, op, sourceLocation, this.typeDescription)
  }
}
