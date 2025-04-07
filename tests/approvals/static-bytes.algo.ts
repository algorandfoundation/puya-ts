import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, Bytes, Contract, Txn } from '@algorandfoundation/algorand-typescript'
import { sha512_256 } from '@algorandfoundation/algorand-typescript/op'

class StaticBytesAlgo extends Contract {
  hashAddresses(a1: bytes<32>, a2: bytes<32>): bytes<32> {
    return sha512_256(a1.concat(a2))
  }

  receiveB32(b: bytes<32>) {
    assert(b.length === 32)
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

    this.receiveB32(Bytes`hmmm`.toFixedLength(32))
  }
}
