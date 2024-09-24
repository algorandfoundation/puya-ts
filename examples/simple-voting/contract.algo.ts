import type { Account, bytes, uint64 } from '@algorandfoundation/algo-ts'
import { assert, BaseContract, Bytes, GlobalState, LocalState, op, TransactionType, Uint64 } from '@algorandfoundation/algo-ts'

const VOTE_PRICE = Uint64(10_000)
export default class SimpleVotingContract extends BaseContract {
  topic = GlobalState({ initialValue: Bytes('default_topic'), key: Bytes('topic') })
  votes = GlobalState({ initialValue: Uint64(0), key: Bytes('votes') })
  voted = LocalState<uint64>()

  public approvalProgram(): uint64 {
    switch (op.Txn.applicationArgs(0)) {
      case Bytes('set_topic'): {
        this.setTopic(op.Txn.applicationArgs(1))
        return Uint64(1)
      }
      case Bytes('vote'): {
        return this.vote(op.Txn.sender) ? Uint64(1) : Uint64(0)
      }
      case Bytes('get_votes'): {
        return this.votes.value
      }
      default:
        return Uint64(0)
    }
  }

  public clearStateProgram(): boolean {
    return true
  }

  private setTopic(topic: bytes): void {
    this.topic.value = topic
  }

  private vote(voter: Account): boolean {
    assert(op.Global.groupSize === Uint64(2))
    assert(op.GTxn.amount(1) === VOTE_PRICE)
    assert(op.GTxn.typeEnum(1) === TransactionType.Payment)

    if (this.voted(voter).hasValue) {
      return false
    }
    this.votes.value = this.votes.value + 1
    this.voted(voter).value = Uint64(1)
    return true
  }
}
