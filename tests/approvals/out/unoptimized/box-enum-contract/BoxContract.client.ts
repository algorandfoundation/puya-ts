// This file is auto-generated, do not modify
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class BoxContract extends Contract {
  @abimethod()
  store_enums(): void {
    err('stub only')
  }

  @abimethod()
  read_enums(): arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>]> {
    err('stub only')
  }
}
