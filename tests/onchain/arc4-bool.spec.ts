import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('arc4 bool', () => {
  const test = createArc4TestFixture({
    path: 'tests/approvals/arc4-bool.algo.ts',
    contracts: {
      Arc4BoolAlgo: {},
    },
  })

  test('it packs correctly', async ({ appClientArc4BoolAlgo }) => {
    await appClientArc4BoolAlgo.send.call({
      method: 'test',
      args: [
        {
          useRounds: true,
          lastValid: 0n,
          cooldown: 10n,
          lastCalled: 0n,
          exists: true,
          hasMethodRestrictions: false,
        },
      ],
    })
  })
})
