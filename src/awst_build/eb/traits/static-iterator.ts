import type { InstanceBuilder, NodeBuilder } from '../index'

export const StaticIterator = Symbol('StaticIterator')

export interface StaticallyIterable {
  [StaticIterator](): InstanceBuilder[]
}

export function isStaticallyIterable<T extends NodeBuilder>(builder: T): builder is T & StaticallyIterable {
  return StaticIterator in builder
}
