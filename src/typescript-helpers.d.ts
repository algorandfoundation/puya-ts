// Sometimes only an 'any' will do. Don't use this just to be lazy though
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type DeliberateAny = any
type AnyFunction = (...args: DeliberateAny[]) => DeliberateAny

type IsProperty<TKey extends keyof TObj, TObj> = TKey extends DeliberateAny ? (TObj[TKey] extends AnyFunction ? never : TKey) : never

export type Props<T> = Pick<T, IsProperty<keyof T, T>>

export type Tuple<T, N extends number> = N extends N ? (number extends N ? T[] : _TupleOf<T, N, []>) : never
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>
