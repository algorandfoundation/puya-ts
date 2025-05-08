import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, Contract, LocalState, Txn } from '@algorandfoundation/algorand-typescript'
import type { StaticArray, UintN } from '@algorandfoundation/algorand-typescript/arc4'

type SampleArray = StaticArray<UintN<64>, 10>

export class LocalStateDemo extends Contract {
  localUint = LocalState<uint64>({ key: 'l1' })
  localUint2 = LocalState<uint64>()
  localBytes = LocalState<bytes>({ key: 'b1' })
  localBytes2 = LocalState<bytes>()
  localEncoded = LocalState<SampleArray>()
  localTuple = LocalState<[uint64, bytes]>()
  localObject = LocalState<{ a: uint64; b: bytes }>()

  @abimethod({ allowActions: 'OptIn' })
  optIn() {}

  public setState({ a, b }: { a: uint64; b: bytes }, c: SampleArray) {
    this.localUint(Txn.sender).value = a
    this.localUint2(Txn.sender).value = a
    this.localBytes(Txn.sender).value = b
    this.localBytes2(Txn.sender).value = b
    this.localEncoded(Txn.sender).value = c.copy()
    this.localTuple(Txn.sender).value = [a, b]
    this.localObject(Txn.sender).value = { a, b }
  }

  public getState() {
    return {
      localUint: this.localUint(Txn.sender).value,
      localUint2: this.localUint2(Txn.sender).value,
      localBytes: this.localBytes(Txn.sender).value,
      localBytes2: this.localBytes2(Txn.sender).value,
      localEncoded: this.localEncoded(Txn.sender).value.copy(),
      localTuple: this.localTuple(Txn.sender).value,
      localObject: this.localObject(Txn.sender).value,
    }
  }

  public clearState() {
    this.localUint(Txn.sender).delete()
    this.localUint2(Txn.sender).delete()
    this.localBytes(Txn.sender).delete()
    this.localBytes2(Txn.sender).delete()
    this.localEncoded(Txn.sender).delete()
    this.localTuple(Txn.sender).delete()
    this.localObject(Txn.sender).delete()
  }
}
