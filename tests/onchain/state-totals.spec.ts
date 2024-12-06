import { OnApplicationComplete } from 'algosdk'
import { describe, expect } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('State totals', () => {
  const test = createArc4TestFixture('tests/approvals/state-totals.algo.ts', {
    ExtendsSubWithTotals: {},
    BaseWithState: {},
    SubClassWithState: {},
    SubClassWithExplicitTotals: {},
  })

  test('BaseWithState has correct totals', ({ appSpecBaseWithState }) => {
    expect(appSpecBaseWithState.state.global.num_uints).toBe(2)
    expect(appSpecBaseWithState.state.local.num_byte_slices).toBe(1)
  })
  test('BaseWithState runs', async ({ appClientBaseWithState }) => {
    await appClientBaseWithState.send.call({ method: 'setState', args: [123] })

    const state = await appClientBaseWithState.getGlobalState()
    expect(state['oneGlobal'].value).toBe(123n)
    expect(state['twoGlobal'].value).toBe(123n)
  })
  test('SubClassWithState has correct totals', ({ appSpecSubClassWithState }) => {
    expect(appSpecSubClassWithState.state.global.num_uints).toBe(3)
    expect(appSpecSubClassWithState.state.local.num_byte_slices).toBe(2)
  })
  test('SubClassWithState runs', async ({ appClientSubClassWithState }) => {
    await appClientSubClassWithState.send.call({ method: 'setState', args: [456] })

    const state = await appClientSubClassWithState.getGlobalState()
    expect(state['oneGlobal'].value).toBe(456n)
    expect(state['twoGlobal'].value).toBe(456n)
    expect(state['threeGlobal'].value).toBe(456n)
  })
  test('SubClassWithExplicitTotals has correct totals', ({ appSpecSubClassWithExplicitTotals }) => {
    expect(appSpecSubClassWithExplicitTotals.state.global.num_uints).toBe(4)
    expect(appSpecSubClassWithExplicitTotals.state.global.num_byte_slices).toBe(0)
    expect(appSpecSubClassWithExplicitTotals.state.local.num_uints).toBe(0)
    expect(appSpecSubClassWithExplicitTotals.state.local.num_byte_slices).toBe(1)
  })
  test('ExtendsSubWithTotals has correct totals', ({ appSpecExtendsSubWithTotals }) => {
    expect(appSpecExtendsSubWithTotals.state.global.num_uints).toBe(2)
    expect(appSpecExtendsSubWithTotals.state.local.num_uints).toBe(1)
    expect(appSpecExtendsSubWithTotals.state.local.num_byte_slices).toBe(1)
  })
  test('ExtendsSubWithTotals runs', async ({ appClientExtendsSubWithTotals, testAccount }) => {
    await appClientExtendsSubWithTotals.send.call({ method: 'setState', args: [789], onComplete: OnApplicationComplete.OptInOC })

    const state = await appClientExtendsSubWithTotals.getGlobalState()
    expect(state['oneGlobal'].value).toBe(789n)
    expect(state['twoGlobal'].value).toBe(789n)
    const localState = await appClientExtendsSubWithTotals.getLocalState(testAccount)

    expect(localState['oneLocal'].value).toBe(789n)
  })
})
