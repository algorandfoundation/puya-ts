import { algo, microAlgos } from '@algorandfoundation/algokit-utils'
import { describe, expect } from 'vitest'
import { createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/arc4_client.
// HelloWorldClient is an abstract client "protocol" whose `err('stub only')` bodies exist only
// to give arc4.abiCall a typed method reference; it emits no app spec. The tests deploy the
// concrete HelloWorld (and a chatty variant that emits an extra log) as the target app.
// call_hello / call_add each issue one inner ApplicationCall with fee: 0, so each outer call
// passes an extraFee to cover the inner transaction fee.
describe('devportal arc4_client example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/arc4_client/contract.algo.ts',
    contracts: {
      HelloWorld: {},
      ChattyHelloWorld: {},
      ClientConsumer: { funding: algo(1) },
    },
  })

  const innerFee = microAlgos(1000n)

  test('callHello routes to the target app', async ({ appClientClientConsumer, appClientHelloWorld }) => {
    const result = await appClientClientConsumer.send.call({
      method: 'callHello',
      args: [appClientHelloWorld.appId, 'Algorand'],
      extraFee: innerFee,
    })
    expect(result.return).toBe('Hello, Algorand')
  })

  test('callAdd routes to the target and checks logs', async ({ appClientClientConsumer, appClientHelloWorld }) => {
    // add(7, 35) == 42; the contract also asserts the inner txn emitted exactly one log
    // (the ABI return log).
    const result = await appClientClientConsumer.send.call({
      method: 'callAdd',
      args: [appClientHelloWorld.appId, 7, 35],
      extraFee: innerFee,
    })
    expect(result.return).toBe(42n)
  })

  test('callAdd with zero operands', async ({ appClientClientConsumer, appClientHelloWorld }) => {
    const result = await appClientClientConsumer.send.call({
      method: 'callAdd',
      args: [appClientHelloWorld.appId, 0, 0],
      extraFee: innerFee,
    })
    expect(result.return).toBe(0n)
  })

  test('callAdd rejects a target with extra logs', async ({ appClientClientConsumer, appClientChattyHelloWorld }) => {
    // the target emits 2 logs, so the consumer's numLogs assertion fails
    await expect(
      appClientClientConsumer.send.call({
        method: 'callAdd',
        args: [appClientChattyHelloWorld.appId, 1, 2],
        extraFee: innerFee,
      }),
    ).rejects.toThrow(/only the return log was emitted/)
  })

  test('callHello against a missing app fails', async ({ appClientClientConsumer }) => {
    // An app id that does not exist on chain cannot be invoked.
    await expect(
      appClientClientConsumer.send.call({
        method: 'callHello',
        args: [99_999_999n, 'nobody'],
        extraFee: innerFee,
      }),
    ).rejects.toThrow()
  })
})
