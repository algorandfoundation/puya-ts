import { AnyFunction, DeliberateAny } from '../typescript-helpers'

export * from './encoded-types'
const InternalSymbol = Symbol('Internal')
export class Arc4Contract {
  approvalProgram(): typeof InternalSymbol {
    return InternalSymbol
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
  return function (target: AnyFunction, ctx: ClassMethodDecoratorContext<Arc4Contract>) {}
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
  return function (target: () => DeliberateAny, ctx: ClassMethodDecoratorContext<Arc4Contract>) {}
}
