import { Expression, LValue } from '../../awst/nodes'
import { PType } from '../ptypes'
import { BuilderBinaryOp, BuilderComparisonOp, BuilderUnaryOp, InstanceBuilder, NodeBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { awst } from '../../awst'
import { nodeFactory } from '../../awst/node-factory'
import { DeliberateAny } from '../../typescript-helpers'

/**
 * The AnyExpressionBuilder does not resolve to any meaningful awst however it can be used
 * to prevent cascading errors when no other appropriate value can be returned
 */
export class AnyExpressionBuilder extends InstanceBuilder {
  resolve(): Expression {
    return undefined as DeliberateAny
  }
  resolveLValue(): LValue {
    return undefined as DeliberateAny
  }
  get ptype(): PType | undefined {
    return undefined
  }

  unaryOp(_op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    return new AnyExpressionBuilder(sourceLocation)
  }

  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    return new AnyExpressionBuilder(sourceLocation)
  }
  binaryOp(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    return new AnyExpressionBuilder(sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    return new AnyExpressionBuilder(sourceLocation)
  }

  taggedTemplate(head: string, spans: ReadonlyArray<readonly [InstanceBuilder, string]>, sourceLocation: SourceLocation): InstanceBuilder {
    return new AnyExpressionBuilder(sourceLocation)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    return new AnyExpressionBuilder(sourceLocation)
  }

  boolEval(sourceLocation: SourceLocation, _negate: boolean): awst.Expression {
    return nodeFactory.boolConstant({ value: false, sourceLocation })
  }
}
