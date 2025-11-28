/*
  Polyfills for Set methods that are not available on older versions of Node

  We only polyfill methods which are used in this codebase, polyfills should be removed as older
  versions of node are retired from LTS according to https://nodejs.org/en/about/previous-releases
*/

// Node < 22.11
if (!Set.prototype.union) {
  Set.prototype.union = function (other) {
    // Convert ReadonlySetLike to iterable by checking if it's a Set or has values method
    let otherIterable: Iterable<unknown>
    if (other instanceof Set) {
      otherIterable = other
    } else if ('values' in other && typeof other.values === 'function') {
      otherIterable = other.values()
    } else {
      throw new TypeError('Argument must be a ReadonlySetLike')
    }

    return new Set([...this, ...otherIterable])
  }
}

// Node < 22.11
if (!Set.prototype.intersection) {
  Set.prototype.intersection = function (other) {
    return new Set([...this].filter((e) => other.has(e)))
  }
}

// Node < 22.11
if (!Set.prototype.difference) {
  Set.prototype.difference = function (other) {
    return new Set([...this].filter((e) => !other.has(e)))
  }
}
// Node < 22.11
if (!Promise.withResolvers) {
  Promise.withResolvers = function <T>() {
    let resolve: PromiseWithResolvers<T>['resolve'] = undefined!,
      reject: PromiseWithResolvers<T>['reject'] = undefined!
    const promise = new Promise<T>((res, rej) => {
      resolve = res
      reject = rej
    })
    return { promise, resolve, reject }
  }
}

// Node < 22.11
const MapIteratorPrototype = Object.getPrototypeOf(new Map().entries())
if (!MapIteratorPrototype.map) {
  MapIteratorPrototype.map = function* <T, U>(
    this: IteratorObject<T>,
    callbackFn: (value: unknown, index: number) => U,
  ): IteratorObject<U, undefined, unknown> {
    let i = 0
    for (const item of this) {
      yield callbackFn(item, i++)
    }
  }
}
