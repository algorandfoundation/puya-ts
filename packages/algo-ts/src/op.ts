import { ctxMgr } from './execution-context'
import { OpsNamespace } from './op-types'
import { ArgumentsType } from 'vitest'
import { DeliberateAny } from './typescript-helpers'

type AnyFunction = (...args: DeliberateAny[]) => DeliberateAny

type KeyIsFunction<TKey extends keyof TObj, TObj> = TKey extends DeliberateAny ? (TObj[TKey] extends AnyFunction ? TKey : never) : never
type KeyIsNotFunction<TKey extends keyof TObj, TObj> = TKey extends DeliberateAny ? (TObj[TKey] extends AnyFunction ? never : TKey) : never
type ObjectKeys = KeyIsNotFunction<keyof OpsNamespace, OpsNamespace>
type FunctionKeys = KeyIsFunction<keyof OpsNamespace, OpsNamespace>

const createObjectProxy = <TName extends ObjectKeys>(name: TName) => {
  return new Proxy(
    {} as OpsNamespace[TName],
    {
      get<TProperty extends keyof OpsNamespace[TName]>(target: OpsNamespace[TName], property: TProperty): OpsNamespace[TName][TProperty] {
        return (ctxMgr.instance.ops as OpsNamespace)[name][property]
      },
    } as ProxyHandler<OpsNamespace[TName]>,
  )
}

const createFunctionProxy = <TName extends FunctionKeys>(name: TName) => {
  return (...args: ArgumentsType<OpsNamespace[TName]>): ReturnType<OpsNamespace[TName]> => {
    const implementation: AnyFunction = (ctxMgr.instance.ops as OpsNamespace)[name]
    return implementation(...args) as ReturnType<OpsNamespace[TName]>
  }
}

export const Txn = createObjectProxy('Txn')
export const Global = createObjectProxy('Global')
export const btoi = createFunctionProxy('btoi')
export const itob = createFunctionProxy('itob')
export const ed25519verifyBare = createFunctionProxy('ed25519verifyBare')
