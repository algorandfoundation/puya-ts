// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class UrangeAlgo extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testSingleArg(): arc4.DynamicArray<arc4.Uint<64>> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testTwoArg(): arc4.DynamicArray<arc4.Uint<64>> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testThreeArg(): arc4.DynamicArray<arc4.Uint<64>> {
    err('stub only')
  }
}
