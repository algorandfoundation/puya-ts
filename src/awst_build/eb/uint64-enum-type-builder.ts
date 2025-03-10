import { nodeFactory } from '../../awst/node-factory'
import type { Expression } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'
import { invariant } from '../../util'
import type { PType, PTypeOrClass } from '../ptypes'
import { Uint64EnumMemberType, Uint64EnumType, uint64PType } from '../ptypes'
import { instanceEb } from '../type-registry'
import type { BuilderComparisonOp, InstanceBuilder } from './index'
import { InstanceExpressionBuilder, NodeBuilder } from './index'
import { requireExpressionOfType } from './util'
import { compareUint64 } from './util/compare-uint64'

export class Uint64EnumTypeBuilder extends NodeBuilder {
  readonly ptype: Uint64EnumType
  constructor(sourceLocation: SourceLocation, ptype: PType) {
    super(sourceLocation)
    invariant(ptype instanceof Uint64EnumType, 'ptype must be Uint64EnumType')
    this.ptype = ptype
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    if (name in this.ptype.members) {
      return new Uint64EnumMemberExpressionBuilder(
        nodeFactory.uInt64Constant({
          value: this.ptype.members[name],
          sourceLocation,
        }),
        this.ptype.memberType,
      )
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export class Uint64EnumMemberExpressionBuilder extends InstanceExpressionBuilder<Uint64EnumMemberType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof Uint64EnumMemberType, 'ptype must be Uint64EnumType')
    super(expr, ptype)
  }

  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    const otherExpr = requireExpressionOfType(other, uint64PType)
    return compareUint64(this._expr, otherExpr, op, sourceLocation, this.typeDescription)
  }

  resolvableToPType(ptype: PTypeOrClass): boolean {
    return ptype.equals(this.ptype) || ptype.equals(uint64PType)
  }
  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (ptype.equals(uint64PType)) {
      return instanceEb(
        nodeFactory.reinterpretCast({
          expr: this._expr,
          wtype: wtypes.uint64WType,
          sourceLocation: this.sourceLocation,
        }),
        uint64PType,
      )
    }
    return super.resolveToPType(ptype)
  }
}
