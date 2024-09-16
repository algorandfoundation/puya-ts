import { InstanceExpressionBuilder } from './index'
import { CodeError } from '../../errors'
import { IterableIteratorType, type PType } from '../ptypes'
import type { Expression } from '../../awst/nodes'
import { invariant } from '../../util'
import type { SourceLocation } from '../../awst/source-location'
import type { awst } from '../../awst'

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
