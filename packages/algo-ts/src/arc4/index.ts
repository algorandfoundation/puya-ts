import { BaseContract } from '../base-contract'
import { ctxMgr } from '../execution-context'
import { encodingUtil } from '../internal'
import { sha512_256 } from '../op'
import { Bytes, bytes, Uint64 } from '../primitives'
import { DeliberateAny } from '../typescript-helpers'

export * from './encoded-types'

export class Contract extends BaseContract {
  override approvalProgram(): boolean {
    return true
  }
}

export type CreateOptions = 'allow' | 'disallow' | 'require'
export type OnCompleteActionStr = 'NoOp' | 'OptIn' | 'ClearState' | 'CloseOut' | 'UpdateApplication' | 'DeleteApplication'

export enum OnCompleteAction {
  NoOp = Uint64(0),
  OptIn = Uint64(1),
  CloseOut = Uint64(2),
  ClearState = Uint64(3),
  UpdateApplication = Uint64(4),
  DeleteApplication = Uint64(5),
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
export function abimethod<TContract extends Contract>(config?: AbiMethodConfig<TContract>) {
  return function <TArgs extends DeliberateAny[], TReturn>(
    target: (this: TContract, ...args: TArgs) => TReturn,
    ctx: ClassMethodDecoratorContext<TContract>,
  ): (this: TContract, ...args: TArgs) => TReturn {
    ctx.addInitializer(function () {
      ctxMgr.instance.abiMetadata.captureMethodConfig(this, target.name, config)
    })
    return target
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
export function baremethod<TContract extends Contract>(config?: BareMethodConfig) {
  return function <TArgs extends DeliberateAny[], TReturn>(
    target: (this: TContract, ...args: TArgs) => TReturn,
    ctx: ClassMethodDecoratorContext<TContract>,
  ): (this: TContract, ...args: TArgs) => TReturn {
    ctx.addInitializer(function () {
      ctxMgr.instance.abiMetadata.captureMethodConfig(this, target.name, config)
    })
    return target
  }
}

/**
 * Returns the ARC4 method selector for a given ARC4 method signature. The method selector is the first
 * 4 bytes of the SHA512/256 hash of the method signature.
 * @param methodSignature An ARC4 method signature. Eg. `hello(string)string`. Must be a compile time constant.
 * @returns The ARC4 method selector. Eg. `02BECE11`
 */
export function methodSelector(methodSignature: string): bytes {
  return sha512_256(Bytes(encodingUtil.utf8ToUint8Array(methodSignature))).slice(0, 4)
}
