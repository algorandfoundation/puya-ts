import { CodeError } from '../errors'
import type { DeliberateAny, Props } from '../typescript-helpers'
import { codeInvariant, invariant } from '../util'
import type { Expression, Statement } from './nodes'
import {
  AssignmentExpression,
  AssignmentStatement,
  BigUIntBinaryOperation,
  Block,
  BoolConstant,
  BooleanBinaryOperation,
  BytesComparisonExpression,
  BytesConstant,
  BytesEncoding,
  CheckedMaybe,
  concreteNodes,
  Copy,
  ExpressionStatement,
  IntegerConstant,
  IntrinsicCall,
  MethodDocumentation,
  Not,
  NumericComparisonExpression,
  ReinterpretCast,
  SingleEvaluation,
  StringConstant,
  TupleExpression,
  TupleItemExpression,
  UInt64BinaryOperation,
  VoidConstant,
} from './nodes'
import type { SourceLocation } from './source-location'
import type { WType } from './wtypes'
import * as wtypes from './wtypes'
import { boolWType, voidWType, WTuple } from './wtypes'

type ConcreteNodes = typeof concreteNodes

let singleEval = 0n
const explicitNodeFactory = {
  voidConstant(props: { sourceLocation: SourceLocation }): VoidConstant {
    return new VoidConstant({
      ...props,
      wtype: voidWType,
    })
  },
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
  uInt64Constant({
    value,
    tealAlias,
    sourceLocation,
  }: {
    value: bigint
    tealAlias?: string
    sourceLocation: SourceLocation
  }): IntegerConstant {
    if (value < 0n || value >= 2n ** 64n) {
      throw new CodeError(`uint64 overflow or underflow: ${value}`, { sourceLocation })
    }
    return new IntegerConstant({
      value,
      sourceLocation,
      wtype: wtypes.uint64WType,
      tealAlias: tealAlias ?? null,
    })
  },
  bigUIntConstant({ value, sourceLocation }: { value: bigint; sourceLocation: SourceLocation }): IntegerConstant {
    if (value < 0n || value >= 2n ** 512n) {
      throw new CodeError(`biguint overflow or underflow: ${value}`, { sourceLocation })
    }
    return new IntegerConstant({
      value,
      sourceLocation,
      wtype: wtypes.biguintWType,
      tealAlias: null,
    })
  },
  not(props: { expr: Expression; sourceLocation: SourceLocation }): Not {
    return new Not({
      ...props,
      wtype: boolWType,
    })
  },
  uInt64BinaryOperation(props: Omit<Props<UInt64BinaryOperation>, 'wtype'>): UInt64BinaryOperation {
    return new UInt64BinaryOperation({
      ...props,
      wtype: wtypes.uint64WType,
    })
  },
  bigUIntBinaryOperation(props: Omit<Props<BigUIntBinaryOperation>, 'wtype'>): BigUIntBinaryOperation {
    return new BigUIntBinaryOperation({
      ...props,
      wtype: wtypes.biguintWType,
    })
  },
  numericComparisonExpression(props: Omit<Props<NumericComparisonExpression>, 'wtype'>): NumericComparisonExpression {
    return new NumericComparisonExpression({
      ...props,
      wtype: boolWType,
    })
  },
  bytesComparisonExpression(props: Omit<Props<BytesComparisonExpression>, 'wtype'>): BytesComparisonExpression {
    codeInvariant(
      props.lhs.wtype.equals(props.rhs.wtype),
      `Operands type mismatch. lhs is ${props.lhs.wtype}, rhs is ${props.rhs.wtype}`,
      props.sourceLocation,
    )
    return new BytesComparisonExpression({
      ...props,
      wtype: boolWType,
    })
  },
  boolConstant(props: { value: boolean; sourceLocation: SourceLocation }): BoolConstant {
    return new BoolConstant({
      ...props,
      wtype: wtypes.boolWType,
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
    if (expr instanceof AssignmentExpression) {
      return new AssignmentStatement({
        ...expr,
      })
    }

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
  booleanBinaryOperation(props: Omit<Props<BooleanBinaryOperation>, 'wtype'>) {
    return new BooleanBinaryOperation({
      ...props,
      wtype: boolWType,
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
      wtype: new WTuple({ types: props.items.map((i) => i.wtype), immutable: false }),
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
  copy({ value, sourceLocation }: { value: Expression; sourceLocation: SourceLocation }) {
    return new Copy({
      value,
      sourceLocation,
      wtype: value.wtype,
    })
  },
  checkedMaybe({ expr, comment }: { expr: Expression; comment: string }) {
    invariant(expr.wtype instanceof WTuple && expr.wtype.types.length === 2, 'expr WType must be WTuple of 2')
    invariant(expr.wtype.types[1].equals(boolWType), '2nd tuple item type must be bool')
    return new CheckedMaybe({
      expr,
      comment,
      sourceLocation: expr.sourceLocation,
      wtype: expr.wtype.types[0],
    })
  },
  tupleItemExpression(props: Omit<Props<TupleItemExpression>, 'wtype'>) {
    invariant(
      props.base.wtype instanceof WTuple && props.base.wtype.types.length > Number(props.index),
      'expr.base must be WTuple with length greater than index',
    )
    return new TupleItemExpression({
      ...props,
      wtype: props.base.wtype.types[Number(props.index)],
    })
  },
  reinterpretCast({ expr, wtype, sourceLocation }: { expr: Expression; wtype: WType; sourceLocation: SourceLocation }) {
    if (expr instanceof BytesConstant) {
      return new BytesConstant({
        ...expr,
        wtype,
        sourceLocation,
      })
    }
    if (expr instanceof IntegerConstant) {
      return new IntegerConstant({
        ...expr,
        wtype,
        sourceLocation,
      })
    }

    return new ReinterpretCast({
      expr,
      wtype,
      sourceLocation,
    })
  },
} satisfies { [key in keyof ConcreteNodes]?: (...args: DeliberateAny[]) => DeliberateAny }

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
