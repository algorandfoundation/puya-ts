import type { Expression, LValue } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError } from '../../errors'
import type { PType, PTypeOrClass } from '../ptypes'
import { undefinedPType, UnionPType } from '../ptypes'
import type { BuilderBinaryOp, BuilderComparisonOp, BuilderUnaryOp, InstanceBuilder, NodeBuilder } from './index'
import { WrappingInstanceBuilder } from './index'

export class OptionalExpressionBuilder extends WrappingInstanceBuilder {
  resolvableToPType(ptype: PTypeOrClass): boolean {
    this.#throwRequiresBang()
  }
  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    this.#throwRequiresBang()
  }
  singleEvaluation(): InstanceBuilder {
    this.#throwRequiresBang()
  }
  toBytes(sourceLocation: SourceLocation): InstanceBuilder {
    this.#throwRequiresBang()
  }
  toString(sourceLocation: SourceLocation): Expression {
    this.#throwRequiresBang()
  }
  prefixUnaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    this.#throwRequiresBang()
  }
  postfixUnaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    this.#throwRequiresBang()
  }
  iterate(sourceLocation: SourceLocation): Expression {
    this.#throwRequiresBang()
  }
  hasProperty(_name: string): boolean {
    this.#throwRequiresBang()
  }
  boolEval(sourceLocation: SourceLocation, negate: boolean): Expression {
    this.#throwRequiresBang()
  }
  get isConstant(): boolean {
    return this.#base.isConstant
  }

  get base() {
    return this.#base
  }

  #base: InstanceBuilder
  constructor(base: InstanceBuilder) {
    super(base.sourceLocation)
    this.#base = base
  }

  get ptype(): PType {
    return UnionPType.fromTypes([undefinedPType, this.base.ptype])
  }

  #throwRequiresBang(): never {
    throw new CodeError('This expression requires a non-null assertion operator "!" immediately proceeding it', {
      sourceLocation: this.sourceLocation,
    })
  }

  resolve(): Expression {
    this.#throwRequiresBang()
  }
  resolveLValue(): LValue {
    this.#throwRequiresBang()
  }
  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    this.#throwRequiresBang()
  }
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    this.#throwRequiresBang()
  }
  newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    this.#throwRequiresBang()
  }
  binaryOp(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    this.#throwRequiresBang()
  }
  augmentedAssignment(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    this.#throwRequiresBang()
  }
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    this.#throwRequiresBang()
  }
  taggedTemplate(
    head: string,
    spans: ReadonlyArray<readonly [InstanceBuilder, string]>,
    typeArgs: ReadonlyArray<PType>,
    sourceLocation: SourceLocation,
  ): InstanceBuilder {
    this.#throwRequiresBang()
  }
  indexAccess(index: InstanceBuilder | bigint, sourceLocation: SourceLocation): NodeBuilder {
    this.#throwRequiresBang()
  }
}
