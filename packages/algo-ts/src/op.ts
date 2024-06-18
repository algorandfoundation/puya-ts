import { ctxMgr } from './execution-context'
import { OpsImplementation } from './op-types'
import { ArgumentsType } from 'vitest'
import { DeliberateAny } from './typescript-helpers'

type AnyFunction = (...args: DeliberateAny[]) => DeliberateAny

type KeyIsFunction<TKey extends keyof TObj, TObj> = TKey extends DeliberateAny ? (TObj[TKey] extends AnyFunction ? TKey : never) : never
type KeyIsNotFunction<TKey extends keyof TObj, TObj> = TKey extends DeliberateAny ? (TObj[TKey] extends AnyFunction ? never : TKey) : never
type ObjectKeys = KeyIsNotFunction<keyof OpsImplementation, OpsImplementation>
type FunctionKeys = KeyIsFunction<keyof OpsImplementation, OpsImplementation>

const createObjectProxy = <TName extends ObjectKeys>(name: TName) => {
  return new Proxy(
    {} as OpsImplementation[TName],
    {
      get<TProperty extends keyof OpsImplementation[TName]>(
        target: OpsImplementation[TName],
        property: TProperty,
      ): OpsImplementation[TName][TProperty] {
        return (ctxMgr.instance.ops as OpsImplementation)[name][property]
      },
    } as ProxyHandler<OpsImplementation[TName]>,
  )
}

const createFunctionProxy = <TName extends FunctionKeys>(name: TName) => {
  return (...args: ArgumentsType<OpsImplementation[TName]>): ReturnType<OpsImplementation[TName]> => {
    const implementation: AnyFunction = (ctxMgr.instance.ops as OpsImplementation)[name]
    return implementation(...args) as ReturnType<OpsImplementation[TName]>
  }
}

export const Txn = createObjectProxy('txn')
export const Global = createObjectProxy('global')
export const btoi = createFunctionProxy('btoi')
export const itob = createFunctionProxy('itob')
export const ed25519VerifyBare = createFunctionProxy('ed25519VerifyBare')
