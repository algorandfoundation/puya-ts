import { InstanceBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { Expression, LValue } from '../../awst/nodes'
import { PType } from '../ptypes'

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
