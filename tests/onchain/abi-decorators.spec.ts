import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('abi-decorators', () => {
  const test = createArc4TestFixture('tests/approvals/abi-decorators.algo.ts', {
    AbiDecorators: { deployParams: { createParams: { method: 'createMethod' } } },
    OverloadedMethods: {},
  })
  test('can be created', async ({ appFactoryAbiDecorators }) => {
    await appFactoryAbiDecorators.send.create({ method: 'createMethod' })
  })
  test('methods can be called', async ({ appClientAbiDecorators: appClient, expect }) => {
    await appClient.send.call({ method: 'justNoop' })
    await appClient.send.call({ method: 'allActions', onComplete: 1 })
    const { return: returnValue } = await appClient.send.call({ method: 'overrideReadonlyName' })
    expect(returnValue).toBe(5n)
  })

  test('overloaded methods can be called', async ({ appClientOverloadedMethods, expect }) => {
    const { return: retVal1 } = await appClientOverloadedMethods.send.call({ method: 'doThing(uint64)uint64', args: [100] })
    const { return: retVal2 } = await appClientOverloadedMethods.send.call({ method: 'doThing(uint64,uint64)uint64', args: [100, 200] })
    expect(retVal1).toBe(100n)
    expect(retVal2).toBe(200n * 100n)
  })
})
