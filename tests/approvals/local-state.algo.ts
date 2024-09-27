import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, LocalState, Txn } from '@algorandfoundation/algorand-typescript'
import type { StaticArray, UintN } from '@algorandfoundation/algorand-typescript/arc4'

type SampleArray = StaticArray<UintN<64>, 10>

export class LocalStateDemo extends Contract {
  localUint = LocalState<uint64>({ key: 'l1' })
  localUint2 = LocalState<uint64>()
  localBytes = LocalState<bytes>({ key: 'b1' })
  localBytes2 = LocalState<bytes>()
  localEncoded = LocalState<SampleArray>()

  public setState({ a, b, c }: { a: uint64; b: bytes; c: SampleArray }) {
    this.localUint(Txn.sender).value = a
    this.localUint2(Txn.sender).value = a
    this.localBytes(Txn.sender).value = b
    this.localBytes2(Txn.sender).value = b
    this.localEncoded(Txn.sender).value = c.copy()
  }

  public getState() {
    return {
      localUint: this.localUint(Txn.sender).value,
      localUint2: this.localUint2(Txn.sender).value,
      localBytes: this.localBytes(Txn.sender).value,
      localBytes2: this.localBytes2(Txn.sender).value,
      localEncoded: this.localEncoded(Txn.sender).value.copy(),
    }
  }

  public clearState() {
    this.localUint(Txn.sender).delete()
    this.localUint2(Txn.sender).delete()
    this.localBytes(Txn.sender).delete()
    this.localBytes2(Txn.sender).delete()
    this.localEncoded(Txn.sender).delete()
  }
}
