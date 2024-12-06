import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, Bytes, Contract, contract, Global, logicsig, LogicSig, op, Txn } from '@algorandfoundation/algorand-typescript'

@logicsig({ name: 'AVM11SIG', avmVersion: 11 })
export class Avm11Sig extends LogicSig {
  program(): uint64 {
    return op.sumhash512(Bytes('')).length
  }
}

@contract({ name: 'AVM11Contract', avmVersion: 11 })
export class Avm11Contract extends Contract {
  testNewOps() {
    // Ops
    assert(!op.falconVerify(Bytes(), Bytes(), op.bzero(1793)))
    assert(op.sumhash512(Bytes()))
    assert(op.onlineStake())

    // AcctParams
    const [a, b] = op.AcctParams.acctIncentiveEligible(Txn.sender)
    const [c, d] = op.AcctParams.acctLastProposed(Txn.sender)
    const [e, f] = op.AcctParams.acctLastProposed(Txn.sender)

    // Block
    assert(op.Block.blkProposer(0) !== Global.zeroAddress, 'proposer')
    assert(op.Block.blkFeesCollected(0), 'fees collected')
    assert(op.Block.blkBonus(0), 'bonus')
    assert(op.Block.blkBranch(0), 'branch')
    assert(op.Block.blkFeeSink(0) !== Global.zeroAddress, 'fee sink')
    assert(op.Block.blkProtocol(0), 'protocol')
    assert(op.Block.blkTxnCounter(0), 'txn counter')
    assert(op.Block.blkProposerPayout(0), 'proposer payout')

    // Global
    assert(op.Global.payoutsEnabled, 'payouts_enabled')
    assert(op.Global.payoutsGoOnlineFee, 'payouts_go_online_fee')
    assert(op.Global.payoutsPercent, 'payouts_percent')
    assert(op.Global.payoutsMinBalance, 'payouts_min_balance')
    assert(op.Global.payoutsMaxBalance, 'payouts_max_balance')
    // Voter params
    const [g, h] = op.VoterParams.voterBalance(0)
    const [i, j] = op.VoterParams.voterIncentiveEligible(0)
  }
}
