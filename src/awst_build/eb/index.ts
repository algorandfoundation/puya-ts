import { SourceLocation } from '../../awst/source-location'
import { awst, wtypes } from '../../awst'
import { CodeError, NotSupported } from '../../errors'
import { WType } from '../../awst/wtypes'

export enum BuilderComparisonOp {
  eq = '==',
  ne = '!=',
  lt = '<',
  lte = '<=',
  gt = '>',
  gte = '>=',
}
export enum BuilderUnaryOp {
  inc = '++',
  dec = '--',
  bit_inv = '~',
  log_not = '!',
  neg = '-',
  pos = '+',
}

export enum BuilderBinaryOp {
  add = '+',
  sub = '-',
  mult = '*',
  div = '/',
  floorDiv = '//',
  mod = '%',
  pow = '**',
  matMult = '@',
  lshift = '<<',
  rshift = '>>',
  bitOr = '|',
  bitXor = '^',
  bitAnd = '&',
  /**
   * Eval left, return right
   * let y = 2
   * // x == 4
   * const x = (y * 3, y - 2)
   */
  comma = ',',
}

export abstract class ExpressionBuilder {
  constructor(public readonly sourceLocation: SourceLocation) {}

  abstract rvalue(): awst.Expression
  abstract lvalue(): awst.LValue

  buildAssignmentSource(): awst.Expression {
    return this.rvalue()
  }

  get valueType(): wtypes.WType | undefined {
    return undefined
  }

  protected get typeDescription(): string {
    if (this.valueType) {
      return this.valueType.name
    }
    return this.constructor.name
  }

  delete(sourceLocation: SourceLocation): awst.Statement {
    throw new NotSupported(`Deleting ${this.typeDescription}`, {
      sourceLocation,
    })
  }

  boolEval(sourceLocation: SourceLocation, negate: boolean): awst.Expression {
    throw new NotSupported(`${negate ? 'Negated ' : ''} boolean evaluation of ${this.typeDescription}`, {
      sourceLocation,
    })
  }
  unaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): ExpressionBuilder {
    throw new NotSupported(`Unary ${op} op on ${this.typeDescription}`, {
      sourceLocation,
    })
  }

  compare(other: ExpressionBuilder | awst.Literal, op: BuilderComparisonOp, sourceLocation: SourceLocation): ExpressionBuilder {
    throw new NotSupported(`${op} on ${this.typeDescription}`, {
      sourceLocation,
    })
  }
  binaryOp(other: ExpressionBuilder | awst.Literal, op: BuilderBinaryOp, sourceLocation: SourceLocation): ExpressionBuilder {
    throw new NotSupported(`${op} on ${this.typeDescription}`, {
      sourceLocation,
    })
  }
  call(args: ReadonlyArray<ExpressionBuilder | awst.Literal>, sourceLocation: SourceLocation): ExpressionBuilder {
    throw new NotSupported(`Calling ${this.typeDescription}`, {
      sourceLocation,
    })
  }
  taggedTemplate(
    head: string,
    spans: ReadonlyArray<readonly [ExpressionBuilder | awst.Literal, string]>,
    sourceLocation: SourceLocation,
  ): ExpressionBuilder {
    throw new NotSupported(`Tagged templates on ${this.typeDescription}`, {
      sourceLocation,
    })
  }

  memberAccess(name: string, sourceLocation: SourceLocation): ExpressionBuilder | awst.Literal {
    throw new NotSupported(`Accessing member ${name} on ${this.typeDescription}`, {
      sourceLocation,
    })
  }
  iterate(sourceLocation: SourceLocation): awst.Expression {
    throw new NotSupported(`Iteration on ${this.typeDescription}`, {
      sourceLocation,
    })
  }
}

export abstract class IntermediateExpressionBuilder extends ExpressionBuilder {
  rvalue(): awst.Expression {
    throw new CodeError(`${this.typeDescription} is not valid as an rvalue`, {
      sourceLocation: this.sourceLocation,
    })
  }
  lvalue(): awst.LValue {
    throw new CodeError(`${this.typeDescription} is not valid as an lvalue`, {
      sourceLocation: this.sourceLocation,
    })
  }

  private throwNotAValue(sourceLocation: SourceLocation): never {
    throw new CodeError(`${this.typeDescription} is not a value`, {
      sourceLocation,
    })
  }

  unaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): ExpressionBuilder {
    this.throwNotAValue(sourceLocation)
  }
  delete(sourceLocation: SourceLocation): awst.Statement {
    this.throwNotAValue(sourceLocation)
  }

  boolEval(sourceLocation: SourceLocation, _negate: boolean): awst.Expression {
    this.throwNotAValue(sourceLocation)
  }

  compare(other: ExpressionBuilder | awst.Literal, op: BuilderComparisonOp, sourceLocation: SourceLocation): ExpressionBuilder {
    this.throwNotAValue(sourceLocation)
  }
  binaryOp(other: ExpressionBuilder | awst.Literal, op: BuilderBinaryOp, sourceLocation: SourceLocation): ExpressionBuilder {
    this.throwNotAValue(sourceLocation)
  }
}

export abstract class TypeClassExpressionBuilder extends IntermediateExpressionBuilder {
  abstract produces(): wtypes.WType
}

export abstract class ValueExpressionBuilder extends ExpressionBuilder {
  constructor(protected _expr: awst.Expression) {
    super(_expr.sourceLocation)
  }

  abstract get wtype(): wtypes.WType

  get valueType(): WType | undefined {
    return this.wtype
  }

  rvalue() {
    return this._expr
  }

  lvalue() {
    return requireLValue(this.rvalue())
  }
}

export function requireLValue(expr: awst.Expression): awst.LValue {
  const lValueNodes = [
    awst.VarExpression,
    awst.FieldExpression,
    awst.IndexExpression,
    awst.TupleExpression,
    awst.AppStateExpression,
    awst.AppAccountStateExpression,
  ]
  if (!lValueNodes.some((l) => expr instanceof l)) {
    throw new CodeError(`${expr.wtype} is not a valid assignment target`, {
      sourceLocation: expr.sourceLocation,
    })
  }
  if (expr instanceof awst.IndexExpression || expr instanceof awst.FieldExpression) {
    if (expr.base.wtype.immutable) {
      throw new CodeError(`${expr.wtype} is not a valid assignment target as it is immutabe`, {
        sourceLocation: expr.sourceLocation,
      })
    }
  }
  if (expr instanceof awst.ReinterpretCast) {
    requireLValue(expr.expr)
  }
  if (expr instanceof awst.TupleExpression) {
    for (const item of expr.items) {
      requireLValue(item)
    }
  }
  return expr as awst.LValue
}
