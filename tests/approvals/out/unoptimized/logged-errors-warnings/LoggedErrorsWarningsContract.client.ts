// This file is auto-generated, do not modify
/* eslint-disable */
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class LoggedErrorsWarningsContract extends Contract {
  @abimethod()
  testInvalidCode(arg: arc4.Uint<64>): void {
    err('stub only')
  }

  @abimethod()
  testCamelCaseCode(arg: arc4.Uint<64>): void {
    err('stub only')
  }

  @abimethod()
  testAERPrefix(arg: arc4.Uint<64>): void {
    err('stub only')
  }

  @abimethod()
  testLongMessage(arg: arc4.Uint<64>): void {
    err('stub only')
  }

  @abimethod()
  test8ByteMessage(arg: arc4.Uint<64>): void {
    err('stub only')
  }

  @abimethod()
  test32ByteMessage(arg: arc4.Uint<64>): void {
    err('stub only')
  }
}
