import type ts from 'typescript'
import type {
  AppAccountStateExpression,
  AppStateExpression,
  Expression,
  FieldExpression,
  IndexExpression,
  TupleExpression,
  VarExpression,
} from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import type { PType, PTypeOrClass } from '../../ptypes'
import { typeRegistry } from '../../type-registry'
import type { BuilderBinaryOp, BuilderComparisonOp, BuilderUnaryOp, InstanceBuilder, NodeBuilder } from '../index'
import { InstanceExpressionBuilder } from '../index'

export abstract class ValueProxy<TPType extends PType> extends InstanceExpressionBuilder<TPType> {
  private get proxied(): InstanceBuilder {
    return typeRegistry.getInstanceEb(this._expr, this.ptype)
  }

  resolve(): Expression {
    return this.proxied.resolve()
  }
  resolveLValue(): VarExpression | FieldExpression | IndexExpression | TupleExpression | AppStateExpression | AppAccountStateExpression {
    return this.proxied.resolveLValue()
  }
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    return this.proxied.memberAccess(name, sourceLocation)
  }
  augmentedAssignment(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    return this.proxied.augmentedAssignment(other, op, sourceLocation)
  }
  iterate(sourceLocation: SourceLocation): Expression {
    return this.proxied.iterate(sourceLocation)
  }
  indexAccess(index: InstanceBuilder | bigint, sourceLocation: SourceLocation): NodeBuilder {
    return this.proxied.indexAccess(index, sourceLocation)
  }
  boolEval(sourceLocation: SourceLocation, negate: boolean = false): Expression {
    return this.proxied.boolEval(sourceLocation, negate)
  }
  binaryOp(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    return this.proxied.binaryOp(other, op, sourceLocation)
  }
  prefixUnaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    return this.proxied.prefixUnaryOp(op, sourceLocation)
  }
  postfixUnaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    return this.proxied.postfixUnaryOp(op, sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
    return this.proxied.call(args, typeArgs, sourceLocation)
  }
  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    return this.proxied.compare(other, op, sourceLocation)
  }
  taggedTemplate(
    head: string,
    spans: ReadonlyArray<readonly [InstanceBuilder, string]>,
    typeArgs: readonly PType[],
    sourceLocation: SourceLocation,
  ): InstanceBuilder {
    return this.proxied.taggedTemplate(head, spans, typeArgs, sourceLocation)
  }
  singleEvaluation(): InstanceBuilder {
    return this.proxied.singleEvaluation()
  }
  hasProperty(_name: string): boolean {
    return this.proxied.hasProperty(_name)
  }
  toBytes(sourceLocation: SourceLocation): InstanceBuilder {
    return this.proxied.toBytes(sourceLocation)
  }
  resolvableToPType(ptype: PTypeOrClass): boolean {
    return this.proxied.resolvableToPType(ptype)
  }
  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    return this.proxied.resolveToPType(ptype)
  }
}
