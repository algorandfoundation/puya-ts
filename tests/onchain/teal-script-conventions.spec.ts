import algosdk from 'algosdk'
import { describe, expect } from 'vitest'
import { utf8ToUint8Array } from '../../src/util'
import { createArc4TestFixture } from './util/test-fixture'

describe('teal-script conventions', () => {
  const test = createArc4TestFixture({
    paths: 'tests/approvals/teal-script-conventions.algo.ts',
    contracts: {
      TealScriptConventionsAlgo: {},
    },
  })

  test('lifecycle methods are routed as expected', async ({ appFactoryTealScriptConventionsAlgo, testAccount }) => {
    const app = (await appFactoryTealScriptConventionsAlgo.send.create({ method: 'createApplication', args: [utf8ToUint8Array('Hello')] }))
      .appClient

    await app.send.optIn({ method: 'optInToApplication' })

    await app.send.call({ method: 'setLocal', args: ['bananas'] })

    const ls = await app.getLocalState(testAccount)

    expect(ls['local'].value).toBe('bananas')

    const res = await app.send.closeOut({ method: 'noMoreThanks', args: [34] })

    expect(res.return).toBe(34n)

    await expect(app.getLocalState(testAccount)).rejects.toThrow("Couldn't find local state")

    await app.send.bare.delete({})

    const app2 = (
      await appFactoryTealScriptConventionsAlgo.send.create({
        method: 'createApplication',
        args: [utf8ToUint8Array('Hello')],
        onComplete: algosdk.OnApplicationComplete.DeleteApplicationOC,
      })
    ).appClient

    await expect(app2.getGlobalState()).rejects.toThrow('application does not exist')
  })
})
