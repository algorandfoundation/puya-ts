import { expect, it, describe, afterEach } from 'vitest'
import { TestHarness } from '@algorandfoundation/algo-ts-testing'

describe('Calculator', () => {
  const harness = TestHarness.for(() => import('./contract.algo'))
  describe('when calling with with no args', () => {
    it('errors', async () => {
      const result = await harness.simulate([
        {
          sender: '',
          type: 'appl',
          args: [],
        },
      ])
      expect(result.returnValue).toBeInstanceOf(Error)
      if (result.returnValue instanceof Error) {
        expect(result.returnValue.message).toBe('Unknown operation')
      }
    })
  })
  describe('when calling with with no args', () => {
    it('Returns 1', async () => {
      const result = await harness.simulate([
        {
          sender: '',
          type: 'appl',
          args: [1, 2, 3],
        },
      ])
      const [left, right, outcome] = result.exportLogs('i', 'i', 's')

      expect(left).toBe(2n)
      expect(right).toBe(3n)
      expect(outcome).toBe('2 + 3 = 5')
      expect(result.returnValue).toBe(1n)
    })
  })
})
