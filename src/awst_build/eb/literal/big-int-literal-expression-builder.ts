import { nodeFactory } from '../../../awst/node-factory'
import type { Expression, LValue } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { CodeError } from '../../../errors'
import { codeInvariant } from '../../../util'
import type { PType, PTypeOrClass } from '../../ptypes'
import { biguintPType, boolPType, uint64PType } from '../../ptypes'
import { typeRegistry } from '../../type-registry'
import { BigUintExpressionBuilder } from '../biguint-expression-builder'
import { foldBinaryOp, foldComparisonOp } from '../folding'
import type { BuilderBinaryOp, BuilderComparisonOp, InstanceBuilder } from '../index'
import { LiteralExpressionBuilder } from '../literal-expression-builder'
import { UInt64ExpressionBuilder } from '../uint64-expression-builder'
import { isValidLiteralForPType } from '../util'

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

  resolvableToPType(ptype: PTypeOrClass): boolean {
    return ptype.equals(uint64PType) || ptype.equals(biguintPType) || ptype.equals(this.ptype)
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
    codeInvariant(isValidLiteralForPType(this.value, ptype), `${ptype.name} cannot be converted to type ${ptype.name}`, this.sourceLocation)
    if (ptype.equals(uint64PType)) {
      return new UInt64ExpressionBuilder(nodeFactory.uInt64Constant({ value: this.value, sourceLocation: this.sourceLocation }))
    } else if (ptype.equals(biguintPType)) {
      return new BigUintExpressionBuilder(nodeFactory.bigUIntConstant({ value: this.value, sourceLocation: this.sourceLocation }))
    }
    throw new CodeError(`${ptype.name} cannot be converted to type ${ptype.name}`, { sourceLocation: this.sourceLocation })
  }

  binaryOp(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    if (other.ptype.wtype) {
      return this.resolveToPType(other.ptype).binaryOp(other, op, sourceLocation)
    }
    if (other instanceof BigIntLiteralExpressionBuilder) {
      return new BigIntLiteralExpressionBuilder(foldBinaryOp(this.value, other.value, op, sourceLocation), this.ptype, sourceLocation)
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
}
