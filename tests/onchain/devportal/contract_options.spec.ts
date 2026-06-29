import { describe, expect } from 'vitest'
import { createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/contract_options.
//
// These contracts demonstrate compile-time @contract options, so the tests
// assert the option is reflected in the compiled/deployed app and that a sample
// method still runs.
describe('devportal contract_options example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/contract_options/contract.algo.ts',
    contracts: {
      // ContractWithCustomName uses @contract({ name: 'OnChainName' }), so its
      // compiled app spec is published under 'OnChainName', not the class name.
      OnChainName: {},
      ContractWithStateReservation: {},
      ContractWithScratchReservation: {},
      ContractWithAvmVersion: {},
    },
  })

  // ContractWithCustomName -------------------------------------------------
  test('publishes the contract under its custom on-chain name', ({ appSpecOnChainName }) => {
    // The @contract({ name: 'OnChainName' }) option renames the contract; the
    // fixture even resolves the app spec by this name rather than the class name.
    expect(appSpecOnChainName.name).toBe('OnChainName')
  })

  test('custom-named contract runs its hello method', async ({ appClientOnChainName }) => {
    const result = await appClientOnChainName.send.call({ method: 'hello' })
    expect(result.return).toBe('hello')
  })

  // ContractWithStateReservation -------------------------------------------
  test('reserves the requested state totals', async ({ appClientContractWithStateReservation, algorand }) => {
    // The created app reserves the explicit stateTotals, not the two slots that
    // would be auto-computed from the `counter`/`label` state proxies.
    const info = await algorand.app.getById(appClientContractWithStateReservation.appId)
    expect(info.globalInts).toBe(16)
    expect(info.globalByteSlices).toBe(8)
    expect(info.localInts).toBe(4)
    expect(info.localByteSlices).toBe(0)
  })

  test('state-reservation contract increments its counter', async ({ appClientContractWithStateReservation }) => {
    // a distinct note keeps the two otherwise-identical increment txns unique
    const first = await appClientContractWithStateReservation.send.call({ method: 'increment', note: 'inc-1' })
    expect(first.return).toBe(1n)
    const second = await appClientContractWithStateReservation.send.call({ method: 'increment', note: 'inc-2' })
    expect(second.return).toBe(2n)
  })

  // ContractWithScratchReservation -----------------------------------------
  test('scratch-reservation contract echoes its argument', async ({ appClientContractWithScratchReservation }) => {
    const result = await appClientContractWithScratchReservation.send.call({ method: 'echo', args: [7] })
    expect(result.return).toBe(7n)
  })

  // ContractWithAvmVersion -------------------------------------------------
  test('callerPin reads the reject_version transaction field', async ({ appClientContractWithAvmVersion }) => {
    // an unpinned call reads rejectVersion == 0
    const unpinned = await appClientContractWithAvmVersion.send.call({ method: 'callerPin' })
    expect(unpinned.return).toBe(0n)

    // a call pinned to reject version 3 reads that value back (AVM 12 field)
    const pinned = await appClientContractWithAvmVersion.send.call({ method: 'callerPin', rejectVersion: 3 })
    expect(pinned.return).toBe(3n)
  })

  test('avm-version contract bytecode declares v12', async ({ appClientContractWithAvmVersion, algorand }) => {
    // the first byte of compiled AVM bytecode is the version declaration
    const info = await algorand.app.getById(appClientContractWithAvmVersion.appId)
    expect(info.approvalProgram[0]).toBe(12)
  })
})
