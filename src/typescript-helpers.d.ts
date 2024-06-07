// Sometimes only an 'any' will do. Don't use this just to be lazy though
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type DeliberateAny = any
export type AnyFunction = (...args: DeliberateAny[]) => DeliberateAny

export type Expand<T> = T extends (...args: infer A) => infer R
  ? (...args: Expand<A>) => Expand<R>
  : T extends infer O
    ? { [K in keyof O]: O[K] }
    : never

type IsProperty<TKey extends keyof TObj, TObj> = TKey extends DeliberateAny ? (TObj[TKey] extends AnyFunction ? never : TKey) : never

export type Props<T> = Pick<T, IsProperty<keyof T, T>>

export type ReplaceTupleItemType<T extends [...unknown[]], TNew> = {
  [Index in keyof T]: TNew
} & { length: T['length'] }
