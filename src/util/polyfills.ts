// Polyfills for Set methods that are not available on older versions of Node

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

if (!Set.prototype.intersection) {
  Set.prototype.intersection = function (other) {
    return new Set([...this].filter((e) => other.has(e)))
  }
}

if (!Set.prototype.difference) {
  Set.prototype.difference = function (other) {
    return new Set([...this].filter((e) => !other.has(e)))
  }
}

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
