import { InstanceBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { Expression, LValue } from '../../awst/nodes'
import { bigintLiteralPType, boolPType, PType, stringLiteralPType } from '../ptypes'
import { nodeFactory } from '../../awst/node-factory'

type ConstantValue = bigint | string | Uint8Array | boolean

export class LiteralExpressionBuilder extends InstanceBuilder {
  resolve(): Expression {
    if (typeof this.value === 'boolean') {
      return nodeFactory.boolConstant({
        value: this.value,
        sourceLocation: this.sourceLocation,
      })
    }
    throw new Error('A literal is not valid at this point.')
  }
  resolveLValue(): LValue {
    throw new Error('Method not implemented.')
  }
  get ptype(): PType | undefined {
    return this._ptype
  }
  private readonly _ptype: PType | undefined
  constructor(
    public readonly value: ConstantValue,
    location: SourceLocation,
  ) {
    super(location)
    switch (typeof this.value) {
      case 'boolean':
        this._ptype = boolPType
        break
      case 'string':
        this._ptype = stringLiteralPType
        break
      case 'bigint':
        this._ptype = bigintLiteralPType
        break
    }
  }
}
