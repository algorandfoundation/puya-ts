import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { CodeError } from '../../../errors'
import { invariant } from '../../../util'
import type { PTypeOrClass } from '../../ptypes'
import { ObjectPType, type PType } from '../../ptypes'
import { instanceEb } from '../../type-registry'
import type { InstanceBuilder } from '../index'
import { InstanceExpressionBuilder, type NodeBuilder } from '../index'
import { requireExpressionOfType } from '../util'

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
    return instanceEb(
      nodeFactory.tupleItemExpression({
        index: BigInt(propertyIndex),
        sourceLocation,
        base: this._expr,
      }),
      propertyPtype,
    )
  }

  hasProperty(name: string): boolean {
    return this.ptype.orderedProperties().some(([prop]) => prop === name)
  }

  resolvableToPType(ptype: PTypeOrClass): ptype is ObjectPType {
    if (ptype instanceof ObjectPType) {
      return ptype.orderedProperties().every(([prop, propType]) => this.ptype.hasPropertyOfType(prop, propType))
    }
    return false
  }

  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (this.resolvableToPType(ptype)) {
      const base = this.singleEvaluation()
      return instanceEb(
        nodeFactory.tupleExpression({
          sourceLocation: this.sourceLocation,
          items: ptype
            .orderedProperties()
            .map(([prop, propType]) => requireExpressionOfType(base.memberAccess(prop, this.sourceLocation), propType)),
        }),
        ptype,
      )
    }
    throw CodeError.cannotResolveToType({ sourceType: this.ptype, targetType: ptype, sourceLocation: this.sourceLocation })
  }
}
