import { Account, Bytes, bytes } from '@algorandfoundation/algo-ts'
import algosdk from 'algosdk'
import { TransactionBase } from './transactions'

export class StateStore {
  logs: bytes[] = []
  txnGroup: TransactionBase[] = []
  defaultCreator: Account

  constructor() {
    this.defaultCreator = Account(Bytes(algosdk.generateAccount().addr))
  }

  reset() {
    this.logs = []
    this.txnGroup = []
    this.defaultCreator = Account(Bytes(algosdk.generateAccount().addr))
  }
}
