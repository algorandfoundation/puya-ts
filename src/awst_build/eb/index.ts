import { awst, isConstant, isConstantOrTemplateVar } from '../../awst'
import { nodeFactory } from '../../awst/node-factory'
import { TupleItemExpression } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError, InternalError, NotSupported } from '../../errors'
import { logger } from '../../logger'
import { instanceOfAny } from '../../util'
import type { DecoratorData } from '../models/decorator-data'
import type { GenericPType, LibClassType, PType, PTypeOrClass } from '../ptypes'
import { uint64PType } from '../ptypes'
import type { ARC4StructClass } from '../ptypes/arc4-types'
import { isOrContainsMutableType } from '../ptypes/visitors/contains-mutable-visitor'
import { instanceEb } from '../type-registry'

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

  abstract readonly ptype: PType | undefined

  public get typeDescription(): string {
    if (this.ptype) {
      return this.ptype.name
    }
    return this.constructor.name
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    throw new NotSupported(`Calling ${this.typeDescription}`, {
      sourceLocation,
    })
  }

  newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    throw new NotSupported(`Calling ${this.typeDescription} with the new keyword`, { sourceLocation })
  }

  taggedTemplate(
    head: string,
    spans: ReadonlyArray<readonly [InstanceBuilder, string]>,
    typeArgs: ReadonlyArray<PType>,
    sourceLocation: SourceLocation,
  ): InstanceBuilder {
    throw new NotSupported(`Tagged templates on ${this.typeDescription}`, {
      sourceLocation,
    })
  }

  hasProperty(_name: string): boolean {
    return false
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    if (/^\d+$/.test(name)) {
      const idx = instanceEb(nodeFactory.uInt64Constant({ value: BigInt(name), sourceLocation }), uint64PType)
      return this.indexAccess(idx, sourceLocation)
    }
    throw new NotSupported(`Accessing member ${name} on ${this.typeDescription}`, {
      sourceLocation,
    })
  }

  indexAccess(index: InstanceBuilder | bigint, sourceLocation: SourceLocation): NodeBuilder {
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
  abstract get ptype(): TPType
  abstract resolve(): awst.Expression
  abstract resolveLValue(): awst.LValue

  abstract get isConstant(): boolean

  /**
   * Returns a boolean indicating if the current builder can be resolved to the target type.
   * Resolvable meaning it may have a different type, but would be assignable to the target type in TypeScript
   * without a cast.
   * @param ptype
   */
  resolvableToPType(ptype: PTypeOrClass): boolean {
    return this.ptype.equalsOrInstanceOf(ptype)
  }

  /**
   * Attempts to resolve the value held by this builder to the target type.
   * @param ptype
   */
  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (this.ptype.equalsOrInstanceOf(ptype)) {
      return this
    }
    throw CodeError.cannotResolveToType({ sourceType: this.ptype, targetType: ptype, sourceLocation: this.sourceLocation })
  }

  singleEvaluation(): InstanceBuilder {
    const expr = this.resolve()
    if (instanceOfAny(expr, awst.VarExpression, awst.SingleEvaluation) || isConstant(expr)) {
      return this
    }
    return instanceEb(
      nodeFactory.singleEvaluation({
        source: this.resolve(),
      }),
      this.ptype,
    )
  }

  toBytes(sourceLocation: SourceLocation): InstanceBuilder {
    throw new NotSupported(`Serializing ${this.typeDescription} to bytes`, {
      sourceLocation,
    })
  }

  toString(sourceLocation: SourceLocation): awst.Expression {
    throw new NotSupported(`Converting ${this.typeDescription} to string`, {
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

  augmentedAssignment(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    throw new NotSupported(`Augmented assignment to ${this.typeDescription} with ${op}`, {
      sourceLocation,
    })
  }

  checkForUnclonedMutables(scenario: string): boolean {
    throw new InternalError(`Method not implemented on ${this.constructor.name}`, { sourceLocation: this.sourceLocation })
  }
}

/**
 * Base type for an instance builder that wraps another instance builder.
 * All methods are abstract to ensure they are implemented in the extending class
 */
export abstract class WrappingInstanceBuilder<TPType extends PType = PType> extends InstanceBuilder<TPType> {
  abstract get ptype(): TPType
  abstract resolve(): awst.Expression
  abstract resolveLValue(): awst.LValue

  abstract get isConstant(): boolean
  abstract resolvableToPType(ptype: PTypeOrClass): boolean
  abstract resolveToPType(ptype: PTypeOrClass): InstanceBuilder
  abstract singleEvaluation(): InstanceBuilder
  abstract toBytes(sourceLocation: SourceLocation): InstanceBuilder
  abstract toString(sourceLocation: SourceLocation): awst.Expression
  abstract prefixUnaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder
  abstract postfixUnaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder
  abstract compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder
  abstract binaryOp(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder
  abstract iterate(sourceLocation: SourceLocation): awst.Expression
  abstract augmentedAssignment(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder
  abstract call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder
  abstract newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder
  abstract taggedTemplate(
    head: string,
    spans: ReadonlyArray<readonly [InstanceBuilder, string]>,
    typeArgs: ReadonlyArray<PType>,
    sourceLocation: SourceLocation,
  ): InstanceBuilder
  abstract hasProperty(_name: string): boolean
  abstract memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder
  abstract indexAccess(index: InstanceBuilder | bigint, sourceLocation: SourceLocation): NodeBuilder
  abstract boolEval(sourceLocation: SourceLocation, negate: boolean): awst.Expression
}

export abstract class ClassBuilder extends NodeBuilder {
  abstract readonly ptype: LibClassType | GenericPType | ARC4StructClass

  abstract newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    throw new CodeError(`${this.typeDescription} should be called with the \`new\` keyword`, { sourceLocation })
  }
}

export abstract class FunctionBuilder extends NodeBuilder {
  readonly ptype: PType | undefined = undefined

  constructor(location: SourceLocation) {
    super(location)
  }

  abstract call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder
}

export abstract class InstanceExpressionBuilder<TPType extends PType> extends InstanceBuilder<PType> {
  #ptype: TPType

  get ptype(): TPType {
    return this.#ptype
  }

  get isConstant() {
    return isConstantOrTemplateVar(this._expr)
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

  checkForUnclonedMutables(scenario: string) {
    if (isReferableExpression(this._expr)) {
      if (isOrContainsMutableType(this.ptype)) {
        logger.error(
          this.sourceLocation,
          `cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when ${scenario}`,
        )
        return true
      }
    }
    return false
  }
}

export function isReferableExpression(expr: awst.Expression): boolean {
  if (
    instanceOfAny(
      expr,
      awst.VarExpression,
      awst.AppStateExpression,
      awst.AppAccountStateExpression,
      awst.StateGet,
      awst.StateGetEx,
      awst.BoxValueExpression,
    )
  ) {
    return true
  } else if (instanceOfAny(expr, awst.IndexExpression, awst.TupleItemExpression, awst.FieldExpression)) {
    return isReferableExpression(expr.base)
  }
  return false
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
  if (expr instanceof TupleItemExpression && expr.base.wtype.immutable) {
    throw new CodeError('Expression is not a valid assignment target - object is immutable', { sourceLocation: expr.sourceLocation })
  }
  if (!lValueNodes.some((l) => expr instanceof l)) {
    throw new CodeError(`Expression is not a valid assignment target`, {
      sourceLocation: expr.sourceLocation,
    })
  }
  if (expr instanceof awst.IndexExpression || expr instanceof awst.FieldExpression) {
    if (expr.base.wtype.immutable) {
      throw new CodeError(`Expression is not a valid assignment target - object is immutable`, {
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

export class DecoratorDataBuilder extends NodeBuilder {
  get ptype(): PType | undefined {
    return undefined
  }
  constructor(
    sourceLocation: SourceLocation,
    private readonly data: DecoratorData,
  ) {
    super(sourceLocation)
  }

  resolveDecoratorData(): DecoratorData {
    return this.data
  }
}
