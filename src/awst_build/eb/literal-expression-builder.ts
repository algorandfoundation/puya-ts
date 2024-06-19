import { InstanceBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { Expression, LValue } from '../../awst/nodes'
import { bigintLiteralPType, boolPType, bytesPType, PType, stringLiteralPType, uint64PType } from '../ptypes'
import { nodeFactory } from '../../awst/node-factory'
import { BytesExpressionBuilder } from './bytes-expression-builder'
import { UInt64ExpressionBuilder } from './uint64-expression-builder'
import { BoolExpressionBuilder } from './bool-expression-builder'
import { CodeError } from '../../errors'

type ConstantValue = bigint | string | Uint8Array | boolean

export class LiteralExpressionBuilder extends InstanceBuilder {
  resolve(): Expression {
    if (typeof this.value === 'boolean') {
      return nodeFactory.boolConstant({
        value: this.value,
        sourceLocation: this.sourceLocation,
      })
    }
    throw new CodeError('A literal is not valid at this point.', { sourceLocation: this.sourceLocation })
  }
  resolveLValue(): LValue {
    throw new CodeError('Method not implemented.', { sourceLocation: this.sourceLocation })
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
  resolveToPType(ptype: PType, sourceLocation: SourceLocation): InstanceBuilder {
    if (ptype.equals(bytesPType)) {
      if (this.value instanceof Uint8Array) {
        return new BytesExpressionBuilder(nodeFactory.bytesConstant({ value: this.value, sourceLocation }))
      }
    } else if (ptype.equals(uint64PType)) {
      if (typeof this.value === 'bigint') {
        return new UInt64ExpressionBuilder(nodeFactory.uInt64Constant({ value: this.value, sourceLocation }))
      }
    } else if (ptype.equals(boolPType)) {
      if (typeof this.value === 'boolean') {
        return new BoolExpressionBuilder(nodeFactory.boolConstant({ value: this.value, sourceLocation }))
      }
    }
    throw new CodeError(`Literal cannot be converted to type ${ptype.name}`, { sourceLocation })
  }
}
