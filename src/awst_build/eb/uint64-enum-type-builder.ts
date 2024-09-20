import { nodeFactory } from '../../awst/node-factory'
import type { Expression } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { invariant } from '../../util'
import type { PType } from '../ptypes'
import { Uint64EnumMemberType, Uint64EnumType } from '../ptypes'
import { InstanceExpressionBuilder, NodeBuilder } from './index'

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
}
