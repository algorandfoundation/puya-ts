import type { Account, uint64 } from '@algorandfoundation/algo-ts'
import { Bytes, Uint64 } from '@algorandfoundation/algo-ts'
import type { TestExecutionContext } from '@algorandfoundation/algo-ts-testing'
import { describe, expect, it } from 'vitest'
import type { AlgorandTestContext } from '../../vitest.setup'
import SimpleVotingContract from './contract.algo'

describe('Simple voting contract', () => {
  describe('When setting the topic', () => {
    describe('with correct arguments', () => {
      it('should set the topic', async ({ ctx }: AlgorandTestContext) => {
        const contract = ctx.create(SimpleVotingContract)
        const topic = Bytes('new_topic')
        ctx.setTransactionGroup(
          [
            ctx.anyApplicationCallTransaction({
              app_id: ctx.getApplicationForContract(contract),
              args: [Bytes('set_topic'), topic],
            }),
            ctx.anyPaymentTransaction({
              amount: Uint64(10_000),
            }),
          ],
          0,
        )

        const result = contract.approvalProgram()
        expect(result).toEqual(Uint64(1))
        expect(contract.topic.value.toString()).toBe(topic.toString())
      })
    })
  })
  describe('When voting', () => {
    it('records the vote correctly', async ({ ctx }: AlgorandTestContext) => {
      const contract = ctx.create(SimpleVotingContract)
      contract.votes.value = Uint64(0)
      const voter = ctx.defaultCreator

      const result = castVote(ctx, contract, voter)

      expect(result).toEqual(Uint64(1))
      expect(contract.votes.value).toEqual(Uint64(1))
      expect(contract.voted(voter).value).toEqual(Uint64(1))
    })
    it('ignores subsequent votes from the same voter', async ({ ctx }: AlgorandTestContext) => {
      const contract = ctx.create(SimpleVotingContract)
      const voter = ctx.anyAccount()
      contract.voted(voter).value = Uint64(1)
      contract.votes.value = Uint64(1)

      const result = castVote(ctx, contract, voter)

      expect(result).toEqual(Uint64(0))
      expect(contract.votes.value).toEqual(Uint64(1))
      expect(contract.voted(voter).value).toEqual(Uint64(1))
    })
  })
  describe('When getting the votes', () => {
    it('returns the correct number of votes', async ({ ctx }: AlgorandTestContext) => {
      const contract = ctx.create(SimpleVotingContract)
      const voter1 = ctx.anyAccount()
      const voter2 = ctx.anyAccount()
      castVote(ctx, contract, voter1)
      castVote(ctx, contract, voter2)

      ctx.setTransactionGroup(
        [
          ctx.anyApplicationCallTransaction({
            app_id: ctx.getApplicationForContract(contract),
            sender: ctx.defaultCreator,
            args: [Bytes('get_votes')],
          }),
          ctx.anyPaymentTransaction({
            sender: ctx.defaultCreator,
            amount: Uint64(10_000),
          }),
        ],
        0,
      )

      const result = contract.approvalProgram()
      expect(result).toEqual(Uint64(2))
    })
  })
})

const castVote = (ctx: TestExecutionContext, contract: SimpleVotingContract, voter: Account): uint64 => {
  ctx.setTransactionGroup(
    [
      ctx.anyApplicationCallTransaction({
        app_id: ctx.getApplicationForContract(contract),
        sender: voter,
        args: [Bytes('vote'), voter.bytes],
      }),
      ctx.anyPaymentTransaction({
        sender: voter,
        amount: Uint64(10_000),
      }),
    ],
    0,
  )
  return contract.approvalProgram()
}
