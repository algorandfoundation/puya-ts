import { InstanceExpressionBuilder, type NodeBuilder } from '../index'
import { ObjectPType, type PType } from '../../ptypes'
import type { Expression } from '../../../awst/nodes'
import { invariant } from '../../../util'
import type { SourceLocation } from '../../../awst/source-location'
import { typeRegistry } from '../../type-registry'
import { nodeFactory } from '../../../awst/node-factory'

export class ObjectExpressionBuilder extends InstanceExpressionBuilder<ObjectPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof ObjectPType, `ObjectExpressionBuilder must be instantiated with ptype of ObjectPType`)
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const propertyIndex = this.ptype.orderedProperties().findIndex(([prop]) => prop === name)
    if (propertyIndex === -1) {
      return super.memberAccess(name, sourceLocation)
    }
    const propertyPtype = this.ptype.getPropertyType(name)
    return typeRegistry.getInstanceEb(
      nodeFactory.tupleItemExpression({
        index: BigInt(propertyIndex),
        sourceLocation,
        wtype: propertyPtype.wtypeOrThrow,
        base: this._expr,
      }),
      propertyPtype,
    )
  }

  hasProperty(name: string): boolean {
    return this.ptype.orderedProperties().some(([prop]) => prop === name)
  }
}
