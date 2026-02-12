// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class BoxContract extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  store_enums(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  read_enums(): arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>]> {
    err('stub only')
  }
}
