export class DefaultMap<K, V> extends Map<K, V> {
  getOrDefault(key: K, defaultFactory: () => V): V {
    if (!super.has(key)) {
      super.set(key, defaultFactory())
    }
    return super.get(key)!
  }
}
