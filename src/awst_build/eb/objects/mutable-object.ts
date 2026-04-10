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
    return this.ptype.properties.some(({ name: propName }) => propName === name) || super.hasProperty(name)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const field = this.ptype.properties.find((field) => field.name === name)
    if (field !== undefined) {
      return instanceEb(
        nodeFactory.fieldExpression({
          name,
          sourceLocation,
          wtype: field.ptype.wtypeOrThrow,
          base: this._expr,
        }),
        field.ptype,
      )
    }
    return super.memberAccess(name, sourceLocation)
  }

  resolvableToPType(ptype: PTypeOrClass): boolean {
    if (ptype.equals(this.ptype)) return true

    if (instanceOfAny(ptype, ImmutableObjectPType, MutableObjectPType)) {
      return ptype.properties.every(
        ({ name, ptype }) =>
          this.hasProperty(name) && requestInstanceBuilder(this.memberAccess(name, this.sourceLocation))?.resolvableToPType(ptype),
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
            ptype.properties.map(({ name, ptype }) => [
              name,
              requireExpressionOfType(single.memberAccess(name, this.sourceLocation), ptype),
            ]),
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
          items: ptype.properties.map(({ name, ptype }) => requireExpressionOfType(single.memberAccess(name, this.sourceLocation), ptype)),
          sourceLocation: this.sourceLocation,
          wtype: ptype.wtype,
        }),
        ptype,
      )
    }
    return super.resolveToPType(ptype)
  }
}
