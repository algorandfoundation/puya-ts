import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, Bytes, Contract, op, ReferenceArray, Txn } from '@algorandfoundation/algorand-typescript'
import { bzero, sha512_256 } from '@algorandfoundation/algorand-typescript/op'

const fromUtf8 = Bytes('abc', { length: 3 })
const fromHex = Bytes.fromHex('AAFF', { length: 2 })
const fromBase32 = Bytes.fromBase32('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ', { length: 36 })
const fromBase64 = Bytes.fromBase64('SGVsbG8gQWxnb3JhbmQ=', { length: 14 })

const EMPTY_HASH = '0000000000000000000000000000000000000000000000000000000000000000'

function padTo32(b: bytes<16>): bytes<32> {
  return b.bitwiseOr(bzero(32)).toFixed({ length: 32, strategy: 'unsafe-cast' })
}

class StaticBytesAlgo extends Contract {
  hashAddresses(a1: B32, a2: B32): B32Alias {
    return sha512_256(a1.concat(a2))
  }

  receiveB32(b: bytes<32>) {
    assert(b.length === 32)
    return sha512_256(b)
  }
  receiveBytes(b: bytes, length: uint64) {
    assert(b.length === length)
  }

  returnLength(b: bytes<32>): uint64 {
    return b.length
  }

  test() {
    this.receiveB32(Txn.sender.bytes)
    this.receiveBytes(Txn.sender.bytes, 32)

    this.receiveB32(Bytes`abcdefghabcdefghabcdefghabcdefgh`.toFixed({ length: 32, strategy: 'assert-length' }))

    const joined = Bytes`${fromUtf8}${fromHex}${fromBase32}${fromBase64}`.toFixed({ length: 55 })
    assert(joined.length === 55)

    const padded = padTo32(Txn.sender.bytes.slice(0, 16).toFixed({ length: 16 }))

    assert(padded.length === 32)
  }

  testArray() {
    const a = [Txn.sender.bytes, Txn.sender.bytes] as const
    const b = new ReferenceArray<bytes<32>>(Txn.sender.bytes)
    b.push(...a)

    const bitAnd = a[0].bitwiseAnd(b[0])
    assert(bitAnd === Txn.sender.bytes)
  }

  test2() {
    let result = Bytes.fromHex(EMPTY_HASH)

    for (let i: uint64 = 0; i < 5; i = i + 1) {
      result = op.sha256(op.concat(result, result))
    }

    return result
  }

  test3() {
    let y: bytes
    const x: bytes<32> = (y = Txn.sender.bytes)
  }

  test4() {
    const b: bytes = Txn.sender.bytes
    const addr = Bytes(b, { length: 32 })
    assert(addr.length === 32)
  }
}

type B<T extends uint64> = bytes<T>
type B32 = B<32>
type B32Alias = B32
