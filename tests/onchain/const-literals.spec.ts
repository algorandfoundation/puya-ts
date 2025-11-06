import { describe, expect } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('const literals', () => {
  const test = createArc4TestFixture({ paths: 'tests/approvals/const-literals.algo.ts', contracts: { ConstLiteralsAlgo: {} } })
  test('runs', async ({ appClientConstLiteralsAlgo }) => {
    const res1 = await appClientConstLiteralsAlgo.send.call({ method: 'test' })
    expect(res1.return).toBe(123n)
    const res2 = await appClientConstLiteralsAlgo.send.call({ method: 'test2' })
    expect(res2.return).toBe(4n)
    const res3 = await appClientConstLiteralsAlgo.send.call({ method: 'test3' })
    expect(res3.return).toBe(12n)
    const res4 = await appClientConstLiteralsAlgo.send.call({ method: 'test4' })
    expect(res4.return).toBe(2n ** 63n)
    const res5 = await appClientConstLiteralsAlgo.send.call({ method: 'test5' })
    expect(res5.return).toBe(2n ** 128n)
    const res6 = await appClientConstLiteralsAlgo.send.call({ method: 'test6' })
    expect(res6.return).toBe(2n ** 256n)
  })
})
