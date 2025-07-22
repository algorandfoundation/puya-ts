import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { wtypes } from '../../../awst/wtypes'

import type { PType, PTypeOrClass } from '../../ptypes'
import { typeRegistry } from '../../type-registry'
import type { InstanceBuilder } from '../index'
import { LiteralExpressionBuilder } from '../literal-expression-builder'
import { requireBuilderOfType, resolvableToType } from '../util'

export class ConditionalExpressionBuilder extends LiteralExpressionBuilder {
  readonly isConstant = false

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
      wtype: wtypes.boolWType,
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

  resolvableToPType(ptype: PTypeOrClass): boolean {
    return resolvableToType(this.whenTrue, ptype) && resolvableToType(this.whenFalse, ptype)
  }

  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    const falseBuilder = requireBuilderOfType(this.whenFalse, ptype)
    const trueBuilder = requireBuilderOfType(this.whenTrue, ptype)

    return typeRegistry.getInstanceEb(
      nodeFactory.conditionalExpression({
        sourceLocation: this.sourceLocation,
        falseExpr: falseBuilder.resolve(),
        trueExpr: trueBuilder.resolve(),
        condition: this.condition,
        wtype: falseBuilder.ptype.wtypeOrThrow,
      }),
      falseBuilder.ptype,
    )
  }

  checkForUnclonedMutables(scenario: string): boolean {
    return this.whenTrue.checkForUnclonedMutables(scenario) || this.whenFalse.checkForUnclonedMutables(scenario)
  }
}
