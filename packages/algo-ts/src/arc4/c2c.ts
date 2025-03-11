import { CompileContractOptions, CompiledContract } from '../compiled'
import { NoImplementation } from '../internal/errors'
import { AnyFunction, ConstructorFor, DeliberateAny, InstanceMethod } from '../internal/typescript-helpers'
import { ApplicationCallFields, ApplicationInnerTxn } from '../itxn'
import { Contract } from './index'

export type BareCreateApplicationCallFields = Omit<ApplicationCallFields, 'appId' | 'appArgs'>

export type TypedApplicationCallFields<TArgs> = Omit<ApplicationCallFields, 'appArgs'> &
  (TArgs extends [] ? { args?: TArgs } : { args: TArgs })

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
