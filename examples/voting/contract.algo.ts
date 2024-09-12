import type { Account, bytes, uint64, gtxn, Asset } from '@algorandfoundation/algo-ts'
import {
  abimethod,
  arc4,
  assert,
  assertMatch,
  Bytes,
  Global,
  GlobalState,
  Uint64,
  BoxRef,
  BoxMap,
  log,
  ensureBudget,
  op,
  itxn,
  Txn,
  urange,
} from '@algorandfoundation/algo-ts'

type VoteIndexArray = arc4.DynamicArray<arc4.UintN<8>>

const VOTE_INDEX_BYTES: uint64 = 1
const VOTE_COUNT_BYTES: uint64 = 8

// The min balance increase per box created
const BOX_FLAT_MIN_BALANCE: uint64 = 2500

// The min balance increase per byte of boxes (key included)
const BOX_BYTE_MIN_BALANCE: uint64 = 400

// The min balance increase for each asset opted into
const ASSET_MIN_BALANCE: uint64 = 100000

type VotingPreconditions = {
  is_voting_open: boolean
  is_allowed_to_vote: boolean
  has_already_voted: boolean
  current_time: uint64
}
export class VotingRoundApp extends arc4.Contract {
  isBootstrapped = GlobalState<boolean>({ initialValue: false })
  voterCount = GlobalState({ initialValue: Uint64(0) })
  closeTime = GlobalState<uint64>()
  tallyBox = BoxRef({ key: Bytes`V` })
  votesByAccount = BoxMap<Account, VoteIndexArray>({ keyPrefix: Bytes() })
  voteId = GlobalState<string>()
  snapshotPublicKey = GlobalState<bytes>()
  metadataIpfsCid = GlobalState<string>()
  startTime = GlobalState<uint64>()
  nftImageUrl = GlobalState<string>()
  endTime = GlobalState<uint64>()
  quorum = GlobalState<uint64>()
  optionCounts = GlobalState<VoteIndexArray>()
  totalOptions = GlobalState<uint64>()
  nftAsset = GlobalState<Asset>()

  @abimethod({ onCreate: 'require' })
  public create(
    voteId: string,
    snapshotPublicKey: bytes,
    metadataIpfsCid: string,
    startTime: uint64,
    endTime: uint64,
    optionCounts: VoteIndexArray,
    quorum: uint64,
    nftImageUrl: string,
  ): void {
    assert(startTime < endTime, 'End time should be after start time')
    assert(endTime >= Global.latestTimestamp, 'End time should be in the future')

    this.voteId.value = voteId
    this.snapshotPublicKey.value = snapshotPublicKey
    this.metadataIpfsCid.value = metadataIpfsCid
    this.startTime.value = startTime
    this.endTime.value = endTime
    this.quorum.value = quorum
    this.nftImageUrl.value = nftImageUrl
    this.storeOptionCounts(optionCounts)
  }

  public bootstrap(fundMinBalReq: gtxn.PayTxn): void {
    assert(!this.isBootstrapped.value, 'Must not be already bootstrapped')
    this.isBootstrapped.value = true
    assertMatch(
      fundMinBalReq,
      {
        receiver: Global.currentApplicationAddress,
      },
      'Payment must be to app address',
    )
    const tallyBoxSize: uint64 = this.totalOptions.value * VOTE_COUNT_BYTES

    const minBalanceReq: uint64 =
      ASSET_MIN_BALANCE * 2 + 1000 + BOX_FLAT_MIN_BALANCE + BOX_BYTE_MIN_BALANCE + tallyBoxSize * BOX_BYTE_MIN_BALANCE

    log(minBalanceReq)

    assertMatch(
      fundMinBalReq,
      {
        amount: minBalanceReq,
      },
      'Payment must be for the exact min balance requirement',
    )
    assert(this.tallyBox.create({ size: tallyBoxSize }))
  }

  public close() {
    ensureBudget(20000, 'GroupCredit')
    assert(!this.closeTime.hasValue, 'Already closed')
    this.closeTime.value = Global.latestTimestamp

    // Do we need a way to declare string literals where we ignore leading whitespace?
    let note = `{
      "standard":"arc69",
      "description":"This is a voting result NFT for voting round with ID ${this.voteId.value}",
      "properties":{
        "metadata":"ipfs://${this.metadataIpfsCid.value}",
        "id":"${this.voteId.value}",
        "quorum":"${itoa(this.quorum.value)}}",
        "voterCount":"${itoa(this.voterCount.value)}",
        "tallies": [`

    let currentIndex = Uint64(0)
    this.optionCounts.value.forEach((questionOptions, questionIndex) => {
      if (questionIndex > 0) {
        note += ','
      }
      if (questionOptions.native > 0) {
        note += '['
        for (let optionIndex = Uint64(0); optionIndex <= questionOptions.native; optionIndex++) {
          if (optionIndex > 0) {
            note += ','
          }
          note += itoa(this.getVoteFromBox(currentIndex))
          currentIndex += 1
        }
        note += ']'
      }
    })
    note += ']}}'

    this.nftAsset.value = itxn.submitAssetCreate({
      total: 1,
      decimals: 0,
      defaultFrozen: false,
      name: `[VOTE RESULT] ${this.voteId.value}`,
      unitName: `VOTERSLT`,
      url: this.nftImageUrl.value,
      note: note,
      fee: Global.minTxnFee,
    }).config_asset
  }

  @abimethod({ readonly: true })
  public getPreconditions(signature: bytes): VotingPreconditions {
    return {
      is_allowed_to_vote: this.allowedToVote(signature),
      is_voting_open: this.votingOpen(),
      has_already_voted: this.alreadyVoted(),
      current_time: Global.latestTimestamp,
    }
  }

  private allowedToVote(signature: bytes): boolean {
    ensureBudget(2000)
    return op.ed25519verifyBare(Txn.sender.bytes, signature, this.snapshotPublicKey.value)
  }

  private alreadyVoted(): boolean {
    return this.votesByAccount.has(Txn.sender)
  }

  public vote(fundMinBalReq: gtxn.PayTxn, signature: bytes, answerIds: VoteIndexArray): void {
    ensureBudget(7700, 'GroupCredit')
    assert(this.allowedToVote(signature), 'Not allowed to vote')
    assert(this.votingOpen(), 'Voting not open')
    assert(!this.alreadyVoted(), 'Already voted')

    const questionsCount = this.optionCounts.value.length
    assertMatch(
      answerIds,
      {
        length: questionsCount,
      },
      'Number of answers incorrect',
    )
    const minBalReq: uint64 = BOX_FLAT_MIN_BALANCE + (32 + 2 + VOTE_INDEX_BYTES * answerIds.length) * BOX_BYTE_MIN_BALANCE
    log(minBalReq)
    assertMatch(
      fundMinBalReq,
      {
        receiver: Global.currentApplicationAddress,
        amount: minBalReq,
      },
      'Payment must be to app and for exactly min balance',
    )
    let cumulativeOffset = Uint64(0)
    for (const questionIndex of urange(questionsCount)) {
      const answerOptionIndex = answerIds.at(questionIndex).native
      const optionsCount = this.optionCounts.value.at(questionIndex).native
      assert(answerOptionIndex < optionsCount, 'Answer option index invalid')
      this.incrementVoteInBox(cumulativeOffset + answerOptionIndex)
      cumulativeOffset += optionsCount
      this.votesByAccount.set(Txn.sender, answerIds)
      this.voterCount.value += 1
    }
  }

  private votingOpen(): boolean {
    return (
      this.isBootstrapped.value &&
      !this.closeTime.hasValue &&
      this.startTime.value <= Global.latestTimestamp &&
      Global.latestTimestamp <= this.endTime.value
    )
  }

  private storeOptionCounts(optionCounts: VoteIndexArray) {
    assertMatch(optionCounts, { length: { between: [Uint64(1), Uint64(112)] } })

    let totalOptions = Uint64(0)
    for (const item of optionCounts) {
      totalOptions += item.native
    }
    this.optionCounts.value = optionCounts
    this.totalOptions.value = totalOptions
  }

  private getVoteFromBox(index: uint64): uint64 {
    return op.btoi(this.tallyBox.extract(index, VOTE_COUNT_BYTES))
  }

  private incrementVoteInBox(index: uint64): void {
    const currentVote = this.getVoteFromBox(index)
    this.tallyBox.replace(index, op.itob(currentVote + 1))
  }
}
function itoa(i: uint64): string {
  const digits = Bytes`0123456789`
  const radix = digits.length
  if (i < radix) {
    return digits.at(i).toString()
  }
  return `${itoa(i / radix)}${digits.at(i % radix)}`
}
