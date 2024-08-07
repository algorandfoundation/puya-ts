import type { SourceLocation } from '../../awst/source-location'
import { awst } from '../../awst'
import { CodeError, NotSupported } from '../../errors'
import type { PType } from '../ptypes'
import { logger } from '../../logger'
import type { Expression } from '../../awst/nodes'
import { codeInvariant } from '../../util'
import { typeRegistry } from '../type-registry'
import { nodeFactory } from '../../awst/node-factory'

export enum BuilderComparisonOp {
  eq = '===',
  ne = '!==',
  lt = '<',
  lte = '<=',
  gt = '>',
  gte = '>=',
}
export enum BuilderUnaryOp {
  inc = '++',
  dec = '--',
  bit_inv = '~',
  neg = '-',
  pos = '+',
}

export enum BuilderBinaryOp {
  add = '+',
  sub = '-',
  mult = '*',
  div = '/',
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

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
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

  indexAccess(index: InstanceBuilder, sourceLocation: SourceLocation): NodeBuilder {
    throw new NotSupported(`Indexing ${this.typeDescription}`, {
      sourceLocation,
    })
  }

  boolEval(sourceLocation: SourceLocation, negate = false): awst.Expression {
    throw new NotSupported(`Boolean evaluation of ${this.typeDescription}`, {
      sourceLocation,
    })
  }
}

export abstract class InstanceBuilder<TPType extends PType = PType> extends NodeBuilder {
  constructor(sourceLocation: SourceLocation) {
    super(sourceLocation)
  }
  abstract get ptype(): TPType
  abstract resolve(): awst.Expression
  abstract resolveLValue(): awst.LValue

  resolvableToPType(ptype: PType, sourceLocation: SourceLocation): boolean {
    return this.ptype.equals(ptype)
  }
  resolveToPType(ptype: PType, sourceLocation: SourceLocation): InstanceBuilder {
    codeInvariant(this.ptype.equals(ptype), `Required expression of type ${ptype} but found ${this.ptype}`)
    return this
  }

  singleEvaluation(): InstanceBuilder {
    const expr = this.resolve()
    if (expr instanceof awst.VarExpression) {
      return typeRegistry.getInstanceEb(expr, this.ptype)
    }
    return typeRegistry.getInstanceEb(
      nodeFactory.singleEvaluation({
        source: this.resolve(),
      }),
      this.ptype,
    )
  }

  toBytes(sourceLocation: SourceLocation): awst.Expression {
    throw new NotSupported(`Serializing ${this.typeDescription} to bytes`, {
      sourceLocation,
    })
  }

  prefixUnaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    throw new NotSupported(`Prefix Unary ${op} op on ${this.typeDescription}`, {
      sourceLocation,
    })
  }

  postfixUnaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    throw new NotSupported(`Postfix Unary ${op} op on ${this.typeDescription}`, {
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

  hasProperty(_name: string): boolean {
    throw new NotSupported(`Has property checks on ${this.typeDescription}`)
  }
}

export abstract class FunctionBuilder extends NodeBuilder {
  get ptype(): PType | undefined {
    return undefined
  }

  constructor(location: SourceLocation) {
    super(location)
  }

  abstract call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder
}

export abstract class ParameterlessFunctionBuilder extends FunctionBuilder {
  constructor(
    private readonly expression: Expression,
    private readonly definition: (expr: Expression, sourceLocation: SourceLocation) => NodeBuilder,
  ) {
    super(expression.sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    if (args.length) logger.error(sourceLocation, 'Function expects no arguments')
    if (typeArgs.length) logger.error(sourceLocation, 'Function expects type arguments')
    return this.definition(this.expression, sourceLocation)
  }
}

export abstract class InstanceExpressionBuilder<TPType extends PType> extends InstanceBuilder<PType> {
  #ptype: TPType

  get ptype(): TPType {
    return this.#ptype
  }

  constructor(
    protected _expr: awst.Expression,
    ptype: TPType,
  ) {
    super(_expr.sourceLocation)
    this.#ptype = ptype
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
    awst.BoxValueExpression,
  ]
  if (!lValueNodes.some((l) => expr instanceof l)) {
    throw new CodeError(`Expression is not a valid assignment target`, {
      sourceLocation: expr.sourceLocation,
    })
  }
  if (expr instanceof awst.IndexExpression || expr instanceof awst.FieldExpression) {
    if (expr.base.wtype.immutable) {
      throw new CodeError(`${expr.wtype} is not a valid assignment target as it is immutable`, {
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
