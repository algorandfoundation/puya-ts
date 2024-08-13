import { AnyFunction, DeliberateAny } from '../typescript-helpers'
import { BaseContract } from '../base-contract'
export * from './encoded-types'

export class Contract extends BaseContract {
  override approvalProgram(): boolean {
    return true
  }
}

type CreateOptions = 'allow' | 'disallow' | 'require'
export type OnCompleteAction = 'NoOp' | 'OptIn' | 'CloseOut' | 'UpdateApplication' | 'DeleteApplication'

export type DefaultArgument<TContract extends Contract> = { constant: string | boolean | number | bigint } | { from: keyof TContract }
export type AbiMethodConfig<TContract extends Contract> = {
  /**
   * Which on complete action(s) are allowed when invoking this method.
   * @default 'NoOp'
   */
  allowActions?: OnCompleteAction | OnCompleteAction[]
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
export function abimethod<TContract extends Contract>(config?: AbiMethodConfig<TContract>) {
  return function <TArgs extends DeliberateAny[], TReturn>(
    target: (this: TContract, ...args: TArgs) => TReturn,
    ctx: ClassMethodDecoratorContext<TContract>,
  ): (this: TContract, ...args: TArgs) => TReturn {
    return target
  }
}

export type BareMethodConfig = {
  /**
   * Which on complete action(s) are allowed when invoking this method.
   * @default 'NoOp'
   */
  allowActions?: OnCompleteAction | OnCompleteAction[]
  /**
   * Whether this method should be callable when creating the application.
   * @default 'disallow'
   */
  onCreate?: CreateOptions
}
export function baremethod<TContract extends Contract>(config?: BareMethodConfig) {
  return function <TArgs extends DeliberateAny[], TReturn>(
    target: (this: TContract, ...args: TArgs) => TReturn,
    ctx: ClassMethodDecoratorContext<TContract>,
  ): (this: TContract, ...args: TArgs) => TReturn {
    return target
  }
}
