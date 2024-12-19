import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, GlobalState, LocalState } from '@algorandfoundation/algorand-typescript'
import { Struct, UintN } from '@algorandfoundation/algorand-typescript/arc4'

/**
 * This is the description for demo struct
 */
class DemoStruct extends Struct<{ a: UintN<64> }> {}

/**
 * This is the description for demo type
 */
type DemoType = {
  a: bytes
}

/**
 * This is the description for the contract
 */
export class JSDocDemo extends Contract {
  globalState = GlobalState<string>()
  localState = LocalState<uint64>()

  /**
   * This is the description of the method
   * @param a This is the description of 'a'
   * @param b This is the description of 'b'
   * @returns This is the description of the return value
   */
  test(a: uint64, b: bytes): DemoStruct {
    return new DemoStruct({ a: new UintN<64>(a) })
  }

  /**
   * This is the description of the method
   * @param a This is the description of 'a'
   * @returns This is the description of the return value
   */
  test2(a: bytes): DemoType {
    return {
      a,
    }
  }
}
