import { describe } from 'vitest'
import { createTestFixture } from './util/test-fixture'

describe('abi-decorators', () => {
  const test = createTestFixture('tests/approvals/abi-decorators.algo.ts', {
    AbiDecorators: { deployParams: { createParams: { method: 'createMethod' } } },
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
})
