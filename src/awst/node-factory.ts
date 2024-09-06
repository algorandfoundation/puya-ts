import type { Expression, Statement } from './nodes'
import { IntrinsicCall } from './nodes'
import { MethodDocumentation } from './nodes'
import { TupleExpression } from './nodes'
import { AssignmentStatement } from './nodes'
import { AssignmentExpression } from './nodes'
import {
  BigUIntBinaryOperation,
  Block,
  BoolConstant,
  BytesComparisonExpression,
  BytesConstant,
  BytesEncoding,
  concreteNodes,
  ExpressionStatement,
  IntegerConstant,
  Not,
  NumericComparisonExpression,
  SingleEvaluation,
  StringConstant,
  UInt64BinaryOperation,
} from './nodes'
import type { DeliberateAny, Props } from '../typescript-helpers'
import type { SourceLocation } from './source-location'
import * as wtypes from './wtypes'
import { codeInvariant, invariant } from '../util'
import type { WType } from './wtypes'
import { WTuple } from './wtypes'
import { boolWType } from './wtypes'

type ConcreteNodes = typeof concreteNodes

let singleEval = 0n
const explicitNodeFactory = {
  bytesConstant(props: { value: Uint8Array; encoding?: BytesEncoding; sourceLocation: SourceLocation; wtype?: WType }): BytesConstant {
    return new BytesConstant({
      encoding: BytesEncoding.unknown,
      wtype: wtypes.bytesWType,
      ...props,
    })
  },
  stringConstant(props: { value: string; sourceLocation: SourceLocation }): StringConstant {
    return new StringConstant({
      ...props,
      wtype: wtypes.stringWType,
    })
  },
  uInt64Constant(props: { value: bigint; tealAlias?: string; sourceLocation: SourceLocation }): IntegerConstant {
    return new IntegerConstant({
      wtype: wtypes.uint64WType,
      ...props,
      tealAlias: props.tealAlias ?? null,
    })
  },
  bigUIntConstant(props: { value: bigint; sourceLocation: SourceLocation }): IntegerConstant {
    return new IntegerConstant({
      wtype: wtypes.biguintWType,
      ...props,
      tealAlias: null,
    })
  },
  not(props: { expr: Expression; sourceLocation: SourceLocation }): Not {
    return new Not({
      wtype: boolWType,
      ...props,
    })
  },
  uInt64BinaryOperation(props: Omit<Props<UInt64BinaryOperation>, 'wtype'>): UInt64BinaryOperation {
    return new UInt64BinaryOperation({
      wtype: wtypes.uint64WType,
      ...props,
    })
  },
  bigUIntBinaryOperation(props: Omit<Props<BigUIntBinaryOperation>, 'wtype'>): BigUIntBinaryOperation {
    return new BigUIntBinaryOperation({
      wtype: wtypes.biguintWType,
      ...props,
    })
  },
  numericComparisonExpression(props: Omit<Props<NumericComparisonExpression>, 'wtype'>): NumericComparisonExpression {
    return new NumericComparisonExpression({
      wtype: boolWType,
      ...props,
    })
  },
  bytesComparisonExpression(props: Omit<Props<BytesComparisonExpression>, 'wtype'>): BytesComparisonExpression {
    return new BytesComparisonExpression({
      wtype: boolWType,
      ...props,
    })
  },
  boolConstant(props: { value: boolean; sourceLocation: SourceLocation }): BoolConstant {
    return new BoolConstant({
      wtype: wtypes.boolWType,
      ...props,
    })
  },
  singleEvaluation({ source }: { source: Expression }) {
    return new SingleEvaluation({
      id: singleEval++,
      sourceLocation: source.sourceLocation,
      wtype: source.wtype,
      source,
    })
  },
  expressionStatement({ expr }: { expr: Expression }) {
    return new ExpressionStatement({
      expr,
      sourceLocation: expr.sourceLocation,
    })
  },
  block(
    { sourceLocation, comment, label }: { sourceLocation: SourceLocation; comment?: string; label?: string },
    ...statements: Array<Statement | Statement[]>
  ) {
    return new Block({
      body: statements.flat(),
      sourceLocation,
      comment: comment ?? null,
      label: label ?? null,
    })
  },
  assignmentExpression({
    target,
    value,
    sourceLocation,
  }: {
    target: AssignmentExpression['target']
    value: Expression
    sourceLocation: SourceLocation
  }) {
    codeInvariant(target.wtype.equals(value.wtype), `Assignment target type ${target.wtype} must match assigned value type ${value.wtype}`)
    return new AssignmentExpression({
      target,
      value,
      wtype: value.wtype,
      sourceLocation,
    })
  },
  assignmentStatement({
    target,
    value,
    sourceLocation,
  }: {
    target: AssignmentStatement['target']
    value: Expression
    sourceLocation: SourceLocation
  }) {
    codeInvariant(target.wtype.equals(value.wtype), `Assignment target type ${target.wtype} must match assigned value type ${value.wtype}`)
    return new AssignmentStatement({
      target,
      value,
      sourceLocation,
    })
  },
  tupleExpression(props: Omit<Props<TupleExpression>, 'wtype'>) {
    return new TupleExpression({
      ...props,
      wtype: new WTuple({ types: props.items.map((i) => i.wtype), immutable: true }),
    })
  },
  methodDocumentation(props?: { description?: string | null; args?: Map<string, string>; returns?: string | null }) {
    return new MethodDocumentation({
      args: props?.args ?? new Map(),
      description: props?.description ?? null,
      returns: props?.returns ?? null,
    })
  },
  intrinsicCall(props: Omit<Props<IntrinsicCall>, 'comment'> & { comment?: string | null }) {
    return new IntrinsicCall({
      ...props,
      comment: props.comment ?? null,
    })
  },
} satisfies { [key in keyof ConcreteNodes]?: (...args: DeliberateAny[]) => InstanceType<ConcreteNodes[key]> }

type ExplicitNodeFactory = typeof explicitNodeFactory

type DefaultNodeFactory<TKey extends keyof ConcreteNodes> = (
  ...args: ConstructorParameters<ConcreteNodes[TKey]>
) => InstanceType<ConcreteNodes[TKey]>

export type NodeFactory = {
  [key in keyof ConcreteNodes]: FactoryMethod<key>
}

type FactoryMethod<TKey extends keyof ConcreteNodes> = TKey extends keyof ExplicitNodeFactory
  ? ExplicitNodeFactory[TKey]
  : DefaultNodeFactory<TKey>

function isNodeName(value: string | symbol): value is keyof ConcreteNodes {
  return typeof value === 'string' && Object.hasOwn(concreteNodes, value)
}

function hasExplicitFactory(value: string): value is keyof typeof explicitNodeFactory {
  return Object.hasOwn(explicitNodeFactory, value)
}

export const nodeFactory: NodeFactory = new Proxy({} as unknown as NodeFactory, {
  get(_, property) {
    invariant(isNodeName(property), 'Property must be the name of a concrete node')

    if (hasExplicitFactory(property)) {
      return explicitNodeFactory[property]
    }
    return (props: DeliberateAny) => new concreteNodes[property](props)
  },
})
