import type { awst } from '../../awst'
import type { Expression, LValue } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError } from '../../errors'
import type { PType, PTypeOrClass } from '../ptypes'
import { TransientType } from '../ptypes'
import type { BuilderBinaryOp, BuilderComparisonOp, BuilderUnaryOp, NodeBuilder } from './index'
import { InstanceBuilder } from './index'

export abstract class LiteralExpressionBuilder extends InstanceBuilder {
  resolve(): Expression {
    this.throwInvalidExpression()
  }

  resolveLValue(): LValue {
    throw new CodeError('A literal value is not a valid assignment target', { sourceLocation: this.sourceLocation })
  }

  abstract resolvableToPType(ptype: PTypeOrClass): boolean

  abstract resolveToPType(ptype: PTypeOrClass): InstanceBuilder

  private throwInvalidExpression(): never {
    if (this.ptype instanceof TransientType) throw new CodeError(this.ptype.expressionMessage, { sourceLocation: this.sourceLocation })
    throw new CodeError(`Invalid expression type ${this.ptype}`, { sourceLocation: this.sourceLocation })
  }

  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    this.throwInvalidExpression()
  }

  binaryOp(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    this.throwInvalidExpression()
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    this.throwInvalidExpression()
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    this.throwInvalidExpression()
  }

  taggedTemplate(
    head: string,
    spans: ReadonlyArray<readonly [InstanceBuilder, string]>,
    typeArgs: readonly PType[],
    sourceLocation: SourceLocation,
  ): InstanceBuilder {
    this.throwInvalidExpression()
  }

  indexAccess(index: InstanceBuilder | bigint, sourceLocation: SourceLocation): NodeBuilder {
    this.throwInvalidExpression()
  }

  singleEvaluation(): InstanceBuilder {
    this.throwInvalidExpression()
  }

  toBytes(sourceLocation: SourceLocation): InstanceBuilder {
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
    return false
  }
}
