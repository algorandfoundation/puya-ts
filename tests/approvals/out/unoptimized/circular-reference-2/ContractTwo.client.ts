// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class ContractTwo extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test(appId: arc4.Uint<64>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test2(): arc4.StaticArray<arc4.Byte, 4> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test3(appId: arc4.Uint<64>): void {
    err('stub only')
  }
}
