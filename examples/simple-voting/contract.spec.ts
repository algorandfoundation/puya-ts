import type { Account, uint64 } from '@algorandfoundation/algo-ts'
import { Bytes, Uint64 } from '@algorandfoundation/algo-ts'
import { TestExecutionContext } from '@algorandfoundation/algo-ts-testing'
import { afterEach, describe, expect, it } from 'vitest'
import SimpleVotingContract from './contract.algo'

describe('Simple voting contract', () => {
  const ctx = new TestExecutionContext()
  afterEach(() => {
    ctx.reset()
  })
  describe('When setting the topic', () => {
    describe('with correct arguments', () => {
      it('should set the topic', async () => {
        const contract = ctx.contract.create(SimpleVotingContract)
        const topic = Bytes('new_topic')

        const result = ctx.txn
          .createScope(
            [
              ctx.any.txn.applicationCall({
                appId: ctx.ledger.getApplicationForContract(contract),
                appArgs: [Bytes('set_topic'), topic],
              }),
              ctx.any.txn.payment({
                amount: Uint64(10_000),
              }),
            ],
            0,
          )
          .execute(contract.approvalProgram)

        expect(result).toEqual(Uint64(1))
        expect(contract.topic.value.toString()).toBe(topic.toString())
      })
    })
  })
  describe('When voting', () => {
    it('records the vote correctly', async () => {
      const contract = ctx.contract.create(SimpleVotingContract)
      contract.votes.value = Uint64(0)
      const voter = ctx.defaultSender

      const result = castVote(ctx, contract, voter)

      expect(result).toEqual(Uint64(1))
      expect(contract.votes.value).toEqual(Uint64(1))
      expect(contract.voted(voter).value).toEqual(Uint64(1))
    })
    it('ignores subsequent votes from the same voter', async () => {
      const contract = ctx.contract.create(SimpleVotingContract)
      const voter = ctx.any.account()
      contract.voted(voter).value = Uint64(1)
      contract.votes.value = Uint64(1)

      const result = castVote(ctx, contract, voter)

      expect(result).toEqual(Uint64(0))
      expect(contract.votes.value).toEqual(Uint64(1))
      expect(contract.voted(voter).value).toEqual(Uint64(1))
    })
  })
  describe('When getting the votes', () => {
    it('returns the correct number of votes', async () => {
      const contract = ctx.contract.create(SimpleVotingContract)
      const voter1 = ctx.any.account()
      const voter2 = ctx.any.account()
      castVote(ctx, contract, voter1)
      castVote(ctx, contract, voter2)

      const result = ctx.txn
        .createScope(
          [
            ctx.any.txn.applicationCall({
              appId: ctx.ledger.getApplicationForContract(contract),
              appArgs: [Bytes('get_votes')],
            }),
            ctx.any.txn.payment({
              amount: Uint64(10_000),
            }),
          ],
          0,
        )
        .execute(contract.approvalProgram)

      expect(result).toEqual(Uint64(2))
    })
  })
})

const castVote = (ctx: TestExecutionContext, contract: SimpleVotingContract, voter: Account): uint64 =>
  ctx.txn
    .createScope(
      [
        ctx.any.txn.applicationCall({
          appId: ctx.ledger.getApplicationForContract(contract),
          sender: voter,
          appArgs: [Bytes('vote'), voter.bytes],
        }),
        ctx.any.txn.payment({
          sender: voter,
          amount: Uint64(10_000),
        }),
      ],
      0,
    )
    .execute(contract.approvalProgram)
