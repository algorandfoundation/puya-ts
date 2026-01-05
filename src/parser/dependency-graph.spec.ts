import { describe, expect, it } from 'vitest'
import { DependencyGraph } from './dependency-graph'

describe('dependency graph', () => {
  const graph = new DependencyGraph()

  graph.addEdges('a', ['b'])
  graph.addEdges('b', ['c', 'd'])
  graph.addEdges('c', ['d'])

  graph.addEdges('x', ['y'])
  graph.addEdges('y', ['x'])

  it('deps for a should be a', () => {
    const deps = graph.getDependants(['a'])
    expect(deps).all.members(['a'])
  })
  it('deps for b should be a, b', () => {
    const deps = graph.getDependants(['b'])
    expect(deps).all.members(['a', 'b'])
  })
  it('deps for c should be a, b, c', () => {
    const deps = graph.getDependants(['c'])
    expect(deps).all.members(['a', 'b', 'c'])
  })
  it('deps for d should be a, b, c, d', () => {
    const deps = graph.getDependants(['d'])
    expect(deps).all.members(['a', 'b', 'c', 'd'])
  })
  it('deps for x should be x, y', () => {
    const deps = graph.getDependants(['x'])
    expect(deps).all.members(['x', 'y'])
  })
  it('deps for y should be x, y', () => {
    const deps = graph.getDependants(['y'])
    expect(deps).all.members(['x', 'y'])
  })
})
