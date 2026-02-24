/**
 * Example 18 — Governance DAO
 * Tier: 4 — Advanced
 *
 * Features demonstrated:
 *   - Box<Proposal> — single named box holding an arc4.Struct
 *   - BoxMap<uint64, Proposal> — proposals keyed by numeric ID
 *   - BoxMap<bytes, uint64> — vote deduplication with composite byte keys
 *   - arc4.Struct — Proposal record and ARC-28 event structs (module scope)
 *   - arc4.DynamicArray<arc4.Uint64> — dynamically built list of passing proposals
 *   - emit() — ARC-28 events via struct instances and positional args
 *   - ensureBudget() / OpUpFeeSource — opcode budget management before loops
 *   - urange() — iterate over proposal ID range
 *   - clone() — deep copy proposals read from BoxMap
 *   - Full app lifecycle: create → bootstrap → propose → vote → execute → tally → close
 */
import type { Account, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
// Contract: ABI-routed base; Box/BoxMap: box storage proxies; GlobalState: global state proxy;
// clone: deep copy; emit: ARC-28 events; ensureBudget/OpUpFeeSource: budget management;
// op: low-level ops; Uint64: factory; urange: uint64 range iterator
import {
  abimethod,
  assert,
  Box,
  BoxMap,
  clone,
  Contract,
  emit,
  ensureBudget,
  Global,
  GlobalState,
  op,
  OpUpFeeSource,
  Txn,
  Uint64,
  urange,
} from '@algorandfoundation/algorand-typescript'
// arc4 types: Address (32-byte account), Bool, DynamicArray (variable-length),
// Str (ABI string), Struct (base class), Uint64 as Arc4Uint64 (ABI-encoded uint64)
import {
  Address,
  Bool,
  DynamicArray,
  Str,
  Struct,
  Uint64 as Arc4Uint64,
} from '@algorandfoundation/algorand-typescript/arc4'

// ═══════════════════════════════════════════════════════════════════
// arc4.Struct definitions — must be at module scope (outside class)
// ═══════════════════════════════════════════════════════════════════

// Proposal: on-chain record stored in BoxMap — fields in generic parameter
class Proposal extends Struct<{
  proposer: Address       // Who submitted the proposal
  description: Str        // Human-readable description (dynamic-length ABI string)
  yesVotes: Arc4Uint64    // Number of yes votes
  noVotes: Arc4Uint64     // Number of no votes
  endRound: Arc4Uint64    // Consensus round when voting closes
  executed: Bool           // Whether the proposal has been executed
}> {}

// ARC-28 event: emitted when a new proposal is submitted
class ProposalCreated extends Struct<{
  id: Arc4Uint64
  proposer: Address
}> {}

// ARC-28 event: emitted when a vote is cast
class VoteCast extends Struct<{
  proposalId: Arc4Uint64
  voter: Address
  inFavor: Bool
}> {}

// ARC-28 event: emitted when a proposal is executed
class ProposalExecuted extends Struct<{
  id: Arc4Uint64
}> {}

// ═══════════════════════════════════════════════════════════════════
// Free subroutines — must be at module scope (outside class)
// ═══════════════════════════════════════════════════════════════════

// Build a composite bytes key for vote deduplication: proposalId (8 bytes) + voter address (32 bytes)
function voteBoxKey(proposalId: uint64, voter: Account): bytes {
  // op.itob: convert uint64 to 8-byte big-endian bytes
  // .concat(): append voter's 32-byte address for a unique 40-byte key
  return op.itob(proposalId).concat(voter.bytes)
}

// ═══════════════════════════════════════════════════════════════════
// Governance DAO Contract
// ═══════════════════════════════════════════════════════════════════

export class GovernanceDao extends Contract {
  // --- GlobalState: DAO configuration and counters ---

  // quorum: minimum yes-votes required to execute a proposal
  quorum = GlobalState<uint64>({ initialValue: Uint64(0) })

  // votingPeriod: number of rounds a proposal stays open for voting
  votingPeriod = GlobalState<uint64>({ initialValue: Uint64(0) })

  // nextProposalId: auto-incrementing proposal counter
  nextProposalId = GlobalState<uint64>({ initialValue: Uint64(0) })

  // bootstrapped: whether the DAO has been configured
  bootstrapped = GlobalState<boolean>({ initialValue: false })

  // --- Box storage ---

  // BoxMap<uint64, Proposal>: all proposals keyed by numeric ID
  proposals = BoxMap<uint64, Proposal>({ keyPrefix: 'p' })

  // BoxMap<bytes, uint64>: vote dedup — composite key (proposalId + voter address), value = 1
  votes = BoxMap<bytes, uint64>({ keyPrefix: 'v' })

  // Box<Proposal>: single named box holding the most recently executed proposal
  latestExecuted = Box<Proposal>({ key: 'latest' })

  // ═══════════════════════════════════════════════════════════════
  // Lifecycle: CREATE — deploy the contract
  // ═══════════════════════════════════════════════════════════════

  @abimethod({ allowActions: 'NoOp', onCreate: 'require' })
  public createApplication(): void {
    // GlobalState values are auto-initialized via initialValue above
  }

  // ═══════════════════════════════════════════════════════════════
  // Lifecycle: BOOTSTRAP — configure the DAO parameters
  // ═══════════════════════════════════════════════════════════════

  public bootstrap(quorum: uint64, votingPeriod: uint64): void {
    // Only the creator can bootstrap the DAO
    assert(Txn.sender === Global.creatorAddress, 'Only creator can bootstrap')
    // Prevent double-bootstrap
    assert(!this.bootstrapped.value, 'Already bootstrapped')
    assert(quorum > 0, 'Quorum must be positive')
    assert(votingPeriod > 0, 'Voting period must be positive')

    // Store DAO configuration in GlobalState
    this.quorum.value = quorum
    this.votingPeriod.value = votingPeriod
    this.bootstrapped.value = true

    // emit(): positional-args form — event name string + arc4 values
    emit('DaoBootstrapped', new Arc4Uint64(quorum), new Arc4Uint64(votingPeriod))
  }

  // ═══════════════════════════════════════════════════════════════
  // Lifecycle: PROPOSE — submit a new proposal
  // ═══════════════════════════════════════════════════════════════

  public propose(description: string): uint64 {
    assert(this.bootstrapped.value, 'Not bootstrapped')

    // Allocate a new proposal ID from the auto-incrementing counter
    const id: uint64 = this.nextProposalId.value
    // Calculate the consensus round at which voting ends
    const endRound: uint64 = Global.round + this.votingPeriod.value

    // BoxMap write: store the new Proposal arc4.Struct keyed by uint64 ID
    this.proposals(id).value = new Proposal({
      proposer: new Address(Txn.sender),       // arc4.Address from transaction sender
      description: new Str(description),        // arc4.Str from native string param
      yesVotes: new Arc4Uint64(0),              // Initialize vote counts to zero
      noVotes: new Arc4Uint64(0),
      endRound: new Arc4Uint64(endRound),       // Voting deadline round
      executed: new Bool(false),                 // Not yet executed
    })

    // Increment the proposal counter
    const next: uint64 = id + 1
    this.nextProposalId.value = next

    // emit() with arc4.Struct instance — ARC-28 event "ProposalCreated(uint64,address)"
    emit(new ProposalCreated({
      id: new Arc4Uint64(id),
      proposer: new Address(Txn.sender),
    }))

    return id
  }

  // ═══════════════════════════════════════════════════════════════
  // Lifecycle: VOTE — cast a vote on a proposal
  // ═══════════════════════════════════════════════════════════════

  public vote(proposalId: uint64, inFavor: boolean): void {
    assert(this.bootstrapped.value, 'Not bootstrapped')
    // BoxMap .exists: verify the proposal exists before voting
    assert(this.proposals(proposalId).exists, 'Proposal not found')

    // Free subroutine: build composite bytes key for vote deduplication
    const key: bytes = voteBoxKey(proposalId, Txn.sender)
    // BoxMap .exists on votes map: prevent double-voting
    assert(!this.votes(key).exists, 'Already voted')

    // clone(): deep copy proposal from BoxMap to safely read multiple fields
    const proposal: Proposal = clone(this.proposals(proposalId).value)
    // .asUint64(): convert arc4.Uint64 to native uint64 for comparison
    assert(Global.round <= proposal.endRound.asUint64(), 'Voting ended')
    // .native: convert arc4.Bool to native boolean
    assert(!proposal.executed.native, 'Already executed')

    // Update vote count — mutate the BoxMap entry's struct field directly
    if (inFavor) {
      const newYes: uint64 = proposal.yesVotes.asUint64() + 1
      // Direct field assignment on BoxMap value — no need to rewrite entire struct
      this.proposals(proposalId).value.yesVotes = new Arc4Uint64(newYes)
    } else {
      const newNo: uint64 = proposal.noVotes.asUint64() + 1
      this.proposals(proposalId).value.noVotes = new Arc4Uint64(newNo)
    }

    // Record vote in deduplication BoxMap — value 1 means "voted"
    this.votes(key).value = Uint64(1)

    // emit() with arc4.Struct instance — ARC-28 event "VoteCast(uint64,address,bool)"
    emit(new VoteCast({
      proposalId: new Arc4Uint64(proposalId),
      voter: new Address(Txn.sender),
      inFavor: new Bool(inFavor),
    }))
  }

  // ═══════════════════════════════════════════════════════════════
  // Lifecycle: EXECUTE — execute a proposal that reached quorum
  // ═══════════════════════════════════════════════════════════════

  public execute(proposalId: uint64): void {
    assert(this.bootstrapped.value, 'Not bootstrapped')
    assert(this.proposals(proposalId).exists, 'Proposal not found')

    // clone(): deep copy to read multiple fields without aliasing issues
    const proposal: Proposal = clone(this.proposals(proposalId).value)
    // Voting must have ended (current round > endRound)
    assert(Global.round > proposal.endRound.asUint64(), 'Voting not ended')
    // Must not be already executed
    assert(!proposal.executed.native, 'Already executed')
    // Must meet quorum threshold
    assert(proposal.yesVotes.asUint64() >= this.quorum.value, 'Quorum not met')

    // Mark proposal as executed in BoxMap — direct field mutation
    this.proposals(proposalId).value.executed = new Bool(true)

    // Box write: store the executed proposal in the single named box
    // Delete first if it exists (handles variable-size Proposal due to Str field)
    if (this.latestExecuted.exists) {
      this.latestExecuted.delete()
    }
    this.latestExecuted.value = clone(this.proposals(proposalId).value)

    // emit() with arc4.Struct instance — ARC-28 event "ProposalExecuted(uint64)"
    emit(new ProposalExecuted({
      id: new Arc4Uint64(proposalId),
    }))
  }

  // ═══════════════════════════════════════════════════════════════
  // TALLY — count proposals that met quorum (demonstrates DynamicArray)
  // ═══════════════════════════════════════════════════════════════

  public tally(): uint64 {
    const count: uint64 = this.nextProposalId.value

    // ensureBudget(): ensure sufficient opcode budget before iterating all proposals
    const budget: uint64 = Uint64(700) * count
    ensureBudget(budget, OpUpFeeSource.GroupCredit)

    // arc4.DynamicArray: dynamically build a list of proposal IDs that reached quorum
    const passing = new DynamicArray<Arc4Uint64>()

    // urange(count): iterate 0..count-1 over all proposal IDs
    for (const id of urange(count)) {
      if (this.proposals(id).exists) {
        // clone(): safe deep copy from BoxMap for reading struct fields
        const proposal: Proposal = clone(this.proposals(id).value)
        // Check if yes-votes meet the quorum threshold
        if (proposal.yesVotes.asUint64() >= this.quorum.value) {
          // DynamicArray .push(): append the passing proposal's ID
          passing.push(new Arc4Uint64(id))
        }
      }
    }

    // DynamicArray .length: number of proposals that passed
    return passing.length
  }

  // ═══════════════════════════════════════════════════════════════
  // Lifecycle: CLOSE — shut down the DAO and clean up box storage
  // ═══════════════════════════════════════════════════════════════

  public close(): void {
    // Only the creator can close the DAO
    assert(Txn.sender === Global.creatorAddress, 'Only creator can close')

    const count: uint64 = this.nextProposalId.value

    // ensureBudget(): ensure enough opcode budget for deleting all proposal boxes
    const budget: uint64 = Uint64(700) * count
    ensureBudget(budget, OpUpFeeSource.GroupCredit)

    // urange(count): iterate all proposal IDs for cleanup
    for (const id of urange(count)) {
      // BoxMap .exists + .delete(): conditionally remove each proposal box
      if (this.proposals(id).exists) {
        this.proposals(id).delete()
      }
    }

    // Box .exists + .delete(): clean up the latest-executed box
    if (this.latestExecuted.exists) {
      this.latestExecuted.delete()
    }

    // emit(): positional-args form for the close event
    emit('DaoClosed', new Arc4Uint64(count))
  }
}
