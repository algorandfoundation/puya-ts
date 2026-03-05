import { OnCompleteAction, Uint64 } from '@algorandfoundation/algorand-typescript'
import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { afterEach, describe, expect, it } from 'vitest'
import { MembershipRegistry } from './contract.algo'

describe('MembershipRegistry', () => {
  const ctx = new TestExecutionContext()
  afterEach(() => ctx.reset())

  function createAndInit() {
    const contract = ctx.contract.create(MembershipRegistry)
    contract.createApplication()
    return contract
  }

  function registerMember(contract: MembershipRegistry, member: ReturnType<typeof ctx.any.account>) {
    ctx.txn
      .createScope([
        ctx.any.txn.applicationCall({
          sender: member,
          onCompletion: OnCompleteAction.OptIn,
        }),
      ])
      .execute(() => {
        contract.register()
      })
  }

  it('createApplication initializes counters to 0', () => {
    const contract = createAndInit()
    expect(contract.totalMembers.value).toEqual(0n)
    expect(contract.totalRegistrations.value).toEqual(0n)
  })

  it('register sets local state and increments global counters', () => {
    const contract = createAndInit()
    const member = ctx.any.account()
    ctx.ledger.patchAccountData(member, { account: { balance: Uint64(200_000) } })

    registerMember(contract, member)

    expect(contract.totalMembers.value).toEqual(1n)
    expect(contract.totalRegistrations.value).toEqual(1n)
    expect(contract.joinedAtRound(member).value).toBeDefined()
    expect(contract.balanceAtJoin(member).value).toEqual(200_000n)
  })

  it('register increments counters for multiple members', () => {
    const contract = createAndInit()
    const member1 = ctx.any.account()
    const member2 = ctx.any.account()
    ctx.ledger.patchAccountData(member1, { account: { balance: Uint64(200_000) } })
    ctx.ledger.patchAccountData(member2, { account: { balance: Uint64(300_000) } })

    registerMember(contract, member1)
    registerMember(contract, member2)

    expect(contract.totalMembers.value).toEqual(2n)
    expect(contract.totalRegistrations.value).toEqual(2n)
    expect(contract.balanceAtJoin(member1).value).toEqual(200_000n)
    expect(contract.balanceAtJoin(member2).value).toEqual(300_000n)
  })

  it('deregister decrements totalMembers', () => {
    const contract = createAndInit()
    const member = ctx.any.account()
    ctx.ledger.patchAccountData(member, { account: { balance: Uint64(200_000) } })

    registerMember(contract, member)
    expect(contract.totalMembers.value).toEqual(1n)

    ctx.txn
      .createScope([
        ctx.any.txn.applicationCall({
          sender: member,
          onCompletion: OnCompleteAction.CloseOut,
        }),
      ])
      .execute(() => {
        contract.deregister()
      })

    expect(contract.totalMembers.value).toEqual(0n)
    // totalRegistrations is never decremented
    expect(contract.totalRegistrations.value).toEqual(1n)
  })

  it('getMemberInfo returns correct struct', () => {
    const contract = createAndInit()
    const member = ctx.any.account()
    ctx.ledger.patchAccountData(member, { account: { balance: Uint64(500_000), minBalance: Uint64(100_000) } })

    registerMember(contract, member)

    const info = contract.getMemberInfo(member)
    expect(info.joinedAtRound).toBeDefined()
    expect(info.balanceAtJoin).toEqual(500_000n)
    expect(info.currentBalance).toEqual(500_000n)
    expect(info.currentMinBalance).toEqual(100_000n)
  })

  it('isMemberInGoodStanding returns true for funded account', () => {
    const contract = createAndInit()
    const member = ctx.any.account()
    ctx.ledger.patchAccountData(member, { account: { balance: Uint64(200_000) } })

    expect(contract.isMemberInGoodStanding(member)).toBe(true)
  })

  it('isMemberInGoodStanding fails for underfunded account', () => {
    const contract = createAndInit()
    const member = ctx.any.account()
    ctx.ledger.patchAccountData(member, { account: { balance: Uint64(50_000) } })

    expect(() => contract.isMemberInGoodStanding(member)).toThrow()
  })

  it('register fails if balance below MIN_BALANCE_REQUIREMENT', () => {
    const contract = createAndInit()
    const member = ctx.any.account()
    ctx.ledger.patchAccountData(member, { account: { balance: Uint64(50_000) } })

    expect(() => {
      ctx.txn
        .createScope([
          ctx.any.txn.applicationCall({
            sender: member,
            onCompletion: OnCompleteAction.OptIn,
          }),
        ])
        .execute(() => {
          contract.register()
        })
    }).toThrow()
  })
})
