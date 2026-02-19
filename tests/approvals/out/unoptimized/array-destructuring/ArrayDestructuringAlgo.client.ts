// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class ArrayDestructuringAlgo extends Contract {
  @abimethod
  testNested(arg: arc4.Tuple<readonly [arc4.Uint<64>, arc4.Tuple<readonly [arc4.Uint<512>, arc4.Uint<512>]>]>): arc4.Tuple<readonly [arc4.Uint<64>, arc4.Tuple<readonly [arc4.Uint<512>, arc4.Uint<512>]>, arc4.Uint<64>, arc4.Uint<512>]> {
    err('stub only')
  }

  @abimethod
  test(): void {
    err('stub only')
  }

  @abimethod
  testLiteralDestructuring(): void {
    err('stub only')
  }

  @abimethod
  produceFixed(): arc4.StaticArray<arc4.Uint<64>, 3> {
    err('stub only')
  }
}
