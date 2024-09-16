import { Bytes } from '@algorandfoundation/algo-ts'

export const UINT64_SIZE = 64
export const UINT512_SIZE = 512
export const MAX_UINT8 = 2 ** 8 - 1
export const MAX_UINT64 = 2n ** 64n - 1n
export const MAX_UINT512 = 2n ** 512n - 1n
export const MAX_BYTES_SIZE = 4096
export const BITS_IN_BYTE = 8
export const DEFAULT_ACCOUNT_MIN_BALANCE = 100_000

// algorand encoded address of 32 zero bytes
export const ZERO_ADDRESS = Bytes('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ')

/**
"\x09"  # pragma version 9
"\x81\x01"  # pushint 1
 */
export const ALWAYS_APPROVE_TEAL_PROGRAM = Bytes(new Uint8Array([0x09, 0x81, 0x01]))
