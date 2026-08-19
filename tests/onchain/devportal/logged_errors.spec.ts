import { beforeEach, describe, expect } from 'vitest'
import { createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/logged_errors.
//
// `newScopeAt: beforeEach` gives every test a freshly deployed app so the
// GlobalState balance starts at 0 and the deposit/withdraw assertions are
// independent of test ordering.
describe('devportal logged_errors example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/logged_errors/contract.algo.ts',
    contracts: { LoggedErrors: {} },
    newScopeAt: beforeEach,
  })

  test('deposit and withdraw accumulate and reduce the balance', async ({ appClientLoggedErrors }) => {
    // `balance` is global state, starting at 0 and updated by each call
    const deposit100 = await appClientLoggedErrors.send.call({ method: 'deposit', args: [100n] })
    expect(deposit100.return).toBe(100n)

    const deposit50 = await appClientLoggedErrors.send.call({ method: 'deposit', args: [50n] })
    expect(deposit50.return).toBe(150n)

    const withdraw30 = await appClientLoggedErrors.send.call({ method: 'withdraw', args: [30n] })
    expect(withdraw30.return).toBe(120n)

    const withdraw120 = await appClientLoggedErrors.send.call({ method: 'withdraw', args: [120n] })
    expect(withdraw120.return).toBe(0n)
  })

  test('withdrawing zero is rejected with amountError01', async ({ appClientLoggedErrors }) => {
    // loggedAssert(amount > 0, 'amountError01', { message: 'amount must be positive', desc })
    // still logs `ERR:amountError01:amount must be positive` on-chain, but because this
    // assert carries a `desc`, the typed client surfaces that plain description (the ARC-56
    // errorMessage) rather than the ARC-65 log line. The reject tests below exercise the
    // `ERR:{code}:{message}` surfacing for asserts without a desc.
    await expect(appClientLoggedErrors.send.call({ method: 'withdraw', args: [0n] })).rejects.toThrow(
      'Withdrawal amount must be greater than zero',
    )
  })

  test('withdrawing more than the balance is rejected with amountError02', async ({ appClientLoggedErrors }) => {
    await appClientLoggedErrors.send.call({ method: 'deposit', args: [10n] })

    // loggedAssert(amount <= balance, ...) -> ERR:amountError02:insufficient balance
    await expect(appClientLoggedErrors.send.call({ method: 'withdraw', args: [50n] })).rejects.toThrow(
      'ERR:amountError02:insufficient balance',
    )
  })

  test('desc lands in the ARC-56 source info', async ({ appSpecLoggedErrors }) => {
    // `desc` does not change the on-chain logged output (covered above), but
    // becomes the plain-language errorMessage in the ARC-56 source info that
    // typed clients surface for the failing program counter
    const sourceInfo = appSpecLoggedErrors.sourceInfo
    expect(sourceInfo).not.toBeUndefined()
    const messages = sourceInfo!.approval.sourceInfo.map((e) => e.errorMessage).filter((m): m is string => Boolean(m))
    expect(messages).toContain('Withdrawal amount must be greater than zero')
  })

  test('reject returns codes within range unchanged', async ({ appClientLoggedErrors }) => {
    const result = await appClientLoggedErrors.send.call({ method: 'reject', args: [42n] })
    expect(result.return).toBe(42n)
  })

  test('reject logs out-of-range codes', async ({ appClientLoggedErrors }) => {
    // loggedErr for the reserved zero code
    await expect(appClientLoggedErrors.send.call({ method: 'reject', args: [0n] })).rejects.toThrow('ERR:codeRange00:code zero is reserved')

    // loggedErr for codes above the permitted range
    await expect(appClientLoggedErrors.send.call({ method: 'reject', args: [150n] })).rejects.toThrow('ERR:codeRange01:code out of range')
  })

  test('reject accepts the boundary code but rejects the next one', async ({ appClientLoggedErrors }) => {
    // 100 is the highest accepted code; 101 is the first rejected one
    const boundary = await appClientLoggedErrors.send.call({ method: 'reject', args: [100n] })
    expect(boundary.return).toBe(100n)

    await expect(appClientLoggedErrors.send.call({ method: 'reject', args: [101n] })).rejects.toThrow('ERR:codeRange01:code out of range')
  })
})
