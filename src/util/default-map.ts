export function defaultRecord<TKey extends PropertyKey, TValue>(defaultInit: (key: TKey) => TValue) {
  return new Proxy({} as Record<TKey, TValue>, {
    get(target, property, receiver) {
      if (!(property in target)) {
        Object.assign(target, { [property]: defaultInit(property as TKey) })
      }
      return Reflect.get(target, property, receiver)
    },
  })
}
