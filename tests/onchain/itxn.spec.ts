import { algos, microAlgos } from '@algorandfoundation/algokit-utils'
import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('itxn contract', () => {
  const test = createArc4TestFixture('tests/approvals/itxn.algo.ts', {
    ItxnDemoContract: { funding: algos(2) },
    ItxnReceiver: { funding: algos(1) },
  })

  test('test1 runs', async ({ appClientItxnDemoContract }) => {
    await appClientItxnDemoContract.send.call({ method: 'test1', extraFee: microAlgos(17_000) })
  })

  test('test2 runs', async ({ appClientItxnDemoContract }) => {
    await appClientItxnDemoContract.send.call({ method: 'test2', extraFee: microAlgos(17_000) })
  })

  test('test3 runs', async ({ appClientItxnDemoContract }) => {
    await appClientItxnDemoContract.send.call({ method: 'test3', extraFee: microAlgos(17_000) })
  })

  test('test4 runs', async ({ appClientItxnDemoContract }) => {
    await appClientItxnDemoContract.send.call({ method: 'test4', extraFee: microAlgos(17_000) })
  })
  test('test5 runs', async ({ appClientItxnDemoContract, appClientItxnReceiver }) => {
    await appClientItxnDemoContract.send.call({ method: 'test5', args: [appClientItxnReceiver.appId], extraFee: microAlgos(10_000) })
  })
})
