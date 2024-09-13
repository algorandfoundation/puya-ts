import type { InstanceBuilder } from './index'
import { BuilderComparisonOp, NodeBuilder } from './index'
import type { PType } from '../ptypes'
import { assertMatchFunction } from '../ptypes'
import type { SourceLocation } from '../../awst/source-location'
import { parseFunctionArgs } from './util/arg-parsing'
import { codeInvariant } from '../../util'
import { ObjectLiteralExpressionBuilder } from './literal/object-literal-expression-builder'
import type { Expression } from '../../awst/nodes'
import { BinaryBooleanOperator } from '../../awst/nodes'
import { nodeFactory } from '../../awst/node-factory'
import { requireInstanceBuilder } from './util'
import { VoidExpressionBuilder } from './void-expression-builder'
import { intrinsicFactory } from '../../awst/intrinsic-factory'

export class AssertMatchFunctionBuilder extends NodeBuilder {
  readonly ptype = assertMatchFunction

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [subject, tests],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      funcName: 'assertMatch',
      argSpec: (a) => [a.required(), a.required()],
    })

    codeInvariant(tests instanceof ObjectLiteralExpressionBuilder, 'Test conditions must be an object literal', tests.sourceLocation)

    const condition = tests.ptype
      .orderedProperties()
      .reduce((acc: Expression | undefined, [propName, propType]): Expression | undefined => {
        const subjectProperty = requireInstanceBuilder(subject.memberAccess(propName, sourceLocation))
        const testProperty = requireInstanceBuilder(tests.memberAccess(propName, sourceLocation))
        if (subjectProperty.ptype?.equals(propType)) {
          return combineConditions(
            acc,
            subjectProperty.compare(testProperty, BuilderComparisonOp.eq, sourceLocation).resolve(),
            sourceLocation,
          )
        } else {
          // Handle lt/gt/between
        }
        return undefined
      }, undefined)

    codeInvariant(condition, 'assertMatch must have at least 1 condition', sourceLocation)

    return new VoidExpressionBuilder(
      intrinsicFactory.assert({
        condition,
        comment: 'assert target is match for conditions',
        sourceLocation,
      }),
    )
  }
}

function combineConditions(left: Expression | undefined, right: Expression, sourceLocation: SourceLocation): Expression {
  if (left) {
    return nodeFactory.booleanBinaryOperation({
      left: left,
      right: right,
      op: BinaryBooleanOperator.and,
      sourceLocation,
    })
  }
  return right
}
