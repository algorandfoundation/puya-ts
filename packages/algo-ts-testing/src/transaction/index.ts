import * as client from './client'
import * as runtime from './runtime'
import { bytes, internal } from '@algorandfoundation/algo-ts'
import { AccountCls } from '../reference'

export const encodeTransactions = (txnGroup: client.Transaction[]): runtime.Transaction[] => {
  return txnGroup.map(encodeTransaction)
}

export const encodeTransaction = (txn: client.Transaction): runtime.Transaction => {
  switch (txn.type) {
    case 'appl':
      return {
        type: 'appl',
        args: txn.args.map(encodeArg),
        sender: new AccountCls(encodeArg(txn.sender)),
      }
  }
}

export const encodeArg = (arg: number | bigint | Uint8Array | string): bytes => {
  if (arg instanceof Uint8Array) return new internal.primitives.BytesCls(arg).asAlgoTs()
  if (typeof arg == 'bigint') return new internal.primitives.BigUintCls(arg).toBytes().asAlgoTs()
  if (typeof arg == 'number') return internal.primitives.Uint64Cls.fromCompat(arg).toBytes().asAlgoTs()
  return internal.primitives.BytesCls.fromCompat(arg).asAlgoTs()
}
