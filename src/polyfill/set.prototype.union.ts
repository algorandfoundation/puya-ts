if (!Set.prototype.union) {
  Set.prototype.union = function union<T>(this: Set<T>, other: ReadonlySet<T>) {
    return new Set([...this, ...other])
  }
}
