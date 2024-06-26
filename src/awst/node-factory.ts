import { BoolConstant, BytesConstant, BytesEncoding, concreteNodes, IntegerConstant, StringConstant } from './nodes'
import { DeliberateAny } from '../typescript-helpers'
import { SourceLocation } from './source-location'
import * as wtypes from './wtypes'
import { invariant } from '../util'
import { WType } from './wtypes'

type ConcreteNodes = typeof concreteNodes

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
      tealAlias: props.tealAlias,
    })
  },
  boolConstant(props: { value: boolean; sourceLocation: SourceLocation }): BoolConstant {
    return new BoolConstant({
      wtype: wtypes.boolWType,
      ...props,
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
