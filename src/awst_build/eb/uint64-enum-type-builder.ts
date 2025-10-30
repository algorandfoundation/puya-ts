import { nodeFactory } from '../../awst/node-factory'
import type { Expression } from '../../awst/nodes'
import { IntegerConstant } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'
import { invariant } from '../../util'
import type { PType, PTypeOrClass } from '../ptypes'
import { Uint64EnumMemberLiteralType, Uint64EnumMemberType, Uint64EnumType, uint64PType } from '../ptypes'
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
    if (ptype.equals(this.ptype)) return true
    if (ptype instanceof Uint64EnumMemberLiteralType) {
      return (
        ptype.enumType.equals(this.ptype.enumType) &&
        this._expr instanceof IntegerConstant &&
        this.ptype.enumType.hasMember(this._expr.value)
      )
    }
    if (ptype instanceof Uint64EnumMemberType) {
      return ptype.enumType.equals(this.ptype.enumType)
    }
    return ptype.equals(this.ptype) || ptype.equals(uint64PType)
  }
  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (ptype.equals(this.ptype)) {
      return this
    }
    if (
      ptype instanceof Uint64EnumMemberLiteralType &&
      ptype.enumType.equals(this.ptype.enumType) &&
      this._expr instanceof IntegerConstant &&
      this.ptype.enumType.hasMember(this._expr.value)
    ) {
      // Narrow to literal member
      return instanceEb(this._expr, this.ptype.enumType.getMemberLiteral(this._expr.value))
    }
    if (ptype instanceof Uint64EnumMemberType && ptype.enumType.equals(this.ptype.enumType)) {
      // Widen literal member to general member
      return instanceEb(this._expr, ptype)
    }
    if (ptype.equals(uint64PType)) {
      // Widen enum member to uint64
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
