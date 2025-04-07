import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, Bytes, Contract, MutableArray, Txn } from '@algorandfoundation/algorand-typescript'
import { bzero, sha512_256 } from '@algorandfoundation/algorand-typescript/op'

const fromUtf8 = Bytes<3>('abc')
const fromHex = Bytes.fromHex<2>('AAFF')
const fromBase32 = Bytes.fromBase32<36>('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ')
const fromBase64 = Bytes.fromBase64<14>('SGVsbG8gQWxnb3JhbmQ=')

function padTo32(b: bytes<16>): bytes<32> {
  return b.bitwiseOr(bzero(32)).toFixed({ length: 32, checked: false })
}

class StaticBytesAlgo extends Contract {
  hashAddresses(a1: bytes<32>, a2: bytes<32>): bytes<32> {
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

    this.receiveB32(Bytes`abcdefghabcdefghabcdefghabcdefgh`.toFixed({ length: 32 }))

    const joined = Bytes<55>`${fromUtf8}${fromHex}${fromBase32}${fromBase64}`
    assert(joined.length === 55)
  }

  testArray() {
    const a = [Txn.sender.bytes, Txn.sender.bytes] as const
    const b = new MutableArray<bytes<32>>(Txn.sender.bytes)
    b.push(...a)

    const bitAnd = a[0].bitwiseAnd(b[0])
    assert(bitAnd === Txn.sender.bytes)
  }
}
