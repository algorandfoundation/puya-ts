import { algos, microAlgos } from '@algorandfoundation/algokit-utils'
import { beforeEach, describe, expect } from 'vitest'
import { utf8ToUint8Array } from '../../../src/util'
import { createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/reference_box.
//
// Per-account counters are held in box storage. The app is funded with the
// base account MBR so it can hold box storage; the per-box MBR is funded by
// the grouped payment inside incrementBoxCounter. Each box a call touches
// must be declared in `boxReferences`.
//
// COUNTER_BOX_MBR: 2500 + (39 key + 8 value) * 400 = 21300
const EXPECTED_BOX_MBR = 2_500n + (7n + 32n + 8n) * 400n

// BoxMap(Account, ..., keyPrefix: 'counter') stores under
// b"counter" + <32-byte raw address>.
const counterBoxRef = (publicKey: Uint8Array) => new Uint8Array([...utf8ToUint8Array('counter'), ...publicKey])

describe('devportal reference_box example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/reference_box/contract.algo.ts',
    contracts: { ReferenceBox: { funding: microAlgos(100_000) } },
    // Each test deploys a fresh app + account, mirroring the Python per-test deploy.
    newScopeAt: beforeEach,
  })

  test('getBoxMbr quotes the compile-time constant', async ({ appClientReferenceBox }) => {
    // the MBR is a compile-time constant of the fixed box layout; the readonly
    // getter lets clients quote it instead of hard-coding the number
    const mbr = await appClientReferenceBox.send.call({ method: 'getBoxMbr' })
    expect(mbr.return).toBe(EXPECTED_BOX_MBR)
  })

  test('increment creates the box on first use and increments thereafter', async ({ appClientReferenceBox, algorand, testAccount }) => {
    const boxRef = counterBoxRef(testAccount.addr.publicKey)

    // counter starts unset -> reads back as 0
    const initial = await appClientReferenceBox.send.call({ method: 'getBoxCounter', boxReferences: [boxRef] })
    expect(initial.return).toBe(0n)

    let nonce = 0
    const increment = async () => {
      // grouped [Payment(MBR) -> AppCall]; the payment is the typed ABI arg
      const note = new Uint8Array([++nonce])
      const payMbr = algorand.createTransaction.payment({
        sender: testAccount.addr,
        receiver: appClientReferenceBox.appAddress,
        amount: microAlgos(EXPECTED_BOX_MBR),
        note,
      })
      const result = await appClientReferenceBox.send.call({
        method: 'incrementBoxCounter',
        args: [payMbr],
        boxReferences: [boxRef],
        note,
      })
      return result.return
    }

    expect(await increment()).toBe(1n)
    expect(await increment()).toBe(2n)
    expect(await increment()).toBe(3n)

    // the readonly getter agrees with the latest value
    const current = await appClientReferenceBox.send.call({ method: 'getBoxCounter', boxReferences: [boxRef] })
    expect(current.return).toBe(3n)
  })

  test('getBoxCounterForAccount looks up by explicit account argument', async ({
    appClientReferenceBox,
    algorand,
    testAccount,
    localnet,
  }) => {
    const boxRef = counterBoxRef(testAccount.addr.publicKey)

    const payMbr = algorand.createTransaction.payment({
      sender: testAccount.addr,
      receiver: appClientReferenceBox.appAddress,
      amount: microAlgos(EXPECTED_BOX_MBR),
    })
    await appClientReferenceBox.send.call({
      method: 'incrementBoxCounter',
      args: [payMbr],
      boxReferences: [boxRef],
    })

    // looked up by explicit account argument
    const value = await appClientReferenceBox.send.call({
      method: 'getBoxCounterForAccount',
      args: [testAccount.addr.toString()],
      boxReferences: [boxRef],
    })
    expect(value.return).toBe(1n)

    // an account that never incremented reads back as 0
    const other = await localnet.context.generateAccount({ initialFunds: algos(1) })
    const otherValue = await appClientReferenceBox.send.call({
      method: 'getBoxCounterForAccount',
      args: [other.addr.toString()],
      boxReferences: [counterBoxRef(other.addr.publicKey)],
    })
    expect(otherValue.return).toBe(0n)
  })

  test('the MBR payment is only required when the box is first created', async ({ appClientReferenceBox, algorand, testAccount }) => {
    const boxRef = counterBoxRef(testAccount.addr.publicKey)

    // first increment creates the box, so the payment must fund the MBR
    const payMbr = algorand.createTransaction.payment({
      sender: testAccount.addr,
      receiver: appClientReferenceBox.appAddress,
      amount: microAlgos(EXPECTED_BOX_MBR),
    })
    const first = await appClientReferenceBox.send.call({
      method: 'incrementBoxCounter',
      args: [payMbr],
      boxReferences: [boxRef],
    })
    expect(first.return).toBe(1n)

    // the box already exists, so a zero-amount payment is accepted
    const zeroPay = algorand.createTransaction.payment({
      sender: testAccount.addr,
      receiver: appClientReferenceBox.appAddress,
      amount: microAlgos(0),
      note: new Uint8Array([1]),
    })
    const second = await appClientReferenceBox.send.call({
      method: 'incrementBoxCounter',
      args: [zeroPay],
      boxReferences: [boxRef],
      note: new Uint8Array([1]),
    })
    expect(second.return).toBe(2n)
  })

  test('a payment that does not cover the box MBR is rejected', async ({ appClientReferenceBox, algorand, testAccount }) => {
    const boxRef = counterBoxRef(testAccount.addr.publicKey)

    // payment does not cover the box MBR
    const payMbr = algorand.createTransaction.payment({
      sender: testAccount.addr,
      receiver: appClientReferenceBox.appAddress,
      amount: microAlgos(EXPECTED_BOX_MBR - 1n),
    })
    await expect(
      appClientReferenceBox.send.call({
        method: 'incrementBoxCounter',
        args: [payMbr],
        boxReferences: [boxRef],
      }),
    ).rejects.toThrow('Payment must cover the box MBR')
  })

  test('a payment to the wrong receiver is rejected', async ({ appClientReferenceBox, algorand, testAccount }) => {
    const boxRef = counterBoxRef(testAccount.addr.publicKey)

    // payment goes to the caller instead of the contract
    const payMbr = algorand.createTransaction.payment({
      sender: testAccount.addr,
      receiver: testAccount.addr,
      amount: microAlgos(EXPECTED_BOX_MBR),
    })
    await expect(
      appClientReferenceBox.send.call({
        method: 'incrementBoxCounter',
        args: [payMbr],
        boxReferences: [boxRef],
      }),
    ).rejects.toThrow('Payment must be to the contract')
  })
})
