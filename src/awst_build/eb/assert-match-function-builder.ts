import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { nodeFactory } from '../../awst/node-factory'
import type { Expression } from '../../awst/nodes'
import { BinaryBooleanOperator } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError } from '../../errors'
import { codeInvariant } from '../../util'
import type { PType } from '../ptypes'
import { assertMatchFunction, ObjectPType, stringPType, TuplePType, uint64PType } from '../ptypes'
import { instanceEb } from '../type-registry'
import type { InstanceBuilder } from './index'
import { BuilderComparisonOp, NodeBuilder } from './index'
import { requireBuilderOfType, requireInstanceBuilder, requireStringConstant } from './util'
import { parseFunctionArgs } from './util/arg-parsing'
import { VoidExpressionBuilder } from './void-expression-builder'

export class AssertMatchFunctionBuilder extends NodeBuilder {
  readonly ptype = assertMatchFunction

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [subject, tests, comment],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      genericTypeArgs: 1,
      funcName: 'assertMatch',
      argSpec: (a) => [a.passthrough(), a.required(), a.optional(stringPType)],
    })
    codeInvariant(subject, 'subject parameter is missing', sourceLocation)

    codeInvariant(tests.ptype instanceof ObjectPType, 'Test conditions must be an object type', tests.sourceLocation)

    const condition = tests.ptype
      .orderedProperties()
      .reduce((acc: Expression | undefined, [propName, propType]): Expression | undefined => {
        const subjectProperty = requireInstanceBuilder(subject.memberAccess(propName, sourceLocation))
        const subjectType = subjectProperty.ptype
        const testProperty = requireInstanceBuilder(tests.memberAccess(propName, sourceLocation))
        if (testProperty.resolvableToPType(subjectType)) {
          return combineConditions(
            acc,
            subjectProperty.compare(testProperty, BuilderComparisonOp.eq, sourceLocation).resolve(),
            sourceLocation,
          )
        } else if (testProperty.hasProperty('between')) {
          const range = requireInstanceBuilder(testProperty.memberAccess('between', sourceLocation)).singleEvaluation()
          const rangePType = new TuplePType({ items: [subjectType, subjectType] })
          codeInvariant(range.resolvableToPType(rangePType), 'Between range must be of type $')
          const zeroIndex = instanceEb(nodeFactory.uInt64Constant({ value: 0n, sourceLocation }), uint64PType)
          const gte = subjectProperty
            .compare(
              requireBuilderOfType(range.indexAccess(zeroIndex, sourceLocation), subjectType),
              BuilderComparisonOp.gte,
              sourceLocation,
            )
            .resolve()

          const oneIndex = instanceEb(nodeFactory.uInt64Constant({ value: 1n, sourceLocation }), uint64PType)
          const lte = subjectProperty
            .compare(
              requireBuilderOfType(range.indexAccess(oneIndex, sourceLocation), subjectType),
              BuilderComparisonOp.lte,
              sourceLocation,
            )
            .resolve()

          return combineConditions(acc, combineConditions(lte, gte, sourceLocation), sourceLocation)
        } else {
          const [op, operand] = getComparisonOpAndOperand(testProperty, subjectType)
          return combineConditions(acc, subjectProperty.compare(operand, op, sourceLocation).resolve(), sourceLocation)
        }
      }, undefined)

    codeInvariant(condition, 'assertMatch must have at least 1 condition', sourceLocation)
    const commentStr = comment ? requireStringConstant(comment).value : 'assert target is match for conditions'
    return new VoidExpressionBuilder(
      intrinsicFactory.assert({
        condition,
        comment: commentStr,
        sourceLocation,
      }),
    )
  }
}

function getComparisonOpAndOperand(testProperty: InstanceBuilder, targetType: PType): [BuilderComparisonOp, operand: InstanceBuilder] {
  const ops = {
    lessThan: BuilderComparisonOp.lt,
    lessThanEq: BuilderComparisonOp.lte,
    greaterThan: BuilderComparisonOp.gt,
    greaterThanEq: BuilderComparisonOp.gte,
  }
  for (const [prop, op] of Object.entries(ops)) {
    if (testProperty.hasProperty(prop)) {
      return [op, requireBuilderOfType(testProperty.memberAccess(prop, testProperty.sourceLocation), targetType)]
    }
  }
  throw new CodeError(`Cannot compare values of type ${testProperty.ptype} and ${targetType.name}`, {
    sourceLocation: testProperty.sourceLocation,
  })
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
