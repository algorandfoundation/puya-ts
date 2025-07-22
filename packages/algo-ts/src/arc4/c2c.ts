import { CompileContractOptions, CompiledContract } from '../compiled'
import { gtxn } from '../gtxn'
import { NoImplementation } from '../internal/errors'
import { AnyFunction, ConstructorFor, DeliberateAny, InstanceMethod } from '../internal/typescript-helpers'
import { itxn } from '../itxn'
import { Contract } from './index'

/**
 * Defines txn fields that are available for a bare create application call.
 *
 * This is the regular application call fields minus:
 *  - appId: because the appId is not known when creating an application
 *  - appArgs: because a bare call cannot have arguments
 */
export type BareCreateApplicationCallFields = Omit<itxn.ApplicationCallFields, 'appId' | 'appArgs'>

/**
 * Conditional type which given a group transaction type, returns the equivalent inner transaction
 * params type.
 */
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
          : T extends gtxn.ApplicationCallTxn
            ? itxn.ApplicationCallItxnParams
            : itxn.ItxnParams

/**
 * Conditional type which given an application argument, returns the input type for that argument.
 *
 * The input type will usually be the original type apart from group transactions which will be substituted
 * with their equivalent inner transaction type.
 */
export type TypedApplicationArg<TArg> = TArg extends gtxn.Transaction ? GtxnToItxnFields<TArg> : TArg

/**
 * Conditional type which maps a tuple of application arguments to a tuple of input types for specifying those arguments.
 */
export type TypedApplicationArgs<TArgs> = TArgs extends []
  ? []
  : TArgs extends [infer TArg, ...infer TRest]
    ? readonly [TypedApplicationArg<TArg>, ...TypedApplicationArgs<TRest>]
    : never

/**
 * Application call fields with `appArgs` replaced with an `args` property that is strongly typed to the actual arguments for the
 * given application call.
 */
export type TypedApplicationCallFields<TArgs> = Omit<itxn.ApplicationCallFields, 'appArgs'> &
  (TArgs extends [] ? { readonly args?: TypedApplicationArgs<TArgs> } : { readonly args: TypedApplicationArgs<TArgs> })

/**
 * The response type of a typed application call. Includes the raw itxn result object and the parsed ABI return value if applicable.
 */
export type TypedApplicationCallResponse<TReturn> = TReturn extends void
  ? { readonly itxn: itxn.ApplicationCallInnerTxn }
  : { readonly itxn: itxn.ApplicationCallInnerTxn; readonly returnValue: TReturn }

/**
 * Conditional type which maps an ABI method to a factory method for constructing an application call transaction to call that method.
 */
export type ContractProxyMethod<TMethod> = TMethod extends (...args: infer TArgs) => infer TReturn
  ? (fields?: TypedApplicationCallFields<TArgs>) => TypedApplicationCallResponse<TReturn>
  : never

/**
 * Conditional type which maps an ARC4 compatible contract to a proxy object which allows for constructing application call transactions for
 * all available ABI and bare methods. Also includes the compiled contract result data.
 */
export type ContractProxy<TContract extends Contract> = CompiledContract & {
  /**
   * Get methods for calling ABI and bare methods on the target contract
   */
  call: {
    /**
     * Invoke this method via an inner transaction call
     */
    [key in keyof TContract as key extends 'approvalProgram' | 'clearStateProgram'
      ? never
      : TContract[key] extends AnyFunction
        ? key
        : never]: ContractProxyMethod<TContract[key]>
  }
  /**
   * Create a bare application call itxn to create the contract.
   * @param fields Specify values for transaction fields which should override the default values.
   */
  bareCreate(fields?: BareCreateApplicationCallFields): itxn.ApplicationCallInnerTxn
}

/**
 * Pre compile the target ARC4 contract and return a proxy object for constructing inner transactions to call an instance of that contract.
 * @param contract An ARC4 contract class
 * @param options Compile contract arguments
 */
export function compileArc4<TContract extends Contract>(
  contract: ConstructorFor<TContract>,
  options?: CompileContractOptions,
): ContractProxy<TContract> {
  throw new NoImplementation()
}

/**
 * Invokes the target ABI method using a strongly typed fields object.
 * @param method An ABI method function reference.
 * @param fields Specify values for transaction fields.
 */
export function abiCall<TArgs extends DeliberateAny[], TReturn>(
  method: InstanceMethod<Contract, TArgs, TReturn>,
  fields: TypedApplicationCallFields<TArgs>,
): TypedApplicationCallResponse<TReturn> {
  throw new NoImplementation()
}
