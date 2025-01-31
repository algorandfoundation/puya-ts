import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { CodeError } from '../../../errors'
import { codeInvariant } from '../../../util'
import type { PTypeOrClass } from '../../ptypes'
import {
  BigIntLiteralPType,
  bigIntPType,
  biguintPType,
  boolPType,
  numberPType,
  NumericLiteralPType,
  TransientType,
  uint64PType,
} from '../../ptypes'
import { instanceEb, typeRegistry } from '../../type-registry'
import { foldBinaryOp, foldComparisonOp } from '../folding'
import type { BuilderBinaryOp, BuilderComparisonOp, InstanceBuilder } from '../index'
import { BuilderUnaryOp } from '../index'
import { LiteralExpressionBuilder } from '../literal-expression-builder'
import { isValidLiteralForPType } from '../util'

export class BigIntLiteralExpressionBuilder extends LiteralExpressionBuilder {
  singleEvaluation(): InstanceBuilder {
    return this
  }

  constructor(
    public readonly value: bigint,
    public readonly ptype: TransientType,
    location: SourceLocation,
  ) {
    super(location)
  }

  resolvableToPType(ptype: PTypeOrClass): boolean {
    const isUnsigned = ptype.equals(biguintPType) || ptype.equals(uint64PType)
    if (this.ptype instanceof NumericLiteralPType || this.ptype.equals(numberPType)) {
      if (isUnsigned) {
        return this.value >= 0n
      }
      return ptype.equals(numberPType) || ptype.equals(this.ptype)
    } else if (this.ptype instanceof BigIntLiteralPType || this.ptype.equals(bigIntPType)) {
      if (isUnsigned) {
        return this.value >= 0n
      }
      return ptype.equals(bigIntPType) || ptype.equals(this.ptype)
    }
    return false
  }
  boolEval(sourceLocation: SourceLocation, negate: boolean = false): Expression {
    const value = negate ? !this.value : Boolean(this.value)

    return nodeFactory.boolConstant({
      value,
      sourceLocation,
    })
  }

  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    codeInvariant(this.resolvableToPType(ptype), `${this.value} cannot be converted to type ${ptype.name}`, this.sourceLocation)

    if (ptype.equals(this.ptype)) return this
    if (ptype instanceof TransientType && (ptype.equals(numberPType) || ptype.equals(bigIntPType))) {
      return new BigIntLiteralExpressionBuilder(this.value, ptype, this.sourceLocation)
    }

    codeInvariant(isValidLiteralForPType(this.value, ptype), `${ptype.name} overflow or underflow: ${this.value}`, this.sourceLocation)
    if (ptype.equals(uint64PType)) {
      return instanceEb(nodeFactory.uInt64Constant({ value: this.value, sourceLocation: this.sourceLocation }), uint64PType)
    } else if (ptype.equals(biguintPType)) {
      return instanceEb(nodeFactory.bigUIntConstant({ value: this.value, sourceLocation: this.sourceLocation }), biguintPType)
    }
    throw new CodeError(`${this.value} cannot be converted to type ${ptype.name}`, { sourceLocation: this.sourceLocation })
  }

  binaryOp(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    if (other.ptype.wtype) {
      return this.resolveToPType(other.ptype).binaryOp(other, op, sourceLocation)
    }
    if (other instanceof BigIntLiteralExpressionBuilder) {
      const folded = foldBinaryOp(this.value, other.value, op, sourceLocation)
      return new BigIntLiteralExpressionBuilder(folded, this.getUpdatedPType(folded), sourceLocation)
    }
    return super.binaryOp(other, op, sourceLocation)
  }
  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    if (other.ptype.wtype) {
      return this.resolveToPType(other.ptype).compare(other, op, sourceLocation)
    }
    if (other instanceof BigIntLiteralExpressionBuilder) {
      return typeRegistry.getInstanceEb(foldComparisonOp(this.value, other.value, op, sourceLocation), boolPType)
    }
    return super.compare(other, op, sourceLocation)
  }
  prefixUnaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    switch (op) {
      case BuilderUnaryOp.neg:
        return new BigIntLiteralExpressionBuilder(-this.value, this.getUpdatedPType(-this.value), sourceLocation)
      case BuilderUnaryOp.pos:
        return new BigIntLiteralExpressionBuilder(this.value, this.ptype, sourceLocation)
    }
    return super.prefixUnaryOp(op, sourceLocation)
  }

  private getUpdatedPType(value: bigint) {
    if (this.ptype instanceof BigIntLiteralPType) {
      return new BigIntLiteralPType({ literalValue: value })
    }
    if (this.ptype instanceof NumericLiteralPType) {
      return new NumericLiteralPType({ literalValue: value })
    }
    return this.ptype
  }
}
