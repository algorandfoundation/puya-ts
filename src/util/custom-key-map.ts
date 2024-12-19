import type { DeliberateAny } from '../typescript-helpers'

type Primitive = number | bigint | string | boolean

export abstract class CustomKeyMap<TKey, TValue> implements Map<TKey, TValue> {
  #keySerializer: (key: TKey) => Primitive
  #map = new Map<Primitive, [TKey, TValue]>()

  constructor(keySerializer: (key: TKey) => number | bigint | string) {
    this.#keySerializer = keySerializer
  }

  clear(): void {
    this.#map.clear()
  }
  delete(key: TKey): boolean {
    return this.#map.delete(this.#keySerializer(key))
  }
  forEach(callbackfn: (value: TValue, key: TKey, map: Map<TKey, TValue>) => void, thisArg?: DeliberateAny): void {
    for (const [key, value] of this.#map.values()) {
      callbackfn.call(thisArg ?? this, value, key, this)
    }
  }
  get(key: TKey): TValue | undefined {
    return this.#map.get(this.#keySerializer(key))?.[1]
  }
  has(key: TKey): boolean {
    return this.#map.has(this.#keySerializer(key))
  }
  set(key: TKey, value: TValue): this {
    this.#map.set(this.#keySerializer(key), [key, value])
    return this
  }
  get size(): number {
    return this.#map.size
  }
  entries(): MapIterator<[TKey, TValue]> {
    return this.#map.values()
  }
  *keys(): MapIterator<TKey> {
    for (const [key] of this.#map.values()) {
      yield key
    }
  }
  *values(): MapIterator<TValue> {
    for (const [, value] of this.#map.values()) {
      yield value
    }
  }
  [Symbol.iterator](): MapIterator<[TKey, TValue]> {
    return this.#map.values()
  }
  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }
}
