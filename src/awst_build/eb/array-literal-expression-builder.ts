import { InstanceBuilder } from './index'
import type { SourceLocation } from '../../awst/source-location'
import type { Expression, LValue } from '../../awst/nodes'
import type { PType } from '../ptypes'

export class ArrayLiteralExpressionBuilder extends InstanceBuilder {
  constructor(
    sourceLocation: SourceLocation,
    private readonly items: InstanceBuilder[],
  ) {
    super(sourceLocation)
  }

  resolve(): Expression {
    throw new Error('Method not implemented.')
  }
  resolveLValue(): LValue {
    throw new Error('Method not implemented.')
  }
  get ptype(): PType {
    throw new Error('Method not implemented.')
  }

  resolveItems(): InstanceBuilder[] {
    return this.items
  }
}
