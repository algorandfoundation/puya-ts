// Sometimes only an 'any' will do. Don't use this just to be lazy though
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type DeliberateAny = any
export type AnyFunction = (...args: DeliberateAny[]) => DeliberateAny
export type ConstructorFor<T, TArgs extends DeliberateAny[] = DeliberateAny[]> = new (...args: TArgs) => T
export type InstanceMethod<TClass, TArgs extends DeliberateAny[] = DeliberateAny[], TReturn = DeliberateAny> = (
  this: TClass,
  ...args: TArgs
) => TReturn
