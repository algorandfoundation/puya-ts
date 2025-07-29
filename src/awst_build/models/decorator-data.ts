import type { ResourceEncoding } from '../../awst'
import type { OnCompletionAction } from '../../awst/models'
import type { ARC4CreateOption } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import type { Constants, SupportedAvmVersion } from '../../constants'
import type { InstanceBuilder } from '../eb'

export type Arc4AbiDecoratorData = {
  type: typeof Constants.symbolNames.arc4AbiDecoratorName
  create?: ARC4CreateOption
  createLocation?: SourceLocation
  allowedCompletionTypes?: OnCompletionAction[]
  allowedCompletionTypesLocation?: SourceLocation
  sourceLocation: SourceLocation
  readonly: boolean
  nameOverride: string | undefined
  resourceEncoding?: ResourceEncoding
  defaultArguments: Record<
    string,
    | {
        type: 'constant'
        value: InstanceBuilder
      }
    | {
        type: 'member'
        name: string
      }
  >
}

export type Arc4BareDecoratorData = {
  type: typeof Constants.symbolNames.arc4BareDecoratorName
  create?: ARC4CreateOption
  createLocation?: SourceLocation
  allowedCompletionTypes?: OnCompletionAction[]
  allowedCompletionTypesLocation?: SourceLocation
  sourceLocation: SourceLocation
}

export type LogicSigOptionsDecoratorData = {
  type: typeof Constants.symbolNames.logicSigOptionsDecoratorName
  sourceLocation: SourceLocation
  avmVersion?: SupportedAvmVersion
  name?: string
  scratchSlots?: Set<bigint>
}
export type ContractOptionsDecoratorData = {
  type: typeof Constants.symbolNames.contractOptionsDecoratorName
  sourceLocation: SourceLocation
  avmVersion?: SupportedAvmVersion
  name?: string
  resourceEncoding?: ResourceEncoding
  scratchSlots?: Set<bigint>
  stateTotals?: {
    globalUints?: bigint
    globalBytes?: bigint
    localUints?: bigint
    localBytes?: bigint
  }
}

export type DecoratorData = Arc4BareDecoratorData | Arc4AbiDecoratorData | LogicSigOptionsDecoratorData | ContractOptionsDecoratorData
export type RoutingDecoratorData = Arc4AbiDecoratorData | Arc4BareDecoratorData

export type DecoratorType = DecoratorData['type']

export type DecoratorDataForType<TType extends DecoratorType> = DecoratorData extends infer TDec
  ? TDec extends { type: TType }
    ? TDec
    : never
  : never
