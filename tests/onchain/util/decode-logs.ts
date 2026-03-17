import type { SendAppTransactionResult } from '@algorandfoundation/algokit-utils/app'
import { uint8ArrayToBigInt, uint8ArrayToUtf8 } from '../../../src/util'

export type LogDecoding = 'i' | 's' | 'b'

export type DecodedLog<T extends LogDecoding> = T extends 'i' ? bigint : T extends 's' ? string : Uint8Array
export type DecodedLogs<T extends [...LogDecoding[]]> = {
  [Index in keyof T]: DecodedLog<T[Index]>
} & { length: T['length'] }

export function decodeLogs<const T extends [...LogDecoding[]]>(txnResult: SendAppTransactionResult, decoding: T): DecodedLogs<T> {
  return decoding.map((decoding, i) => {
    const log = txnResult.confirmation.logs?.[i]
    if (log === undefined) {
      throw new Error(`Cannot find logs log ${i}`)
    }

    switch (decoding[i]) {
      case 'i':
        return uint8ArrayToBigInt(log)
      case 's':
        return uint8ArrayToUtf8(log)
      default:
        return log
    }
  }) as DecodedLogs<T>
}
