import { describe, expect, it } from 'vitest'
import { TestHarness } from '@algorandfoundation/algo-ts-testing'

describe('When calling the HelloWorldContract', () => {
  const harness = TestHarness.for(() => import('./contract.algo'))
  describe("with ['world']", () => {
    it('logs Hello, World', async () => {
      const result = await harness.simulate([
        {
          sender: '',
          type: 'appl',
          args: ['World'],
        },
      ])
      expect(result.exportLogs('s')).toStrictEqual(['Hello, World'])
      expect(result.returnValue).toBe(1n)
    })
  })
})
