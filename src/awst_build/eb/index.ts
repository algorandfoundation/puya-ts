import { SourceLocation } from '../../awst/source-location'
import { awst, wtypes } from '../../awst'
import { CodeError, NotSupported } from '../../errors'
import { PType } from '../ptypes'
import { logger } from '../../logger'
import { Expression, LValue } from '../../awst/nodes'
import { codeInvariant } from '../../util'
import { typeRegistry } from '../type-registry'
import { nodeFactory } from '../../awst/node-factory'
import { TransientType } from '../ptypes/ptype-classes'

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

export abstract class InstanceBuilder extends NodeBuilder {
  constructor(sourceLocation: SourceLocation) {
    super(sourceLocation)
  }
  abstract get ptype(): PType
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

export abstract class LiteralExpressionBuilder extends InstanceBuilder {
  resolve(): Expression {
    throw new CodeError('A literal value is not valid here', { sourceLocation: this.sourceLocation })
  }
  resolveLValue(): LValue {
    throw new CodeError('A literal value is not valid here', { sourceLocation: this.sourceLocation })
  }

  abstract resolvableToPType(ptype: PType, sourceLocation: SourceLocation): boolean
  abstract resolveToPType(ptype: PType, sourceLocation: SourceLocation): InstanceBuilder

  private throwInvalidExpression(): never {
    if (this.ptype instanceof TransientType) throw new CodeError(this.ptype.expressionMessage, { sourceLocation: this.sourceLocation })
    throw new CodeError('Hmmm')
  }

  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    this.throwInvalidExpression()
  }

  assign(other: InstanceBuilder, sourceLocation: SourceLocation): InstanceBuilder {
    this.throwInvalidExpression()
  }

  binaryOp(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    this.throwInvalidExpression()
  }
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    this.throwInvalidExpression()
  }
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    this.throwInvalidExpression()
  }

  taggedTemplate(head: string, spans: ReadonlyArray<readonly [InstanceBuilder, string]>, sourceLocation: SourceLocation): InstanceBuilder {
    this.throwInvalidExpression()
  }

  indexAccess(index: InstanceBuilder, sourceLocation: SourceLocation): NodeBuilder {
    this.throwInvalidExpression()
  }
  singleEvaluation(): InstanceBuilder {
    this.throwInvalidExpression()
  }

  toBytes(sourceLocation: SourceLocation): awst.Expression {
    this.throwInvalidExpression()
  }

  prefixUnaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    this.throwInvalidExpression()
  }

  postfixUnaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    this.throwInvalidExpression()
  }

  iterate(sourceLocation: SourceLocation): awst.Expression {
    this.throwInvalidExpression()
  }

  augmentedAssignment(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    this.throwInvalidExpression()
  }

  hasProperty(_name: string): boolean {
    this.throwInvalidExpression()
  }
}

export class DeferredTypeExpressionBuilder extends LiteralExpressionBuilder {
  #ptype: PType
  #base: InstanceBuilder
  #op: (b: InstanceBuilder) => InstanceBuilder
  get ptype(): PType {
    return this.#ptype
  }
  resolve(): awst.Expression {
    throw new Error('Method not implemented.')
  }
  resolveLValue(): awst.LValue {
    throw new Error('Method not implemented.')
  }

  boolEval(sourceLocation: SourceLocation, negate: boolean = false): Expression {
    return this.#base.boolEval(sourceLocation, negate)
  }

  constructor({
    ptype,
    base,
    sourceLocation,
    op,
  }: {
    ptype: PType
    sourceLocation: SourceLocation
    base: InstanceBuilder
    op: (builder: InstanceBuilder) => InstanceBuilder
  }) {
    super(sourceLocation)
    this.#op = op
    this.#ptype = ptype
    this.#base = base
  }

  resolvableToPType(ptype: PType, sourceLocation: SourceLocation): boolean {
    return this.#base.resolvableToPType(ptype, sourceLocation)
  }
  resolveToPType(ptype: PType, sourceLocation: SourceLocation): InstanceBuilder {
    return this.#op(this.#base.resolveToPType(ptype, sourceLocation))
  }

  binaryOp(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    return new DeferredTypeExpressionBuilder({
      ptype: this.ptype,
      sourceLocation,
      base: this.#base,
      op: (b) => this.#op(b).binaryOp(other, op, sourceLocation),
    })
  }

  singleEvaluation(): InstanceBuilder {
    return new DeferredTypeExpressionBuilder({
      ptype: this.ptype,
      sourceLocation: this.sourceLocation,
      base: this.#base,
      op: (b) => this.#op(b).singleEvaluation(),
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
