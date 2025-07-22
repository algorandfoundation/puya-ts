import { algos } from '@algorandfoundation/algokit-utils'
import { describe, expect } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('assignments', () => {
  const test = createArc4TestFixture('tests/approvals/assignments.algo.ts', { AssignmentsAlgo: {} })

  test('testPrimitives', async ({ appClientAssignmentsAlgo }) => {
    await appClientAssignmentsAlgo.send.call({ method: 'testPrimitives', args: [123] })
  })

  test('testAccountDestructure', async ({ appClientAssignmentsAlgo }) => {
    await appClientAssignmentsAlgo.fundAppAccount({ amount: algos(1) })
    const result = await appClientAssignmentsAlgo.send.call({ method: 'testAccountDestructure', args: [] })
    expect(result.return).toEqual({ balance: 1000000n, minBalance: 100000n })
  })

  test('testArrayDestructure', async ({ appClientAssignmentsAlgo }) => {
    await appClientAssignmentsAlgo.send.call({ method: 'testArrayDestructure', args: [[1, 2, 3], 4, [5, 6, 7]] })
  })
  test('testArrayNarrowing', async ({ appClientAssignmentsAlgo }) => {
    await appClientAssignmentsAlgo.send.call({ method: 'testArrayNarrowing', args: [[1, 2, 3], 4] })
  })
  test('testTupleToArray', async ({ appClientAssignmentsAlgo }) => {
    await appClientAssignmentsAlgo.send.call({
      method: 'testTupleToArray',
      args: [
        [1, 2],
        [3, 4],
      ],
    })
  })
  test('testNested', async ({ appClientAssignmentsAlgo }) => {
    await appClientAssignmentsAlgo.send.call({
      method: 'testNested',
      args: [
        [
          [1, 2, 3],
          [1, 2, 3],
        ],
      ],
    })
  })
  test('testDestructureObj', async ({ appClientAssignmentsAlgo }) => {
    await appClientAssignmentsAlgo.send.call({
      method: 'testDestructureObj',
      args: [
        { a: 123, b: 'hello' },
        { a: 456, b: 'world' },
      ],
    })
  })
  test('testObjLiteralNarrowing', async ({ appClientAssignmentsAlgo }) => {
    await appClientAssignmentsAlgo.send.call({ method: 'testObjLiteralNarrowing', args: [1, 2] })
  })
  test('testMixed', async ({ appClientAssignmentsAlgo }) => {
    await appClientAssignmentsAlgo.send.call({ method: 'testMixed', args: [[[[1]]]] })
  })
})
