import { NodeBuilder } from './index'
import type { SourceLocation } from '../../awst/source-location'
import type { PType } from '../ptypes'
import { Uint64EnumType } from '../ptypes'
import { invariant } from '../../util'
import { UInt64ExpressionBuilder } from './uint64-expression-builder'
import { nodeFactory } from '../../awst/node-factory'

export class Uint64EnumTypeBuilder extends NodeBuilder {
  readonly ptype: Uint64EnumType
  constructor(sourceLocation: SourceLocation, ptype: PType) {
    super(sourceLocation)
    invariant(ptype instanceof Uint64EnumType, 'ptype must be Uint64EnumType')
    this.ptype = ptype
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    if (name in this.ptype.members) {
      // TODO: Should enum members have a specific type?
      return new UInt64ExpressionBuilder(
        nodeFactory.uInt64Constant({
          value: this.ptype.members[name],
          sourceLocation,
        }),
      )
    }
    return super.memberAccess(name, sourceLocation)
  }
}
