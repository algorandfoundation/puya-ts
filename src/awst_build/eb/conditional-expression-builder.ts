import { InstanceBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { Expression, LValue } from '../../awst/nodes'
import { PType } from '../ptypes'
import { nodeFactory } from '../../awst/node-factory'
import { requireExpressionOfType } from './util'
import { typeRegistry } from '../type-registry'

export class ConditionalExpressionBuilder extends InstanceBuilder {
  private readonly _ptype: PType
  private readonly whenTrue: InstanceBuilder
  private readonly whenFalse: InstanceBuilder
  private readonly condition: Expression
  resolve(): Expression {
    throw new Error('Method not implemented.')
  }
  resolveLValue(): LValue {
    throw new Error('Method not implemented.')
  }
  get ptype(): PType {
    return this._ptype
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
  constructor(
    sourceLocation: SourceLocation,
    {
      condition,
      ptype,
      whenFalse,
      whenTrue,
    }: {
      ptype: PType
      condition: Expression
      whenTrue: InstanceBuilder
      whenFalse: InstanceBuilder
    },
  ) {
    super(sourceLocation)
    this._ptype = ptype
    this.whenTrue = whenTrue
    this.whenFalse = whenFalse
    this.condition = condition
  }
}
