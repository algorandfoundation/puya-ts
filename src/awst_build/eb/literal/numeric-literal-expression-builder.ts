import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { CodeError } from '../../../errors'
import { codeInvariant } from '../../../util'
import type { NumberPType, PTypeOrClass } from '../../ptypes'
import { boolPType, numberPType, NumericLiteralPType, uint64PType } from '../../ptypes'
import { instanceEb, typeRegistry } from '../../type-registry'
import { foldBinaryOp, foldComparisonOp } from '../folding'
import type { BuilderBinaryOp, BuilderComparisonOp, InstanceBuilder } from '../index'
import { BuilderUnaryOp } from '../index'
import { LiteralExpressionBuilder } from '../literal-expression-builder'
import { isValidLiteralForPType } from '../util/is-valid-literal-for-ptype'

export class NumericLiteralExpressionBuilder extends LiteralExpressionBuilder {
  readonly isConstant = true

  singleEvaluation(): InstanceBuilder {
    return this
  }

  constructor(
    public readonly value: bigint,
    public readonly ptype: NumericLiteralPType | NumberPType,
    location: SourceLocation,
  ) {
    super(location)
  }

  resolvableToPType(ptype: PTypeOrClass): boolean {
    if (ptype.equals(uint64PType)) {
      return this.value >= 0n && this.value < 2n ** 64n
    }
    return ptype.equals(numberPType) || ptype.equals(this.ptype)
  }
  boolEval(sourceLocation: SourceLocation, negate: boolean = false): Expression {
    const value = negate ? !this.value : Boolean(this.value)

    return nodeFactory.boolConstant({
      value,
      sourceLocation,
    })
  }

  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (ptype.equals(this.ptype)) return this
    if (ptype.equals(numberPType)) return new NumericLiteralExpressionBuilder(this.value, numberPType, this.sourceLocation)

    codeInvariant(isValidLiteralForPType(this.value, ptype), `${ptype.name} overflow or underflow: ${this.value}`, this.sourceLocation)
    if (ptype.equals(uint64PType)) {
      return instanceEb(nodeFactory.uInt64Constant({ value: this.value, sourceLocation: this.sourceLocation }), uint64PType)
    }
    throw new CodeError(`${this.value} cannot be converted to type ${ptype.name}`, { sourceLocation: this.sourceLocation })
  }

  binaryOp(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    if (other.ptype.wtype) {
      return this.resolveToPType(other.ptype).binaryOp(other, op, sourceLocation)
    }
    if (other instanceof NumericLiteralExpressionBuilder) {
      const folded = foldBinaryOp(this.value, other.value, op, sourceLocation)
      return new NumericLiteralExpressionBuilder(folded, this.getUpdatedPType(folded), sourceLocation)
    }
    return super.binaryOp(other, op, sourceLocation)
  }
  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    if (other.ptype.wtype) {
      return this.resolveToPType(other.ptype).compare(other, op, sourceLocation)
    }
    if (other instanceof NumericLiteralExpressionBuilder) {
      return typeRegistry.getInstanceEb(foldComparisonOp(this.value, other.value, op, sourceLocation), boolPType)
    }
    return super.compare(other, op, sourceLocation)
  }
  prefixUnaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    switch (op) {
      case BuilderUnaryOp.neg:
        return new NumericLiteralExpressionBuilder(-this.value, this.getUpdatedPType(-this.value), sourceLocation)
      case BuilderUnaryOp.pos:
        return new NumericLiteralExpressionBuilder(this.value, this.ptype, sourceLocation)
    }
    return super.prefixUnaryOp(op, sourceLocation)
  }

  private getUpdatedPType(value: bigint) {
    return new NumericLiteralPType({ literalValue: value })
  }
}
