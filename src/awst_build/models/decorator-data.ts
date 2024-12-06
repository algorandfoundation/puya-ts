import type { ARC4CreateOption, OnCompletionAction } from '../../awst/models'
import type { SourceLocation } from '../../awst/source-location'
import type { Constants, SupportedAvmVersion } from '../../constants'

export type Arc4AbiDecoratorData = {
  type: typeof Constants.arc4AbiDecoratorName
  create: ARC4CreateOption
  ocas: OnCompletionAction[]
  sourceLocation: SourceLocation
  readonly: boolean
  nameOverride: string | undefined
  defaultArguments: Record<
    string,
    | {
        type: 'constant'
        value: string | boolean | bigint | Uint8Array
      }
    | {
        type: 'member'
        name: string
      }
  >
}

export type Arc4BareDecoratorData = {
  type: typeof Constants.arc4BareDecoratorName
  create: ARC4CreateOption
  ocas: OnCompletionAction[]
  sourceLocation: SourceLocation
}

export type LogicSigOptionsDecoratorData = {
  type: typeof Constants.logicSigOptionsDecoratorName
  sourceLocation: SourceLocation
  avmVersion?: SupportedAvmVersion
  name?: string
}
type NumberRange = { from: bigint; to: bigint }
export type ContractOptionsDecoratorData = {
  type: typeof Constants.contractOptionsDecoratorName
  sourceLocation: SourceLocation
  avmVersion?: SupportedAvmVersion
  name?: string
  scratchSlots?: Array<bigint | NumberRange>
  stateTotals?: {
    globalUints?: bigint
    globalBytes?: bigint
    localUints?: bigint
    localBytes?: bigint
  }
}

export type DecoratorData = Arc4BareDecoratorData | Arc4AbiDecoratorData | LogicSigOptionsDecoratorData | ContractOptionsDecoratorData

export type DecoratorType = DecoratorData['type']

export type DecoratorDataForType<TType extends DecoratorType> = DecoratorData extends infer TDec
  ? TDec extends { type: TType }
    ? TDec
    : never
  : never
