import { AwstBuildContext } from '../context/awst-build-context'

export function maybeNodes<T>(condition: boolean, ...nodes: T[]): T[] {
  return condition ? nodes : []
}

export function visitInChildContext<TVisitorArgs extends unknown[], TVisitorResult>(
  Visitor: { new (...args: TVisitorArgs): { result: TVisitorResult } },
  ...args: TVisitorArgs
) {
  return AwstBuildContext.current.runInChildContext((deferred) => {
    const visitor = new Visitor(...args)
    return deferred(() => visitor.result)
  })
}
