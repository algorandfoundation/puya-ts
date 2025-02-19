import type { SourceLocation } from '../../awst/source-location'
import { CodeError } from '../../errors'
import type { PType } from '../ptypes'
import type { InstanceBuilder } from './index'
import { NodeBuilder } from './index'
import { isStaticallyIterable, StaticIterator } from './traits/static-iterator'

export class SpreadExpressionBuilder extends NodeBuilder {
  ptype: PType | undefined = undefined
  constructor(
    private baseExpression: InstanceBuilder,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  getSpreadItems(): InstanceBuilder[] {
    if (isStaticallyIterable(this.baseExpression)) {
      return this.baseExpression[StaticIterator]()
    }
    throw new CodeError(`Spread operator is not supported on ${this.baseExpression.typeDescription}`, {
      sourceLocation: this.sourceLocation,
    })
  }
}
