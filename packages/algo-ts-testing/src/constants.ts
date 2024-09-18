import { Bytes } from '@algorandfoundation/algo-ts'

export const UINT64_SIZE = 64
export const UINT512_SIZE = 512
export const MAX_UINT8 = 2 ** 8 - 1
export const MAX_UINT64 = 2n ** 64n - 1n
export const MAX_UINT512 = 2n ** 512n - 1n
export const MAX_BYTES_SIZE = 4096
export const BITS_IN_BYTE = 8
export const DEFAULT_ACCOUNT_MIN_BALANCE = 100_000
export const DEFAULT_MAX_TXN_LIFE = 1_000
export const DEFAULT_ASSET_CREATE_MIN_BALANCE = 1000_000
export const DEFAULT_ASSET_OPT_IN_MIN_BALANCE = 10_000

// from python code: list(b"\x85Y\xb5\x14x\xfd\x89\xc1vC\xd0]\x15\xa8\xaek\x10\xabG\xbbm\x8a1\x88\x11V\xe6\xbd;\xae\x95\xd1")
export const DEFAULT_GLOBAL_GENESIS_HASH = Bytes(
  new Uint8Array([
    133, 89, 181, 20, 120, 253, 137, 193, 118, 67, 208, 93, 21, 168, 174, 107, 16, 171, 71, 187, 109, 138, 49, 136, 17, 86, 230, 189, 59,
    174, 149, 209,
  ]),
)

// algorand encoded address of 32 zero bytes
export const ZERO_ADDRESS = Bytes('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ')

/**
"\x09"  # pragma version 9
"\x81\x01"  # pushint 1
 */
export const ALWAYS_APPROVE_TEAL_PROGRAM = Bytes(new Uint8Array([0x09, 0x81, 0x01]))

// bytes: program (logic) data prefix when signing
export const LOGIC_DATA_PREFIX = Bytes('ProgData')

//number: minimum transaction fee
export const MIN_TXN_FEE = 1000
