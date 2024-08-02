import type { InstanceBuilder } from '../index'
import type { SourceLocation } from '../../../awst/source-location'
import type { Expression } from '../../../awst/nodes'
import type { PType } from '../../ptypes'
import { nodeFactory } from '../../../awst/node-factory'
import { requireExpressionOfType, resolvableToType } from '../util'
import { typeRegistry } from '../../type-registry'
import { boolWType } from '../../../awst/wtypes'
import { LiteralExpressionBuilder } from '../literal-expression-builder'

export class ConditionalExpressionBuilder extends LiteralExpressionBuilder {
  private readonly _ptype: PType
  private readonly whenTrue: InstanceBuilder
  private readonly whenFalse: InstanceBuilder
  private readonly condition: Expression

  get ptype(): PType {
    return this._ptype
  }

  boolEval(sourceLocation: SourceLocation, negate: boolean = false): Expression {
    return nodeFactory.conditionalExpression({
      sourceLocation: this.sourceLocation,
      falseExpr: this.whenFalse.boolEval(sourceLocation, negate),
      trueExpr: this.whenTrue.boolEval(sourceLocation, negate),
      condition: this.condition,
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
    condition: Expression
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
        condition: this.condition,
        wtype: ptype.wtypeOrThrow,
      }),
      ptype,
    )
  }
}
