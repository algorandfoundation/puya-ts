export function intersectSets<T>(...sets: Set<T>[]): Set<T> {
  return new Set<T>(sets.flatMap((s) => [...s]))
}
