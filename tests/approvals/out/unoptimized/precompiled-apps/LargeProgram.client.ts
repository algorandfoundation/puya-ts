// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class LargeProgram extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  getBigBytesLength(): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  delete(): void {
    err('stub only')
  }
}
