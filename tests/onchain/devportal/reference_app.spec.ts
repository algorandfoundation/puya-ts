import type { AppClient } from '@algorandfoundation/algokit-utils/app-client'
import type { AppFactory } from '@algorandfoundation/algokit-utils/app-factory'
import { algos } from '@algorandfoundation/algokit-utils'
import { describe, expect } from 'vitest'
import { createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/reference_app.
//
// ReferenceApp calls into a `Counter` app via an inner `abiCall` with fee: 0,
// so the outer call must carry the extra fee for that inner transaction.
const INNER_FEE = algos(0.001)

describe('devportal reference_app example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/reference_app/contract.algo.ts',
    contracts: { Counter: {}, ReferenceApp: {} },
  })

  let note = 0
  const uniqueNote = () => `reference-app-${note++}`

  // A fresh Counter callee for each test, mirroring the Python fixture that
  // deploys a new Counter per scenario.
  async function deployCounter(factory: AppFactory): Promise<AppClient> {
    const { appClient } = await factory.send.bare.create({ note: uniqueNote() })
    return appClient
  }

  // Deploy ReferenceApp with the TMPL_KNOWN_APP template variable filled, the
  // TS analogue of the Python `_deploy_reference` helper.
  async function deployReference(factory: AppFactory, knownAppId: bigint): Promise<AppClient> {
    const { appClient } = await factory.send.bare.create({
      deployTimeParams: { KNOWN_APP: knownAppId },
      note: uniqueNote(),
    })
    return appClient
  }

  test('the template-provided Counter is incremented by the no-arg variant', async ({ appFactoryCounter, appFactoryReferenceApp }) => {
    const counter = await deployCounter(appFactoryCounter)
    const reference = await deployReference(appFactoryReferenceApp, counter.appId)

    const increment = async () =>
      (
        await reference.send.call({
          method: 'incrementViaInner',
          extraFee: INNER_FEE,
          appReferences: [counter.appId],
          note: uniqueNote(),
        })
      ).return

    expect(await increment()).toBe(1n)
    expect(await increment()).toBe(2n)
  })

  test('a deleted known app id no longer resolves, so the inner call fails', async ({ appFactoryReferenceApp, localnet, testAccount }) => {
    // create then immediately delete an app so its id no longer resolves
    const alwaysApprove = '#pragma version 10\nint 1'
    const created = await localnet.algorand.send.appCreate({
      sender: testAccount.addr,
      approvalProgram: alwaysApprove,
      clearStateProgram: alwaysApprove,
      note: uniqueNote(),
    })
    const appId = created.appId
    await localnet.algorand.send.appDelete({ sender: testAccount.addr, appId, note: uniqueNote() })

    const reference = await deployReference(appFactoryReferenceApp, appId)

    await expect(
      reference.send.call({
        method: 'incrementViaInner',
        extraFee: INNER_FEE,
        appReferences: [appId],
        note: uniqueNote(),
      }),
    ).rejects.toThrow()
  })

  test('the with-arg variant increments the supplied Counter cumulatively', async ({ appFactoryCounter, appFactoryReferenceApp }) => {
    const counter = await deployCounter(appFactoryCounter)
    // the template value is irrelevant for the with-arg variant but must be
    // supplied to deploy
    const reference = await deployReference(appFactoryReferenceApp, counter.appId)

    const increment = async () =>
      (
        await reference.send.call({
          method: 'incrementViaInnerWithArg',
          args: [counter.appId],
          extraFee: INNER_FEE,
          note: uniqueNote(),
        })
      ).return

    expect(await increment()).toBe(1n)
    expect(await increment()).toBe(2n)
    expect(await increment()).toBe(3n)
  })

  test('the with-arg variant rejects an app that is not a Counter', async ({ appFactoryReferenceApp }) => {
    const reference = await deployReference(appFactoryReferenceApp, 0n)

    // pointing at an app that is not a Counter fails the inner abiCall dispatch
    await expect(
      reference.send.call({
        method: 'incrementViaInnerWithArg',
        args: [reference.appId],
        extraFee: INNER_FEE,
        note: uniqueNote(),
      }),
    ).rejects.toThrow()
  })
})
