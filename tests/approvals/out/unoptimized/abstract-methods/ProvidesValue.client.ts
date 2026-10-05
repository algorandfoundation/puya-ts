// This file is auto-generated, do not modify
/* eslint-disable */
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class ProvidesValue extends Contract {
  @abimethod()
  value(): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod()
  fromPrototype(): arc4.Uint<64> {
    err('stub only')
  }
}
