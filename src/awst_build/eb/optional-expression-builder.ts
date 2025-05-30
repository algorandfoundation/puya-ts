import type { Expression, LValue } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError } from '../../errors'
import type { PType } from '../ptypes'
import { uint64PType, UnionPType } from '../ptypes'
import type { BuilderBinaryOp, BuilderComparisonOp, NodeBuilder } from './index'
import { InstanceBuilder } from './index'

export class OptionalExpressionBuilder extends InstanceBuilder {
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
    return UnionPType.fromTypes([uint64PType, this.base.ptype])
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
  indexAccess(index: InstanceBuilder, sourceLocation: SourceLocation): NodeBuilder {
    this.#throwRequiresBang()
  }
}
