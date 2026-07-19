// This file is auto-generated, do not modify
/* eslint-disable */
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class MyContract extends Contract {
  @abimethod()
  getInt(): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod()
  getString(): arc4.Str {
    err('stub only')
  }

  @abimethod()
  getBytes(): arc4.DynamicBytes {
    err('stub only')
  }

  @abimethod()
  getAddress(): arc4.Address {
    err('stub only')
  }
}
