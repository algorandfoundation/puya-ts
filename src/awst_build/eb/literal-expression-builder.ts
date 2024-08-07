import type { Expression, LValue } from '../../awst/nodes'
import { CodeError } from '../../errors'
import type { PType } from '../ptypes'
import { TransientType } from '../ptypes'
import type { SourceLocation } from '../../awst/source-location'
import type { BuilderBinaryOp, BuilderComparisonOp, BuilderUnaryOp, NodeBuilder } from './index'
import { InstanceBuilder } from './index'
import type { awst } from '../../awst'

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
    throw new CodeError(`Invalid expression type ${this.ptype}`, { sourceLocation: this.sourceLocation })
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
