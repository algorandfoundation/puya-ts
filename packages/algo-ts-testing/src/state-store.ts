import { bytes } from '@algorandfoundation/algo-ts'
import { TransactionBase } from './internal'

export class StateStore {
  logs: bytes[] = []
  txnGroup: TransactionBase[] = []

  reset() {
    this.logs = []
    this.txnGroup = []
  }
}
