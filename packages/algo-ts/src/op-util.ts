import { ctxMgr } from './execution-context'
import { OpsNamespace } from './op-types'
import { AnyFunction, DeliberateAny } from './typescript-helpers'

type KeyIsFunction<TKey extends keyof TObj, TObj> = TKey extends DeliberateAny ? (TObj[TKey] extends AnyFunction ? TKey : never) : never
type KeyIsNotFunction<TKey extends keyof TObj, TObj> = TKey extends DeliberateAny ? (TObj[TKey] extends AnyFunction ? never : TKey) : never
type ObjectKeys = KeyIsNotFunction<keyof OpsNamespace, OpsNamespace>
type FunctionKeys = KeyIsFunction<keyof OpsNamespace, OpsNamespace>

export const createFunctionProxy = <TName extends FunctionKeys>(name: TName) => {
  return (...args: Parameters<OpsNamespace[TName]>): ReturnType<OpsNamespace[TName]> => {
    const implementation: AnyFunction = (ctxMgr.instance.op as OpsNamespace)[name] as OpsNamespace[TName]
    return implementation(...args) as ReturnType<OpsNamespace[TName]>
  }
}

export const createObjectProxy = <TName extends ObjectKeys>(name: TName) => {
  return new Proxy(
    {} as OpsNamespace[TName],
    {
      get<TProperty extends keyof OpsNamespace[TName]>(_target: OpsNamespace[TName], property: TProperty): OpsNamespace[TName][TProperty] {
        return Reflect.get(ctxMgr.instance.op[name]!, property)
      },
    } as ProxyHandler<OpsNamespace[TName]>,
  )
}
