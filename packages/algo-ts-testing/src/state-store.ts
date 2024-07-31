import { Account, Bytes, bytes, gtxn } from '@algorandfoundation/algo-ts'
import algosdk from 'algosdk'

export class StateStore {
  logs: bytes[] = []
  txnGroup: gtxn.AnyTransaction[] = []
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
