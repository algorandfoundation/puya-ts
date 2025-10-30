import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, arc4, assert, clone, Contract, Global, LocalState, Txn } from '@algorandfoundation/algorand-typescript'
import type { StaticArray, Uint } from '@algorandfoundation/algorand-typescript/arc4'

type SampleArray = StaticArray<Uint<64>, 10>
type Data = { a: uint64; b: bytes; c: boolean; d: arc4.Str }

export class LocalStateDemo extends Contract {
  localUint = LocalState<uint64>({ key: 'l1' })
  localUint2 = LocalState<uint64>()
  localBytes = LocalState<bytes>({ key: 'b1' })
  localBytes2 = LocalState<bytes>()
  localEncoded = LocalState<SampleArray>()
  localTuple = LocalState<readonly [uint64, bytes]>()
  localObject = LocalState<Readonly<{ a: uint64; b: bytes }>>()
  localMutableObject = LocalState<Data>()

  @abimethod({ allowActions: 'OptIn' })
  optIn() {}

  public setState({ a, b }: { a: uint64; b: bytes }, c: SampleArray) {
    this.localUint(Txn.sender).value = a
    this.localUint2(Txn.sender).value = a
    this.localBytes(Txn.sender).value = b
    this.localBytes2(Txn.sender).value = b
    this.localEncoded(Txn.sender).value = clone(c)
    this.localTuple(Txn.sender).value = [a, b]
    this.localObject(Txn.sender).value = { a, b }
    this.localMutableObject(Txn.sender).value = { a, b, c: true, d: new arc4.Str('hello') }
  }

  public getState() {
    return {
      localUint: this.localUint(Txn.sender).value,
      localUint2: this.localUint2(Txn.sender).value,
      localBytes: this.localBytes(Txn.sender).value,
      localBytes2: this.localBytes2(Txn.sender).value,
      localEncoded: clone(this.localEncoded(Txn.sender).value),
      localTuple: this.localTuple(Txn.sender).value,
      localObject: this.localObject(Txn.sender).value,
      localMutableObject: clone(this.localMutableObject(Txn.sender).value),
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
    this.localMutableObject(Txn.sender).delete()
  }

  /**
   * Writes a value to local state using a dynamic key.
   * Demonstrates dynamic key-value storage in local state.
   * @param key - The dynamic key to store the value under
   * @param value - The string value to store
   * @returns The stored string value
   */
  @arc4.abimethod()
  public writeDynamicLocalState(key: string, value: string): string {
    const sender = Txn.sender
    assert(sender.isOptedIn(Global.currentApplicationId), 'Account must opt in to contract first')

    const localDynamicAccess = LocalState<string>({ key })

    localDynamicAccess(sender).value = value

    assert(localDynamicAccess(sender).value === value)

    return localDynamicAccess(sender).value
  }

  /**
   * Reads a value from local state using a dynamic key.
   * @param key - The dynamic key to read the value from
   * @returns The stored string value for the given key
   */
  @arc4.abimethod()
  public readDynamicLocalState(key: string): string {
    const sender = Txn.sender

    assert(sender.isOptedIn(Global.currentApplicationId), 'Account must opt in to contract first')

    const localDynamicAccess = LocalState<string>({ key })

    assert(localDynamicAccess(sender).hasValue, 'Key not found')

    return localDynamicAccess(sender).value
  }
}
