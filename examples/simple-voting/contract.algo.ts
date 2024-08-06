import type { Account, bytes, uint64 } from '@algorandfoundation/algo-ts'
import { BaseContract, Bytes, GlobalState, LocalState, op, Uint64 } from '@algorandfoundation/algo-ts'

export default class SimpleVotingContract extends BaseContract {
  topic = GlobalState<bytes>({ initialValue: Bytes('default_topic'), key: Bytes('topic') })
  votes = GlobalState<uint64>({ initialValue: Uint64(0), key: Bytes('votes') })
  voted = LocalState<uint64>({ key: Bytes('voted') })

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
    if (this.voted(voter).hasValue) {
      return false
    }
    this.votes.value = this.votes.value + 1
    this.voted(voter).value = Uint64(1)
    return true
  }
}
