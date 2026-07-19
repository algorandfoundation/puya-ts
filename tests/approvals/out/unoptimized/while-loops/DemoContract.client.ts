// This file is auto-generated, do not modify
/* eslint-disable */
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class DemoContract extends Contract {
  @abimethod()
  testWhile(stop: arc4.Uint<64>): arc4.Uint<64> {
    err('stub only')
  }
}
