import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { CodeError } from '../../../errors'
import { invariant } from '../../../util'
import type { ImmutableObjectPType, MutableObjectPType, PTypeOrClass } from '../../ptypes'
import { isObjectType, ObjectLiteralPType, type PType } from '../../ptypes'
import { getPropertyType } from '../../ptypes/visitors/index-type-visitor'
import { instanceEb } from '../../type-registry'
import type { InstanceBuilder } from '../index'
import { InstanceExpressionBuilder, type NodeBuilder } from '../index'
import { requestInstanceBuilder } from '../util'
import { createObject } from './util'

export class ResolvedObjectLiteralExpressionBuilder extends InstanceExpressionBuilder<ObjectLiteralPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(
      ptype instanceof ObjectLiteralPType,
      `ResolvedObjectLiteralExpressionBuilder must be instantiated with ptype of ObjectLiteralPType`,
    )
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    if (name in this.ptype.properties) {
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
    return name in this.ptype.properties
  }

  resolvableToPType(ptype: PTypeOrClass): ptype is ObjectLiteralPType | ImmutableObjectPType | MutableObjectPType {
    if (isObjectType(ptype)) {
      return ptype
        .orderedProperties()
        .every(([prop, propType]) => requestInstanceBuilder(this.memberAccess(prop, this.sourceLocation))?.resolvableToPType(propType))
    }
    return false
  }

  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (ptype.equals(this.ptype)) {
      return this
    }
    if (this.resolvableToPType(ptype)) {
      const base = this.singleEvaluation()

      return instanceEb(createObject(ptype, base), ptype)
    }
    throw CodeError.cannotResolveToType({ sourceType: this.ptype, targetType: ptype, sourceLocation: this.sourceLocation })
  }
}
