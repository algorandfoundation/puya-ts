export function maybeNodes<T>(condition: boolean, ...nodes: T[]): T[] {
  return condition ? nodes : []
}
