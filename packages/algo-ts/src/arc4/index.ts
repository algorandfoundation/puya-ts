import { AnyFunction, DeliberateAny } from '../typescript-helpers'
import { BaseContract } from '../base-contract'
export * from './encoded-types'

export class Contract extends BaseContract {
  override approvalProgram(): boolean {
    return true
  }

  override clearState(): boolean {
    return true
  }
}

type CreateOptions = 'allow' | 'disallow' | 'require'
export type OnCompleteAction = 'NoOp' | 'OptIn' | 'CloseOut' | 'UpdateApplication' | 'DeleteApplication'

export type AbiMethodConfig =
  | {
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
      readonly?: false
      /**
       * Override the name used to generate the abi method selector
       */
      name?: string
    }
  | {
      /**
       * Which on complete action(s) are allowed when invoking this method.
       * @default 'NoOp'
       */
      allowActions?: 'NoOp'
      /**
       * Whether this method should be callable when creating the application.
       * @default 'disallow'
       */
      onCreate?: CreateOptions
      /**
       * Does the method only perform read operations (no mutation of chain state)
       * @default false
       */
      readonly: true
      /**
       * Override the name used to generate the abi method selector
       */
      name?: string
    }
export function abimethod(config?: AbiMethodConfig) {
  return function (target: AnyFunction, ctx: ClassMethodDecoratorContext<Contract>) {}
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
export function baremethod(config?: BareMethodConfig) {
  return function (target: () => DeliberateAny, ctx: ClassMethodDecoratorContext<Contract>) {}
}
