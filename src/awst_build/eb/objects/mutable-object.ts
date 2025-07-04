import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { instanceOfAny, invariant } from '../../../util'
import { ImmutableObjectPType, MutableObjectPType, type PType, type PTypeOrClass } from '../../ptypes'

import { instanceEb } from '../../type-registry'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { InstanceExpressionBuilder } from '../index'
import { requestInstanceBuilder, requireExpressionOfType } from '../util'

export class MutableObjectExpressionBuilder extends InstanceExpressionBuilder<MutableObjectPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof MutableObjectPType, 'ptype must be MutableObjectPType')
    super(expr, ptype)
  }

  hasProperty(name: string): boolean {
    return name in this.ptype.properties || super.hasProperty(name)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    if (name in this.ptype.properties) {
      const fieldType = this.ptype.properties[name]
      return instanceEb(
        nodeFactory.fieldExpression({
          name,
          sourceLocation,
          wtype: fieldType.wtypeOrThrow,
          base: this._expr,
        }),
        fieldType,
      )
    }
    return super.memberAccess(name, sourceLocation)
  }

  resolvableToPType(ptype: PTypeOrClass): boolean {
    if (ptype.equals(this.ptype)) return true

    if (instanceOfAny(ptype, ImmutableObjectPType, MutableObjectPType)) {
      return ptype
        .orderedProperties()
        .every(
          ([prop, propType]) =>
            this.hasProperty(prop) && requestInstanceBuilder(this.memberAccess(prop, this.sourceLocation))?.resolvableToPType(propType),
        )
    }
    return false
  }

  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (ptype.equals(this.ptype)) {
      return this
    }
    if (ptype instanceof MutableObjectPType) {
      const single = this.singleEvaluation()
      return instanceEb(
        nodeFactory.newStruct({
          values: new Map(
            ptype
              .orderedProperties()
              .map(([prop, propType]) => [prop, requireExpressionOfType(single.memberAccess(prop, this.sourceLocation), propType)]),
          ),
          sourceLocation: this.sourceLocation,
          wtype: ptype.wtype,
        }),
        ptype,
      )
    }

    if (ptype instanceof ImmutableObjectPType) {
      const single = this.singleEvaluation()
      return instanceEb(
        nodeFactory.tupleExpression({
          items: ptype
            .orderedProperties()
            .map(([prop, propType]) => requireExpressionOfType(single.memberAccess(prop, this.sourceLocation), propType)),
          sourceLocation: this.sourceLocation,
          wtype: ptype.wtype,
        }),
        ptype,
      )
    }
    return super.resolveToPType(ptype)
  }
}
