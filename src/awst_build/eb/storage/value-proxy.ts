import { BuilderBinaryOp, BuilderComparisonOp, BuilderUnaryOp, InstanceBuilder, InstanceExpressionBuilder, NodeBuilder } from '../index'
import { PType } from '../../ptypes'
import { typeRegistry } from '../../type-registry'
import { SourceLocation } from '../../../awst/source-location'
import { Expression } from '../../../awst/nodes'

export abstract class ValueProxy<TPType extends PType> extends InstanceExpressionBuilder<TPType> {
  private get proxied(): InstanceBuilder {
    return typeRegistry.getInstanceEb(this._expr, this.ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    return this.proxied.memberAccess(name, sourceLocation)
  }
  assign(other: InstanceBuilder, sourceLocation: SourceLocation): InstanceBuilder {
    return this.proxied.assign(other, sourceLocation)
  }
  augmentedAssignment(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    return this.proxied.augmentedAssignment(other, op, sourceLocation)
  }
  iterate(sourceLocation: SourceLocation): Expression {
    return this.proxied.iterate(sourceLocation)
  }
  indexAccess(index: InstanceBuilder, sourceLocation: SourceLocation): NodeBuilder {
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
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    return this.proxied.call(args, typeArgs, sourceLocation)
  }
  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    return this.proxied.compare(other, op, sourceLocation)
  }
  taggedTemplate(head: string, spans: ReadonlyArray<readonly [InstanceBuilder, string]>, sourceLocation: SourceLocation): InstanceBuilder {
    return this.proxied.taggedTemplate(head, spans, sourceLocation)
  }
  singleEvaluation(): InstanceBuilder {
    return this.proxied.singleEvaluation()
  }
  hasProperty(_name: string): boolean {
    return this.proxied.hasProperty(_name)
  }
  toBytes(sourceLocation: SourceLocation): Expression {
    return this.proxied.toBytes(sourceLocation)
  }
}
