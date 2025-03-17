import { BaseContract } from '../base-contract'
import { NoImplementation } from '../internal/errors'
import { DeliberateAny } from '../internal/typescript-helpers'
import { OnCompleteActionStr } from '../on-complete-action'
import { bytes } from '../primitives'

export * from './encoded-types'

/**
 * The base type for all ARC4 contracts in Algorand TypeScript
 */
export class Contract extends BaseContract {
  /**
   * Default implementation of an ARC4 approval program, routes transactions to ABI or bare methods based on application
   * args and on completion actions
   */
  override approvalProgram(): boolean {
    throw new NoImplementation()
  }
}

/**
 * The possible options for a method being available on application create
 *
 * allow: This method CAN be called when the application is being created, but it is not required
 * disallow: This method CANNOT be called when the application is being created
 * require: This method CAN ONLY be called when the application is being created
 */
export type CreateOptions = 'allow' | 'disallow' | 'require'

/**
 * Type alias for a default argument schema
 * @typeParam TContract The type of the contract containing the method this default argument is for
 */
export type DefaultArgument<TContract extends Contract> =
  | {
      /**
       * A compile time constant value to be used as a default
       */
      constant: string | boolean | number | bigint
    }
  | {
      /**
       * Retrieve the default value from a member of this contract. The member can be
       *
       * LocalState: The value is retrieved from the calling user's local state before invoking this method
       * GlobalState: The value is retrieved from the specified global state key before invoking this method
       * Method: Any readonly abimethod with no arguments can be used as a source
       */
      from: keyof TContract
    }
/**
 * Configuration options for an abi method
 * @typeParam TContract the type of the contract this method is a part of
 */
export type AbiMethodConfig<TContract extends Contract> = {
  /**
   * Which on complete action(s) are allowed when invoking this method.
   * @default 'NoOp'
   */
  allowActions?: OnCompleteActionStr | OnCompleteActionStr[]
  /**
   * Whether this method should be callable when creating the application.
   * @default 'disallow'
   */
  onCreate?: CreateOptions
  /**
   * Does the method only perform read operations (no mutation of chain state)
   * @default false
   */
  readonly?: boolean
  /**
   * Override the name used to generate the abi method selector
   */
  name?: string

  /**
   * Specify default arguments that can be populated by clients calling this method.
   *
   * A map of parameter names to the default argument source
   */
  defaultArguments?: Record<string, DefaultArgument<TContract>>
}

/**
 * Declares the decorated method as an abimethod that is called when the first transaction arg matches the method selector
 * @param config The config for this abi method
 * @typeParam TContract the type of the contract this method is a part of
 */
export function abimethod<TContract extends Contract>(config?: AbiMethodConfig<TContract>) {
  return function <TArgs extends DeliberateAny[], TReturn>(
    target: (this: TContract, ...args: TArgs) => TReturn,
    ctx: ClassMethodDecoratorContext<TContract>,
  ): (this: TContract, ...args: TArgs) => TReturn {
    throw new NoImplementation()
  }
}

/**
 * Configuration options for a bare method
 */
export type BareMethodConfig = {
  /**
   * Which on complete action(s) are allowed when invoking this method.
   * @default 'NoOp'
   */
  allowActions?: OnCompleteActionStr | OnCompleteActionStr[]
  /**
   * Whether this method should be callable when creating the application.
   * @default 'disallow'
   */
  onCreate?: CreateOptions
}

/**
 * Declares the decorated method as a baremethod that can only be called with no transaction args
 * @param config The config for this bare method
 * @typeParam TContract the type of the contract this method is a part of
 */
export function baremethod<TContract extends Contract>(config?: BareMethodConfig) {
  return function <TArgs extends DeliberateAny[], TReturn>(
    target: (this: TContract, ...args: TArgs) => TReturn,
    ctx: ClassMethodDecoratorContext<TContract>,
  ): (this: TContract, ...args: TArgs) => TReturn {
    throw new NoImplementation()
  }
}

/**
 * A type alias for a contract instance method
 */
type ContractMethod = (this: Contract, ...args: DeliberateAny[]) => DeliberateAny

/**
 * Returns the ARC4 method selector for a given ARC4 method signature. The method selector is the first
 * 4 bytes of the SHA512/256 hash of the method signature.
 * @param methodSignature An ARC4 method signature string ( Eg. `hello(string)string`.  Must be a compile time constant), or a contract method reference. (Eg. `MyContract.prototype.myMethod`)
 * @returns The ARC4 method selector. Eg. `02BECE11`
 */
export function methodSelector(methodSignature: string | ContractMethod): bytes {
  throw new NoImplementation()
}
