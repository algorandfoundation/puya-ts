import { Expression, LValue } from '../../awst/nodes'
import { PType } from '../ptypes'
import { InstanceBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { codeInvariant } from '../../util'

export class ObjectLiteralExpressionBuilder extends InstanceBuilder {
  constructor(
    sourceLocation: SourceLocation,
    private readonly properties: Record<string, InstanceBuilder>,
  ) {
    super(sourceLocation)
  }

  resolve(): Expression {
    throw new Error('Method not implemented.')
  }
  resolveLValue(): LValue {
    throw new Error('Method not implemented.')
  }
  get ptype(): PType | undefined {
    throw new Error('Method not implemented.')
  }

  resolveProperty(name: string, sourceLocation: SourceLocation): InstanceBuilder {
    codeInvariant(Object.hasOwn(this.properties, name), `${name} is required`, sourceLocation)
    return this.properties[name]
  }

  hasProperty(name: string): boolean {
    return Object.hasOwn(this.properties, name)
  }
}
