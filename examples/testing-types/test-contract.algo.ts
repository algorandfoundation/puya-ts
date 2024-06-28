import { Contract, GlobalState, Uint64, uint64, Bytes } from '@algorandfoundation/algo-ts'

class MyContract extends Contract {
  // example = GlobalState<uint64>()
  //
  // public demo() {
  //   return this.example.value
  // }

  public demo(): uint64 {
    const e = GlobalState({ initialValue: Uint64(3), key: Bytes`boo` })

    return e.value + this.other()
  }

  public other() {
    return Uint64(3)
  }
}
