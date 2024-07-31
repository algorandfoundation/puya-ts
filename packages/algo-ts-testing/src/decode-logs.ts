import { internal } from '@algorandfoundation/algo-ts'

export type LogDecoding = 'i' | 's' | 'b'

export type DecodedLog<T extends LogDecoding> = T extends 'i' ? bigint : T extends 's' ? string : Uint8Array
export type DecodedLogs<T extends [...LogDecoding[]]> = {
  [Index in keyof T]: DecodedLog<T[Index]>
} & { length: T['length'] }
export function decodeLogs<const T extends [...LogDecoding[]]>(logs: Uint8Array[], decoding: T): DecodedLogs<T> {
  return logs.map((log, i) => {
    switch (decoding[i]) {
      case 'i':
        return internal.encodingUtil.uint8ArrayToBigInt(log)
      case 's':
        return internal.encodingUtil.uint8ArrayToUtf8(log)
      default:
        return log
    }
  }) as DecodedLogs<T>
}
