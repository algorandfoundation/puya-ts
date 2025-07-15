import { nodeFactory } from '../../awst/node-factory'
import type { Expression } from '../../awst/nodes'
import { BinaryBooleanOperator } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError } from '../../errors'
import { codeInvariant, instanceOfAny } from '../../util'
import type { PType } from '../ptypes'
import {
  ArrayPType,
  boolPType,
  ImmutableObjectPType,
  matchFunction,
  MutableObjectPType,
  MutableTuplePType,
  ObjectLiteralPType,
  ReadonlyTuplePType,
  uint64PType,
} from '../ptypes'
import { instanceEb } from '../type-registry'
import type { InstanceBuilder } from './index'
import { BuilderComparisonOp, NodeBuilder } from './index'
import { isStaticallyIterable, StaticIterator } from './traits/static-iterator'
import { requireBuilderOfType, requireInstanceBuilder } from './util'
import { parseFunctionArgs } from './util/arg-parsing'
import { wtypes } from '../../awst/wtypes'

export class MatchFunctionBuilder extends NodeBuilder {
  readonly ptype = matchFunction

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [subject, tests],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      genericTypeArgs: 1,
      funcName: 'match',
      argSpec: (a) => [a.passthrough(), a.required()],
    })
    codeInvariant(subject, 'subject parameter is missing', sourceLocation)

    return buildComparisons(subject, tests, this.typeDescription, sourceLocation)
  }
}

export function buildComparisons(subject: NodeBuilder, tests: InstanceBuilder, functionName: string, sourceLocation: SourceLocation) {
  if (instanceOfAny(tests.ptype, ImmutableObjectPType, MutableObjectPType, ObjectLiteralPType)) {
    const condition = tests.ptype
      .orderedProperties()
      .reduce((acc: Expression | undefined, [propName, propType]): Expression | undefined => {
        const subjectProperty = requireInstanceBuilder(subject.memberAccess(propName, sourceLocation))
        const testProperty = requireInstanceBuilder(tests.memberAccess(propName, sourceLocation))

        const comparison = buildComparison(subjectProperty, testProperty, functionName, sourceLocation)
        return combineConditions(acc, comparison.resolve(), sourceLocation)
      }, undefined)
    codeInvariant(condition, `${functionName} must have at least 1 condition`, sourceLocation)
    return instanceEb(condition, boolPType)
  } else if (isStaticallyIterable(tests)) {
    const condition = tests[StaticIterator]().reduce<Expression | undefined>(
      (acc, testItem, index) => {
        const indexAsBuilder = instanceEb(nodeFactory.uInt64Constant({ value: BigInt(index), sourceLocation }), uint64PType)
        const subjectItem = requireInstanceBuilder(subject.indexAccess(indexAsBuilder, sourceLocation))
        const comparison = buildComparison(subjectItem, testItem, functionName, sourceLocation)
        return combineConditions(acc, comparison.resolve(), sourceLocation)
      },
      compareLengths(subject, tests, functionName, sourceLocation),
    )
    codeInvariant(condition, `${functionName} must have at least 1 condition`, sourceLocation)
    return instanceEb(condition, boolPType)
  } else if (tests.ptype instanceof ArrayPType) {
    throw new CodeError(`${functionName} doesn't support matching against non literal arrays`, { sourceLocation: tests.sourceLocation })
  } else {
    throw new CodeError(`${functionName} requires either an object, array literal, or tuple`, { sourceLocation: tests.sourceLocation })
  }
}

function compareLengths(subject: NodeBuilder, tests: InstanceBuilder, functionName: string, sourceLocation: SourceLocation) {
  const subjectLength = requireInstanceBuilder(subject.memberAccess('length', sourceLocation))
  const testsLength = requireInstanceBuilder(tests.memberAccess('length', sourceLocation))

  return buildComparison(subjectLength, testsLength, functionName, sourceLocation).resolve()
}

function buildComparison(
  subjectProperty: InstanceBuilder,
  testProperty: InstanceBuilder,
  functionName: string,
  sourceLocation: SourceLocation,
): InstanceBuilder {
  const subjectType = subjectProperty.ptype
  // Recurse comparisons for nested objects
  if (
    subjectProperty.ptype instanceof ImmutableObjectPType ||
    subjectProperty.ptype instanceof MutableObjectPType ||
    subjectProperty.ptype instanceof ReadonlyTuplePType ||
    subjectProperty.ptype instanceof MutableTuplePType ||
    subjectProperty.ptype instanceof ArrayPType
  ) {
    return buildComparisons(subjectProperty, testProperty, functionName, sourceLocation)
  }

  if (testProperty.resolvableToPType(subjectType)) {
    return subjectProperty.compare(testProperty, BuilderComparisonOp.eq, sourceLocation)
  } else if (testProperty.hasProperty('between')) {
    const rangePType = new ReadonlyTuplePType({ items: [subjectType, subjectType] })
    const range = requireInstanceBuilder(testProperty.memberAccess('between', sourceLocation)).resolveToPType(rangePType).singleEvaluation()
    const zeroIndex = instanceEb(nodeFactory.uInt64Constant({ value: 0n, sourceLocation }), uint64PType)
    const gte = subjectProperty
      .compare(requireBuilderOfType(range.indexAccess(zeroIndex, sourceLocation), subjectType), BuilderComparisonOp.gte, sourceLocation)
      .resolve()

    const oneIndex = instanceEb(nodeFactory.uInt64Constant({ value: 1n, sourceLocation }), uint64PType)
    const lte = subjectProperty
      .compare(requireBuilderOfType(range.indexAccess(oneIndex, sourceLocation), subjectType), BuilderComparisonOp.lte, sourceLocation)
      .resolve()

    return instanceEb(combineConditions(lte, gte, sourceLocation), boolPType)
  } else {
    const [op, operand] = getComparisonOpAndOperand(testProperty, subjectType)
    return subjectProperty.compare(operand, op, sourceLocation)
  }
}

function getComparisonOpAndOperand(testProperty: InstanceBuilder, targetType: PType): [BuilderComparisonOp, operand: InstanceBuilder] {
  const ops = {
    lessThan: BuilderComparisonOp.lt,
    lessThanEq: BuilderComparisonOp.lte,
    greaterThan: BuilderComparisonOp.gt,
    greaterThanEq: BuilderComparisonOp.gte,
    not: BuilderComparisonOp.ne,
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
    return nodeFactory.intrinsicCall({
      opCode: '&&',
      stackArgs: [left, right],
      immediates: [],
      sourceLocation,
      wtype: wtypes.boolWType,
    })
  }
  return right
}
