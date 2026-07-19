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
    invariant(ptype instanceof ImmutableObjectPType, `ObjectExpressionBuilder must be instantiated with ptype of ImmutableObjectPType`)
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    if (this.hasProperty(name)) {
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
    return super.memberAccess(name, sourceLocation)
  }

  hasProperty(name: string): boolean {
    return this.ptype.properties.some(({ name: propName }) => propName === name)
  }

  resolvableToPType(ptype: PTypeOrClass): ptype is ImmutableObjectPType {
    if (ptype instanceof ImmutableObjectPType) {
      return ptype.properties.every(({ name, ptype }) => hasPropertyOfType(this.ptype, name, ptype, this.sourceLocation))
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
          items: ptype.properties.map(({ name, ptype }) => requireExpressionOfType(base.memberAccess(name, this.sourceLocation), ptype)),
          wtype: ptype.wtype,
        }),
        ptype,
      )
    }
    throw CodeError.cannotResolveToType({ sourceType: this.ptype, targetType: ptype, sourceLocation: this.sourceLocation })
  }
}
