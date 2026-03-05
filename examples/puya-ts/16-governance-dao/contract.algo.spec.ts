import { Uint64 } from '@algorandfoundation/algorand-typescript'
import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { afterEach, describe, expect, it } from 'vitest'
import { GovernanceDao } from './contract.algo'

describe('GovernanceDao', () => {
  const ctx = new TestExecutionContext()
  afterEach(() => ctx.reset())

  function createContract() {
    const contract = ctx.contract.create(GovernanceDao)
    contract.createApplication()
    return contract
  }

  function bootstrapDao(contract: ReturnType<typeof createContract>, quorum = 2, votingPeriod = 100) {
    const app = ctx.ledger.getApplicationForContract(contract)
    ctx.txn.createScope([ctx.any.txn.applicationCall({ appId: contract, sender: app.creator })]).execute(() => {
      contract.bootstrap(quorum, votingPeriod)
    })
    return app
  }

  function propose(contract: ReturnType<typeof createContract>, description: string, sender?: ReturnType<typeof ctx.any.account>) {
    let id!: bigint
    const txnOpts = sender ? { sender } : {}
    ctx.txn.createScope([ctx.any.txn.applicationCall({ appId: contract, ...txnOpts })]).execute(() => {
      id = contract.propose(description) as unknown as bigint
    })
    return id
  }

  function vote(
    contract: ReturnType<typeof createContract>,
    proposalId: number,
    inFavor: boolean,
    sender?: ReturnType<typeof ctx.any.account>,
  ) {
    const txnOpts = sender ? { sender } : {}
    ctx.txn.createScope([ctx.any.txn.applicationCall({ appId: contract, ...txnOpts })]).execute(() => {
      contract.vote(proposalId, inFavor)
    })
  }

  describe('bootstrap', () => {
    it('sets quorum and voting period', () => {
      const contract = createContract()
      bootstrapDao(contract, 5, 200)

      expect(contract.quorum.value).toEqual(5n)
      expect(contract.votingPeriod.value).toEqual(200n)
      expect(contract.bootstrapped.value).toBe(true)
    })

    it('rejects non-creator', () => {
      const contract = createContract()
      const nonCreator = ctx.any.account()

      ctx.txn.createScope([ctx.any.txn.applicationCall({ appId: contract, sender: nonCreator })]).execute(() => {
        expect(() => contract.bootstrap(2, 100)).toThrow('Only creator can bootstrap')
      })
    })

    it('rejects double bootstrap', () => {
      const contract = createContract()
      const app = bootstrapDao(contract)

      ctx.txn.createScope([ctx.any.txn.applicationCall({ appId: contract, sender: app.creator })]).execute(() => {
        expect(() => contract.bootstrap(2, 100)).toThrow('Already bootstrapped')
      })
    })

    it('rejects zero quorum', () => {
      const contract = createContract()
      const app = ctx.ledger.getApplicationForContract(contract)

      ctx.txn.createScope([ctx.any.txn.applicationCall({ appId: contract, sender: app.creator })]).execute(() => {
        expect(() => contract.bootstrap(0, 100)).toThrow('Quorum must be positive')
      })
    })

    it('rejects zero voting period', () => {
      const contract = createContract()
      const app = ctx.ledger.getApplicationForContract(contract)

      ctx.txn.createScope([ctx.any.txn.applicationCall({ appId: contract, sender: app.creator })]).execute(() => {
        expect(() => contract.bootstrap(2, 0)).toThrow('Voting period must be positive')
      })
    })
  })

  describe('propose', () => {
    it('creates proposal and returns incrementing IDs', () => {
      const contract = createContract()
      bootstrapDao(contract)

      const id0 = propose(contract, 'Proposal A')
      const id1 = propose(contract, 'Proposal B')

      expect(id0).toEqual(0n)
      expect(id1).toEqual(1n)
      expect(contract.nextProposalId.value).toEqual(2n)
    })

    it('stores proposal data in BoxMap', () => {
      const contract = createContract()
      bootstrapDao(contract)

      propose(contract, 'Fund community pool')

      expect(contract.proposals(0).exists).toBe(true)
      const proposal = contract.proposals(0).value
      expect(proposal.description.native).toEqual('Fund community pool')
      expect(proposal.yesVotes.asUint64()).toEqual(0n)
      expect(proposal.noVotes.asUint64()).toEqual(0n)
      expect(proposal.executed.native).toBe(false)
    })

    it('rejects when not bootstrapped', () => {
      const contract = createContract()

      ctx.txn.createScope([ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        expect(() => contract.propose('test')).toThrow('Not bootstrapped')
      })
    })
  })

  describe('vote', () => {
    it('increments yes vote count', () => {
      const contract = createContract()
      bootstrapDao(contract)
      propose(contract, 'Test proposal')

      const voter = ctx.any.account()
      vote(contract, 0, true, voter)

      expect(contract.proposals(0).value.yesVotes.asUint64()).toEqual(1n)
      expect(contract.proposals(0).value.noVotes.asUint64()).toEqual(0n)
    })

    it('increments no vote count', () => {
      const contract = createContract()
      bootstrapDao(contract)
      propose(contract, 'Test proposal')

      const voter = ctx.any.account()
      vote(contract, 0, false, voter)

      expect(contract.proposals(0).value.yesVotes.asUint64()).toEqual(0n)
      expect(contract.proposals(0).value.noVotes.asUint64()).toEqual(1n)
    })

    it('records voter and rejects double voting', () => {
      const contract = createContract()
      bootstrapDao(contract)
      propose(contract, 'Test proposal')

      const voter = ctx.any.account()
      vote(contract, 0, true, voter)

      // Same voter tries to vote again
      ctx.txn.createScope([ctx.any.txn.applicationCall({ appId: contract, sender: voter })]).execute(() => {
        expect(() => contract.vote(0, true)).toThrow('Already voted')
      })
    })

    it('allows different voters on same proposal', () => {
      const contract = createContract()
      bootstrapDao(contract)
      propose(contract, 'Test proposal')

      const voter1 = ctx.any.account()
      const voter2 = ctx.any.account()
      vote(contract, 0, true, voter1)
      vote(contract, 0, false, voter2)

      expect(contract.proposals(0).value.yesVotes.asUint64()).toEqual(1n)
      expect(contract.proposals(0).value.noVotes.asUint64()).toEqual(1n)
    })

    it('rejects vote on nonexistent proposal', () => {
      const contract = createContract()
      bootstrapDao(contract)

      ctx.txn.createScope([ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        expect(() => contract.vote(99, true)).toThrow('Proposal not found')
      })
    })

    it('rejects vote after voting ended', () => {
      const contract = createContract()
      bootstrapDao(contract, 2, 10)
      propose(contract, 'Expired proposal')

      // Advance round past voting period
      ctx.ledger.patchGlobalData({ round: Uint64(1000) })

      const voter = ctx.any.account()
      ctx.txn.createScope([ctx.any.txn.applicationCall({ appId: contract, sender: voter })]).execute(() => {
        expect(() => contract.vote(0, true)).toThrow('Voting ended')
      })
    })
  })

  describe('execute', () => {
    it('succeeds when quorum is met and voting ended', () => {
      const contract = createContract()
      bootstrapDao(contract, 2, 10)
      propose(contract, 'Approved proposal')

      // Cast 2 yes votes (meets quorum of 2)
      vote(contract, 0, true, ctx.any.account())
      vote(contract, 0, true, ctx.any.account())

      // Advance round past voting period
      ctx.ledger.patchGlobalData({ round: Uint64(1000) })

      contract.execute(0)

      expect(contract.proposals(0).value.executed.native).toBe(true)
      expect(contract.latestExecuted.exists).toBe(true)
    })

    it('fails when quorum is not met', () => {
      const contract = createContract()
      bootstrapDao(contract, 3, 10)
      propose(contract, 'Under-voted proposal')

      // Only 2 yes votes, quorum is 3
      vote(contract, 0, true, ctx.any.account())
      vote(contract, 0, true, ctx.any.account())

      // Advance round past voting period
      ctx.ledger.patchGlobalData({ round: Uint64(1000) })

      expect(() => contract.execute(0)).toThrow('Quorum not met')
    })

    it('fails when voting has not ended', () => {
      const contract = createContract()
      bootstrapDao(contract, 1, 10000)
      propose(contract, 'Still open')

      vote(contract, 0, true, ctx.any.account())

      // Round is still within voting period
      expect(() => contract.execute(0)).toThrow('Voting not ended')
    })

    it('fails when already executed', () => {
      const contract = createContract()
      bootstrapDao(contract, 1, 10)
      propose(contract, 'One-time proposal')

      vote(contract, 0, true, ctx.any.account())

      ctx.ledger.patchGlobalData({ round: Uint64(1000) })

      contract.execute(0)

      expect(() => contract.execute(0)).toThrow('Already executed')
    })

    it('rejects nonexistent proposal', () => {
      const contract = createContract()
      bootstrapDao(contract)

      expect(() => contract.execute(99)).toThrow('Proposal not found')
    })
  })

  describe('tally', () => {
    it('counts proposals that met quorum', () => {
      const contract = createContract()
      bootstrapDao(contract, 2, 10)

      // Proposal 0: 2 yes votes (meets quorum)
      propose(contract, 'Passing proposal')
      vote(contract, 0, true, ctx.any.account())
      vote(contract, 0, true, ctx.any.account())

      // Proposal 1: 1 yes vote (doesn't meet quorum)
      propose(contract, 'Failing proposal')
      vote(contract, 1, true, ctx.any.account())

      expect(contract.tally()).toEqual(1n)
    })

    it('returns zero when no proposals meet quorum', () => {
      const contract = createContract()
      bootstrapDao(contract, 5, 10)

      propose(contract, 'Under-voted')
      vote(contract, 0, true, ctx.any.account())

      expect(contract.tally()).toEqual(0n)
    })

    it('counts multiple passing proposals', () => {
      const contract = createContract()
      bootstrapDao(contract, 1, 10)

      // Proposal 0: 1 yes vote (meets quorum)
      propose(contract, 'Passing A')
      vote(contract, 0, true, ctx.any.account())

      // Proposal 1: 1 yes vote (meets quorum)
      propose(contract, 'Passing B')
      vote(contract, 1, true, ctx.any.account())

      // Proposal 2: 0 votes (doesn't meet quorum)
      propose(contract, 'No votes')

      expect(contract.tally()).toEqual(2n)
    })
  })

  describe('close', () => {
    it('cleans up proposal boxes', () => {
      const contract = createContract()
      const app = bootstrapDao(contract)

      propose(contract, 'To be cleaned up')

      ctx.txn.createScope([ctx.any.txn.applicationCall({ appId: contract, sender: app.creator })]).execute(() => {
        contract.close()
      })

      expect(contract.proposals(0).exists).toBe(false)
    })

    it('rejects non-creator', () => {
      const contract = createContract()
      bootstrapDao(contract)

      const nonCreator = ctx.any.account()
      ctx.txn.createScope([ctx.any.txn.applicationCall({ appId: contract, sender: nonCreator })]).execute(() => {
        expect(() => contract.close()).toThrow('Only creator can close')
      })
    })

    it('cleans up latestExecuted box', () => {
      const contract = createContract()
      const app = bootstrapDao(contract, 1, 10)

      propose(contract, 'Will be executed then cleaned')
      vote(contract, 0, true, ctx.any.account())

      ctx.ledger.patchGlobalData({ round: Uint64(1000) })
      contract.execute(0)
      expect(contract.latestExecuted.exists).toBe(true)

      ctx.txn.createScope([ctx.any.txn.applicationCall({ appId: contract, sender: app.creator })]).execute(() => {
        contract.close()
      })

      expect(contract.latestExecuted.exists).toBe(false)
    })
  })
})
