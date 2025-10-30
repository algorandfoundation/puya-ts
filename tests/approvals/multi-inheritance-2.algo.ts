import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, GlobalState } from '@algorandfoundation/algorand-typescript'
import { classes } from 'polytype'

class StoreString extends Contract {
  stringStore = GlobalState<string>()

  setStore(value: string) {
    this.stringStore.value = value
  }
}

class StoreUint64 extends Contract {
  uint64Store = GlobalState<uint64>()

  setStore(value: uint64) {
    this.uint64Store.value = value
  }
}

class StoreBoth extends classes(StoreString, StoreUint64) {
  test(theString: string, theUint: uint64) {
    // setStore resolved from first base type
    this.setStore(theString)

    // Can explicitly resolve from other base type with .class
    super.class(StoreUint64).setStore(theUint)
  }
}
