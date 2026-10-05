// This file is auto-generated, do not modify
/* eslint-disable */
import { Contract, abimethod, arc4, err } from '@algorandfoundation/algorand-typescript'

export class Entry extends arc4.Struct<{
  id: arc4.Uint<64>
  balance: arc4.Uint<64>
}> {}

export abstract class First extends Contract {
  @abimethod()
  label(): arc4.Str {
    err('stub only')
  }

  @abimethod()
  getEmpty(id: arc4.Uint<64>): Entry {
    err('stub only')
  }

  @abimethod()
  describe(): arc4.Str {
    err('stub only')
  }
}
