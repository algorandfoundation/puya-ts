import { describe, expect } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('multi-inheritance', () => {
  const test = createArc4TestFixture('tests/approvals/multi-inheritance.algo.ts', {
    CommonBase: {},
    BaseOne: {},
    BaseTwo: {},
    MultiBases: {},
  })

  test('CommonBase has all state', async ({ appClientCommonBase, expect }) => {
    const state = await appClientCommonBase.state.global.getAll()

    expect(state).toStrictEqual({
      stateCommon: 123n,
    })
  })

  test('BaseOne has all state', async ({ appClientBaseOne, expect }) => {
    const state = await appClientBaseOne.state.global.getAll()

    expect(state).toStrictEqual({
      stateCommon: 123n,
      stateOne: 45n,
    })
  })

  test('BaseTwo has all state', async ({ appClientBaseTwo, expect }) => {
    const state = await appClientBaseTwo.state.global.getAll()

    expect(state).toStrictEqual({
      stateCommon: 123n,
      stateTwo: 'Hello',
    })
  })

  test('Multibase has all state', async ({ appClientMultiBases, expect }) => {
    const state = await appClientMultiBases.state.global.getAll()

    expect(state).toStrictEqual({
      stateCommon: 123n,
      stateMulti: 'Hmmm',
      stateOne: 45n,
      stateTwo: 'Hello',
    })
  })

  test('Multibase methods can all be called', async ({ appClientMultiBases, expect }) => {
    expect((await appClientMultiBases.send.call({ method: 'methodCommon' })).return).toEqual('common')
    expect((await appClientMultiBases.send.call({ method: 'methodOne' })).return).toEqual('base-one')
    expect((await appClientMultiBases.send.call({ method: 'methodTwo' })).return).toEqual('base-two')
    expect((await appClientMultiBases.send.call({ method: 'methodMulti' })).return).toEqual('multi-bases')
  })

  test('MRO is depth first', async ({ appClientMultiBases, expect }) => {
    expect((await appClientMultiBases.send.call({ method: 'b2CantOverride' })).return).toEqual('common')
  })

  test('super.class(...) can be used to target a specific base type', async ({ appClientMultiBases, expect }) => {
    expect((await appClientMultiBases.send.call({ method: 'callB2CantOverride' })).return).toEqual('base-two')
    expect((await appClientMultiBases.send.call({ method: 'callB2Common' })).return).toEqual('common')
  })
})

describe('multi-inheritance 2', () => {
  const test = createArc4TestFixture('tests/approvals/multi-inheritance-2.algo.ts', {
    StoreBoth: {},
  })

  test('Both base functions can be resolved', async ({ appClientStoreBoth }) => {
    await appClientStoreBoth.send.call({ method: 'test', args: ['abc', 123] })

    const state = await appClientStoreBoth.getGlobalState()

    expect(state.stringStore.value).toEqual('abc')
    expect(state.uint64Store.value).toEqual(123n)
  })
})
