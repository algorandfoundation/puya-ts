// Sometimes only an 'any' will do. Don't use this just to be lazy though
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type DeliberateAny = any
export type AnyFunction = (...args: DeliberateAny[]) => DeliberateAny
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

export type KeyIsFunction<TKey extends keyof TObj, TObj> = TKey extends DeliberateAny
  ? TObj[TKey] extends AnyFunction
    ? TKey
    : never
  : never
export type KeyIsNotFunction<TKey extends keyof TObj, TObj> = TKey extends DeliberateAny
  ? TObj[TKey] extends AnyFunction
    ? never
    : TKey
  : never
export type ObjectKeys<T> = KeyIsNotFunction<keyof T, T>
export type FunctionKeys<T> = KeyIsFunction<keyof T, T>
