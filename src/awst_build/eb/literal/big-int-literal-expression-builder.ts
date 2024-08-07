import type { BuilderBinaryOp, BuilderComparisonOp, InstanceBuilder } from '../index'
import type { SourceLocation } from '../../../awst/source-location'
import type { Expression, LValue } from '../../../awst/nodes'
import type { PType } from '../../ptypes'
import { boolPType } from '../../ptypes'
import { biguintPType, uint64PType } from '../../ptypes'
import { nodeFactory } from '../../../awst/node-factory'
import { UInt64ExpressionBuilder } from '../uint64-expression-builder'
import { CodeError } from '../../../errors'
import { codeInvariant } from '../../../util'
import { isValidLiteralForPType } from '../util'
import { BigUintExpressionBuilder } from '../biguint-expression-builder'
import { foldBinaryOp, foldComparisonOp } from '../folding'
import { LiteralExpressionBuilder } from '../literal-expression-builder'
import { typeRegistry } from '../../type-registry'

export class BigIntLiteralExpressionBuilder extends LiteralExpressionBuilder {
  resolve(): Expression {
    throw new CodeError('A literal is not valid at this point.', { sourceLocation: this.sourceLocation })
  }
  resolveLValue(): LValue {
    throw new CodeError('A literal is not valid at this point.', { sourceLocation: this.sourceLocation })
  }
  get ptype(): PType {
    return this._ptype
  }
  singleEvaluation(): InstanceBuilder {
    return this
  }

  private readonly _ptype: PType
  constructor(
    public readonly value: bigint,
    ptype: PType,
    location: SourceLocation,
  ) {
    super(location)
    this._ptype = ptype
  }
  resolvableToPType(ptype: PType): boolean {
    return ptype.equals(uint64PType) || ptype.equals(biguintPType)
  }
  boolEval(sourceLocation: SourceLocation, negate: boolean = false): Expression {
    const value = negate ? !this.value : Boolean(this.value)

    return nodeFactory.boolConstant({
      value,
      sourceLocation,
    })
  }

  resolveToPType(ptype: PType, sourceLocation: SourceLocation): InstanceBuilder {
    codeInvariant(isValidLiteralForPType(this.value, ptype), `${ptype.name} cannot be converted to type ${ptype.name}`, sourceLocation)
    if (ptype.equals(uint64PType)) {
      return new UInt64ExpressionBuilder(nodeFactory.uInt64Constant({ value: this.value, sourceLocation: this.sourceLocation }))
    } else if (ptype.equals(biguintPType)) {
      return new BigUintExpressionBuilder(nodeFactory.bigUIntConstant({ value: this.value, sourceLocation: this.sourceLocation }))
    }
    throw new CodeError(`${ptype.name} cannot be converted to type ${ptype.name}`, { sourceLocation })
  }

  binaryOp(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    if (other.ptype.wtype) {
      return this.resolveToPType(other.ptype, sourceLocation).binaryOp(other, op, sourceLocation)
    }
    if (other instanceof BigIntLiteralExpressionBuilder) {
      return new BigIntLiteralExpressionBuilder(foldBinaryOp(this.value, other.value, op, sourceLocation), this.ptype, sourceLocation)
    }
    return super.binaryOp(other, op, sourceLocation)
  }
  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    if (other.ptype.wtype) {
      return this.resolveToPType(other.ptype, sourceLocation).compare(other, op, sourceLocation)
    }
    if (other instanceof BigIntLiteralExpressionBuilder) {
      return typeRegistry.getInstanceEb(foldComparisonOp(this.value, other.value, op, sourceLocation), boolPType)
    }
    return super.compare(other, op, sourceLocation)
  }
}
