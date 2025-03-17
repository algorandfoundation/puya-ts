import { describe } from 'vitest'
import { createBaseTestFixture } from './util/test-fixture'

describe('reserve scratch', () => {
  const test = createBaseTestFixture('tests/approvals/reserve-scratch.algo.ts', ['ReserveScratchAlgo', 'SubReserveScratchAlgo'])

  test('ReserveScratchAlgo works', async ({ ReserveScratchAlgoInvoker }) => {
    await ReserveScratchAlgoInvoker.send()
  })
  test('SubReserveScratchAlgo works', async ({ SubReserveScratchAlgoInvoker }) => {
    await SubReserveScratchAlgoInvoker.send()
  })
})
