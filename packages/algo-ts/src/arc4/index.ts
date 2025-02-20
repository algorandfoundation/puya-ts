import { BaseContract } from '../base-contract'
import { NoImplementation } from '../internal/errors'
import { DeliberateAny } from '../internal/typescript-helpers'
import { bytes } from '../primitives'

export * from './encoded-types'

export class Contract extends BaseContract {
  override approvalProgram(): boolean {
    return true
  }
}

export type CreateOptions = 'allow' | 'disallow' | 'require'
export type OnCompleteActionStr = 'NoOp' | 'OptIn' | 'ClearState' | 'CloseOut' | 'UpdateApplication' | 'DeleteApplication'

export enum OnCompleteAction {
  NoOp = 0,
  OptIn = 1,
  CloseOut = 2,
  ClearState = 3,
  UpdateApplication = 4,
  DeleteApplication = 5,
}

export type DefaultArgument<TContract extends Contract> = { constant: string | boolean | number | bigint } | { from: keyof TContract }

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

  defaultArguments?: Record<string, DefaultArgument<TContract>>
}

/**
 * Declares the decorated method as an abimethod that is called when the first transaction arg matches the method selector
 * @param config
 */
export function abimethod<TContract extends Contract>(config?: AbiMethodConfig<TContract>) {
  return function <TArgs extends DeliberateAny[], TReturn>(
    target: (this: TContract, ...args: TArgs) => TReturn,
    ctx: ClassMethodDecoratorContext<TContract>,
  ): (this: TContract, ...args: TArgs) => TReturn {
    throw new NoImplementation()
  }
}

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
 * @param config
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
 * Returns the ARC4 method selector for a given ARC4 method signature. The method selector is the first
 * 4 bytes of the SHA512/256 hash of the method signature.
 * @param methodSignature An ARC4 method signature. Eg. `hello(string)string`. Must be a compile time constant.
 * @returns The ARC4 method selector. Eg. `02BECE11`
 */
export function methodSelector<
  TMethod extends (this: TContract, ...args: TArgs) => TReturn,
  TContract extends Contract,
  TArgs extends DeliberateAny[],
  TReturn,
>(methodSignature: string | TMethod): bytes {
  throw new NoImplementation()
}
