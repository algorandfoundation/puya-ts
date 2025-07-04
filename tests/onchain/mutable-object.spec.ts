import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('mutable-object', () => {
  const test = createArc4TestFixture('tests/approvals/mutable-object.algo.ts', { MutableObjectDemo: {} })

  test('testVectorCreationAndEquality', async ({ appClientMutableObjectDemo }) => {
    await appClientMutableObjectDemo.send.call({ method: 'testVectorCreationAndEquality' })
  })
  test('add vectors', async ({ appClientMutableObjectDemo, expect }) => {
    const v1 = { x: 100, y: 100 }
    const v2 = { x: 50, y: 50 }
    const result = await appClientMutableObjectDemo.send.call({ method: 'addVectors', args: [v1, v2] })
    expect(result.return).toStrictEqual({ x: 150n, y: 150n })
  })
  test('implicit casting and spreading', async ({ appClientMutableObjectDemo }) => {
    const v1 = { x: 123, y: 456 }
    await appClientMutableObjectDemo.send.call({ method: 'implicitCastingAndSpreading', args: [v1] })
  })
  test('mutate vector', async ({ appClientMutableObjectDemo, expect }) => {
    const v1 = { x: 100, y: 100 }
    const result = await appClientMutableObjectDemo.send.call({ method: 'mutateVector', args: [v1, 50, 50] })
    expect(result.return).toStrictEqual({ x: 50n, y: 50n })
  })
  test('assert match', async ({ appClientMutableObjectDemo }) => {
    await appClientMutableObjectDemo.send.call({ method: 'testAssertMatch', args: [50] })
  })
  test('arc4 encoding', async ({ appClientMutableObjectDemo }) => {
    await appClientMutableObjectDemo.send.call({ method: 'testArc4Encoding', args: [{ y: 10, x: 20 }] })
  })
  test('assert match nested objects', async ({ appClientMutableObjectDemo }) => {
    await appClientMutableObjectDemo.send.call({ method: 'testNestedObjects', args: [{ v: { x: 1, y: 2 }, p: { x: 3, y: 4 } }] })
  })

  test('method selector', async ({ appClientMutableObjectDemo }) => {
    await appClientMutableObjectDemo.send.call({ method: 'testMethodSelector', args: [] })
  })
})
