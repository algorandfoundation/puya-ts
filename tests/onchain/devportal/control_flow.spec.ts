import { describe, expect } from 'vitest'
import { createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/control_flow.
describe('devportal control_flow example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/control_flow/contract.algo.ts',
    contracts: {
      IfElseExample: {},
      ForLoopsExample: {},
      MatchStatements: {},
      WhileLoopExample: {},
    },
  })

  describe('IfElseExample', () => {
    test('isRich classifies balances across every if/elif/else branch', async ({ appClientIfElseExample }) => {
      const isRich = async (balance: bigint) => (await appClientIfElseExample.send.call({ method: 'isRich', args: [balance] })).return

      // > 1000 -> rich; boundary 1000 falls through to the elif branch
      expect(await isRich(5000n)).toBe('This account is rich!')
      expect(await isRich(1001n)).toBe('This account is rich!')
      expect(await isRich(1000n)).toBe('This account is doing well.')
      // > 100 -> doing well; boundary 100 falls through to else
      expect(await isRich(500n)).toBe('This account is doing well.')
      expect(await isRich(101n)).toBe('This account is doing well.')
      expect(await isRich(100n)).toBe('This account is poor :(')
      expect(await isRich(0n)).toBe('This account is poor :(')
    })

    test('isEven returns Even/Odd via the ternary operator', async ({ appClientIfElseExample }) => {
      const isEven = async (number: bigint) => (await appClientIfElseExample.send.call({ method: 'isEven', args: [number] })).return

      expect(await isEven(0n)).toBe('Even')
      expect(await isEven(2n)).toBe('Even')
      expect(await isEven(10n)).toBe('Even')
      expect(await isEven(1n)).toBe('Odd')
      expect(await isEven(7n)).toBe('Odd')
    })
  })

  describe('ForLoopsExample', () => {
    test('forLoop builds a descending StaticArray and asserts the running sum', async ({ appClientForLoopsExample }) => {
      // index 0..3 assigns Uint64(3) - index => [3, 2, 1, 0]
      // and the second loop asserts 1 + 2 + 3 + 4 === 10
      const result = await appClientForLoopsExample.send.call({ method: 'forLoop', args: [] })
      expect(result.return).toStrictEqual([3, 2, 1, 0])
    })
  })

  describe('MatchStatements', () => {
    test('getDay maps each weekday index through the switch', async ({ appClientMatchStatements }) => {
      const expected = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      for (let i = 0; i < expected.length; i++) {
        const result = await appClientMatchStatements.send.call({ method: 'getDay', args: [BigInt(i)] })
        expect(result.return).toBe(expected[i])
      }
    })

    test('getDay falls through to the default branch for values outside 0..6', async ({ appClientMatchStatements }) => {
      expect((await appClientMatchStatements.send.call({ method: 'getDay', args: [7n] })).return).toBe('Invalid day')
      expect((await appClientMatchStatements.send.call({ method: 'getDay', args: [100n] })).return).toBe('Invalid day')
    })
  })

  describe('WhileLoopExample', () => {
    test('loop honours continue/break and returns the iteration count', async ({ appClientWhileLoopExample }) => {
      // num starts at 10: five single-step decrements while num > 5 (loopCount 5),
      // then 5 -> 3 (loopCount 6), then 3 -> 1 which breaks (loopCount 7).
      const result = await appClientWhileLoopExample.send.call({ method: 'loop', args: [] })
      expect(result.return).toBe(7n)
    })
  })
})
