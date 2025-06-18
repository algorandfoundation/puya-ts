import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { CodeError } from '../../../errors'
import { invariant } from '../../../util'
import type { PTypeOrClass } from '../../ptypes'
import { ImmutableObjectPType, type PType } from '../../ptypes'
import { getPropertyType, hasPropertyOfType } from '../../ptypes/visitors/index-type-visitor'
import { instanceEb } from '../../type-registry'
import type { InstanceBuilder } from '../index'
import { InstanceExpressionBuilder, type NodeBuilder } from '../index'
import { requireExpressionOfType } from '../util'

export class ObjectExpressionBuilder extends InstanceExpressionBuilder<ImmutableObjectPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof ImmutableObjectPType, `ObjectExpressionBuilder must be instantiated with ptype of ObjectPType`)
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const propertyIndex = this.ptype.orderedProperties().findIndex(([prop]) => prop === name)
    if (propertyIndex === -1) {
      return super.memberAccess(name, sourceLocation)
    }
    const propertyPtype = getPropertyType(this.ptype, name, sourceLocation)
    return instanceEb(
      nodeFactory.fieldExpression({
        name,
        sourceLocation,
        base: this._expr,
        wtype: propertyPtype.wtypeOrThrow,
      }),
      propertyPtype,
    )
  }

  hasProperty(name: string): boolean {
    return this.ptype.orderedProperties().some(([prop]) => prop === name)
  }

  resolvableToPType(ptype: PTypeOrClass): ptype is ImmutableObjectPType {
    if (ptype instanceof ImmutableObjectPType) {
      return ptype.orderedProperties().every(([prop, propType]) => hasPropertyOfType(this.ptype, prop, propType, this.sourceLocation))
    }
    return false
  }

  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (ptype.equals(this.ptype)) {
      return this
    }
    if (this.resolvableToPType(ptype)) {
      const base = this.singleEvaluation()
      return instanceEb(
        nodeFactory.tupleExpression({
          sourceLocation: this.sourceLocation,
          items: ptype
            .orderedProperties()
            .map(([prop, propType]) => requireExpressionOfType(base.memberAccess(prop, this.sourceLocation), propType)),
          wtype: ptype.wtype,
        }),
        ptype,
      )
    }
    throw CodeError.cannotResolveToType({ sourceType: this.ptype, targetType: ptype, sourceLocation: this.sourceLocation })
  }
}
