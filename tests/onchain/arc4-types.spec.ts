import { describe } from 'vitest'
import { createArc4TestFixture, createBaseTestFixture } from './util/test-fixture'

describe('arc4-types', () => {
  const test = createBaseTestFixture('tests/approvals/arc4-types.algo.ts', ['Arc4TypesTestContract'])

  test('runs', async ({ Arc4TypesTestContractInvoker }) => {
    await Arc4TypesTestContractInvoker.send()
  })
})

describe('arc4-struct', () => {
  const test = createArc4TestFixture('tests/approvals/arc4-struct.algo.ts', { StructDemo: {} })

  test('testVectorCreationAndEquality', async ({ appClientStructDemo }) => {
    await appClientStructDemo.send.call({ method: 'testVectorCreationAndEquality' })
  })
  test('add vectors', async ({ appClientStructDemo, expect }) => {
    const v1 = { x: 100, y: 100 }
    const v2 = { x: 50, y: 50 }
    const result = await appClientStructDemo.send.call({ method: 'addVectors', args: [v1, v2] })
    expect(result.return).toStrictEqual({ x: 150n, y: 150n })
  })
  test('implicit casting and spreading', async ({ appClientStructDemo, expect }) => {
    const v1 = { x: 123, y: 456 }
    await appClientStructDemo.send.call({ method: 'implicitCastingAndSpreading', args: [v1] })
  })
})
