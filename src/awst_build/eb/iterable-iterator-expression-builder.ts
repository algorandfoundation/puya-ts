import type { awst } from '../../awst'
import type { Expression } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError } from '../../errors'
import { invariant } from '../../util'
import { IterableIteratorType, type PType } from '../ptypes'
import { InstanceExpressionBuilder } from './index'

export class IterableIteratorExpressionBuilder extends InstanceExpressionBuilder<IterableIteratorType> {
  resolve(): awst.Expression {
    throw new CodeError(`${this.typeDescription} can only be used in for loops`, { sourceLocation: this.sourceLocation })
  }

  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof IterableIteratorType, 'ptype must be instance of IterableIteratorType')
    super(expr, ptype)
  }

  iterate(sourceLocation: SourceLocation): Expression {
    return this._expr
  }
}
