import * as client from './client'
import * as runtime from './runtime'
import { Account, bytes } from '@algorandfoundation/algo-ts'
import { makeBytes } from '../primitives'
import { bigIntToUint8Array, utf8ToUint8Array } from '../encoding-util'

export const encodeTransactions = (txnGroup: client.Transaction[]): runtime.Transaction[] => {
  return txnGroup.map(encodeTransaction)
}

export const encodeTransaction = (txn: client.Transaction): runtime.Transaction => {
  switch (txn.type) {
    case 'appl':
      return {
        type: 'appl',
        args: txn.args.map(encodeArg),
        sender: new Account(encodeArg(txn.sender)),
      }
  }
}

export const encodeArg = (arg: number | bigint | Uint8Array | string): bytes => {
  if (arg instanceof Uint8Array) return makeBytes(arg)
  if (typeof arg == 'bigint') return makeBytes(bigIntToUint8Array(arg))
  if (typeof arg == 'number') return makeBytes(bigIntToUint8Array(BigInt(arg)))
  return makeBytes(utf8ToUint8Array(arg))
}
