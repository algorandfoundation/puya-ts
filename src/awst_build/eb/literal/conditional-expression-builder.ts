import { BuilderBinaryOp, DeferredTypeExpressionBuilder, InstanceBuilder, LiteralExpressionBuilder } from '../index'
import { SourceLocation } from '../../../awst/source-location'
import { Expression, LValue } from '../../../awst/nodes'
import { PType } from '../../ptypes'
import { nodeFactory } from '../../../awst/node-factory'
import { requireExpressionOfType, resolvableToType } from '../util'
import { typeRegistry } from '../../type-registry'
import { boolWType } from '../../../awst/wtypes'

export class ConditionalExpressionBuilder extends LiteralExpressionBuilder {
  private readonly _ptype: PType
  private readonly whenTrue: InstanceBuilder
  private readonly whenFalse: InstanceBuilder
  private readonly condition: InstanceBuilder
  resolve(): Expression {
    return this.resolveToPType(this.ptype).resolve()
  }
  resolveLValue(): LValue {
    throw new Error('Method not implemented.')
  }
  get ptype(): PType {
    return this._ptype
  }

  boolEval(sourceLocation: SourceLocation, negate: boolean = false): Expression {
    return nodeFactory.conditionalExpression({
      sourceLocation: this.sourceLocation,
      falseExpr: this.whenFalse.boolEval(sourceLocation, negate),
      trueExpr: this.whenTrue.boolEval(sourceLocation, negate),
      condition: this.condition.boolEval(sourceLocation),
      wtype: boolWType,
    })
  }

  constructor({
    condition,
    ptype,
    whenFalse,
    whenTrue,
    sourceLocation,
  }: {
    ptype: PType
    condition: InstanceBuilder
    whenTrue: InstanceBuilder
    whenFalse: InstanceBuilder

    sourceLocation: SourceLocation
  }) {
    super(sourceLocation)
    this._ptype = ptype
    this.whenTrue = whenTrue
    this.whenFalse = whenFalse
    this.condition = condition
  }

  resolvableToPType(ptype: PType, sourceLocation: SourceLocation): boolean {
    return resolvableToType(this.whenTrue, ptype, sourceLocation) && resolvableToType(this.whenFalse, ptype, sourceLocation)
  }
  resolveToPType(ptype: PType): InstanceBuilder {
    return typeRegistry.getInstanceEb(
      nodeFactory.conditionalExpression({
        sourceLocation: this.sourceLocation,
        falseExpr: requireExpressionOfType(this.whenFalse, ptype, this.sourceLocation),
        trueExpr: requireExpressionOfType(this.whenTrue, ptype, this.sourceLocation),
        condition: this.condition.boolEval(this.sourceLocation),
        wtype: ptype.wtypeOrThrow,
      }),
      ptype,
    )
  }

  binaryOp(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    return new DeferredTypeExpressionBuilder({
      ptype: this.ptype,
      sourceLocation,
      base: this,
      op: (b) => b.binaryOp(other, op, sourceLocation),
    })
  }
  singleEvaluation(): InstanceBuilder {
    return new DeferredTypeExpressionBuilder({
      ptype: this.ptype,
      sourceLocation: this.sourceLocation,
      base: this,
      op: (b) => b.singleEvaluation(),
    })
  }
}
