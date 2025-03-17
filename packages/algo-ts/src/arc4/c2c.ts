import { CompileContractOptions, CompiledContract } from '../compiled'
import * as gtxn from '../gtxn'
import { NoImplementation } from '../internal/errors'
import { AnyFunction, ConstructorFor, DeliberateAny, InstanceMethod } from '../internal/typescript-helpers'
import * as itxn from '../itxn'
import { ApplicationCallFields, ApplicationInnerTxn } from '../itxn'
import { Contract } from './index'

export type BareCreateApplicationCallFields = Omit<ApplicationCallFields, 'appId' | 'appArgs'>

export type GtxnToItxnFields<T extends gtxn.Transaction> = T extends gtxn.PaymentTxn
  ? itxn.PaymentItxnParams
  : T extends gtxn.KeyRegistrationTxn
    ? itxn.KeyRegistrationItxnParams
    : T extends gtxn.AssetConfigTxn
      ? itxn.AssetConfigItxnParams
      : T extends gtxn.AssetTransferTxn
        ? itxn.AssetTransferItxnParams
        : T extends gtxn.AssetFreezeTxn
          ? itxn.AssetFreezeItxnParams
          : T extends gtxn.ApplicationTxn
            ? itxn.ApplicationCallItxnParams
            : itxn.InnerTransaction

export type TypedApplicationArg<TArg> = TArg extends gtxn.Transaction ? GtxnToItxnFields<TArg> : TArg
export type TypedApplicationArgs<TArgs> = TArgs extends []
  ? []
  : TArgs extends [infer TArg, ...infer TRest]
    ? [TypedApplicationArg<TArg>, ...TypedApplicationArgs<TRest>]
    : never

export type TypedApplicationCallFields<TArgs> = Omit<ApplicationCallFields, 'appArgs'> &
  (TArgs extends [] ? { args?: TypedApplicationArgs<TArgs> } : { args: TypedApplicationArgs<TArgs> })

export type TypedApplicationCallResponse<TReturn> = TReturn extends void
  ? { itxn: ApplicationInnerTxn }
  : { itxn: ApplicationInnerTxn; returnValue: TReturn }

export type ContractProxyMethod<TMethod> = TMethod extends (...args: infer TArgs) => infer TReturn
  ? (fields?: TypedApplicationCallFields<TArgs>) => TypedApplicationCallResponse<TReturn>
  : never

export type ContractProxy<TContract extends Contract> = CompiledContract & {
  call: {
    [key in keyof TContract as key extends 'approvalProgram' | 'clearStateProgram'
      ? never
      : TContract[key] extends AnyFunction
        ? key
        : never]: ContractProxyMethod<TContract[key]>
  }
  bareCreate(fields?: BareCreateApplicationCallFields): ApplicationInnerTxn
}

export function compileArc4<TContract extends Contract>(
  contract: ConstructorFor<TContract>,
  options?: CompileContractOptions,
): ContractProxy<TContract> {
  throw new NoImplementation()
}

export function abiCall<TArgs extends DeliberateAny[], TReturn>(
  method: InstanceMethod<Contract, TArgs, TReturn>,
  fields: TypedApplicationCallFields<TArgs>,
): TypedApplicationCallResponse<TReturn> {
  throw new NoImplementation()
}
