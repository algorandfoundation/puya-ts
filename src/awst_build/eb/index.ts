import { SourceLocation } from '../../awst/source-location'
import { awst, wtypes } from '../../awst'
import { CodeError, NotSupported } from '../../errors'
import { PType } from '../ptypes'

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

export abstract class NodeBuilder {
  constructor(public readonly sourceLocation: SourceLocation) {}

  abstract get ptype(): PType | undefined

  public get typeDescription(): string {
    if (this.ptype) {
      return this.ptype.name
    }
    return this.constructor.name
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    throw new NotSupported(`Calling ${this.typeDescription}`, {
      sourceLocation,
    })
  }

  taggedTemplate(head: string, spans: ReadonlyArray<readonly [InstanceBuilder, string]>, sourceLocation: SourceLocation): InstanceBuilder {
    throw new NotSupported(`Tagged templates on ${this.typeDescription}`, {
      sourceLocation,
    })
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    throw new NotSupported(`Accessing member ${name} on ${this.typeDescription}`, {
      sourceLocation,
    })
  }

  boolEval(sourceLocation: SourceLocation, negate: boolean): awst.Expression {
    throw new NotSupported(`${negate ? 'Negated ' : ''} boolean evaluation of ${this.typeDescription}`, {
      sourceLocation,
    })
  }
}

export abstract class InstanceBuilder extends NodeBuilder {
  constructor(sourceLocation: SourceLocation) {
    super(sourceLocation)
  }

  abstract resolve(): awst.Expression
  abstract resolveLValue(): awst.LValue

  get valueType(): wtypes.WType | undefined {
    return undefined
  }

  toBytes(sourceLocation: SourceLocation): awst.Expression {
    throw new NotSupported(`Serializing ${this.typeDescription} to bytes`, {
      sourceLocation,
    })
  }

  delete(sourceLocation: SourceLocation): awst.Statement {
    throw new NotSupported(`Deleting ${this.typeDescription}`, {
      sourceLocation,
    })
  }

  unaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    throw new NotSupported(`Unary ${op} op on ${this.typeDescription}`, {
      sourceLocation,
    })
  }

  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    throw new NotSupported(`${op} on ${this.typeDescription}`, {
      sourceLocation,
    })
  }
  binaryOp(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    throw new NotSupported(`${op} on ${this.typeDescription}`, {
      sourceLocation,
    })
  }

  iterate(sourceLocation: SourceLocation): awst.Expression {
    throw new NotSupported(`Iteration on ${this.typeDescription}`, {
      sourceLocation,
    })
  }
  assign(other: InstanceBuilder, sourceLocation: SourceLocation): InstanceBuilder {
    throw new NotSupported(`Assignment to ${this.typeDescription}`, {
      sourceLocation,
    })
  }
  augmentedAssignment(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    throw new NotSupported(`Augmented assignment to ${this.typeDescription} with ${op}`, {
      sourceLocation,
    })
  }
}

export abstract class TypeClassBuilder extends NodeBuilder {
  constructor(location: SourceLocation) {
    super(location)
  }
  abstract produces(): PType
}
export abstract class FunctionBuilder extends NodeBuilder {
  get ptype(): PType | undefined {
    return undefined
  }

  constructor(location: SourceLocation) {
    super(location)
  }
}

export abstract class InstanceExpressionBuilder extends InstanceBuilder {
  constructor(protected _expr: awst.Expression) {
    super(_expr.sourceLocation)
  }

  resolve() {
    return this._expr
  }

  resolveLValue() {
    return requireLValue(this.resolve())
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
