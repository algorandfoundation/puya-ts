import { describe } from 'vitest'
import { bigIntToUint8Array, invariant } from '../../src/util'
import { createArc4TestFixture, createBaseTestFixture } from './util/test-fixture'

describe('global state base', () => {
  const test = createBaseTestFixture('tests/approvals/global-state.algo.ts', ['TestContract'])

  test('test runs', async ({ TestContractInvoker, expect }) => {
    const result = await TestContractInvoker.send({
      schema: {
        globalInts: 3,
        globalByteSlices: 2,
      },
      args: [bigIntToUint8Array(123n, 8)],
    })
    const appId = result.confirmations[0].applicationIndex
    invariant(appId !== undefined, 'must have appId')
    const state = await TestContractInvoker.globalState(appId)

    expect(state['TESTSTATE'].value).toEqual(5n)
    expect(state['baseTestState'].value).toEqual('testing 123')
    expect(state['noInitialInt'].value).toEqual(144115188075855872n)
    expect(state['testState'].value).toEqual(123n)
    expect(state['noInitial'].value).toEqual('abc')
  })
})
describe('global state arc4', () => {
  const test = createArc4TestFixture('tests/approvals/global-state.algo.ts', { TestArc4: {} })

  test('arc4 runs', async ({ appClientTestArc4, expect }) => {
    await appClientTestArc4.send.call({ method: 'setState', args: ['key1', 123] })
    await appClientTestArc4.send.call({ method: 'setState', args: ['key2', 456] })
    await appClientTestArc4.send.call({ method: 'setState', args: ['key3', 789] })
    await appClientTestArc4.send.call({ method: 'setState', args: ['key4', 4] })
    await appClientTestArc4.send.call({ method: 'setState', args: ['key5', 5] })

    const state = await appClientTestArc4.getGlobalState()
    expect(state['key1'].value).toBe(123n)
    expect(state['key2'].value).toBe(456n)
    expect(state['key3'].value).toBe(789n)
    expect(state['key4'].value).toBe(4n)
    expect(state['key5'].value).toBe(5n)

    await expect(appClientTestArc4.send.call({ method: 'setState', args: ['key6', 6] })).rejects.toThrow(
      'store integer count 6 exceeds schema',
    )

    await appClientTestArc4.send.call({ method: 'deleteState', args: ['key5'] })
    await appClientTestArc4.send.call({ method: 'setState', args: ['key6', 6] })
  })
})
