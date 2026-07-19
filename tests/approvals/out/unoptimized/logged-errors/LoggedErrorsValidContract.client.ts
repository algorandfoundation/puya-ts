// This file is auto-generated, do not modify
/* eslint-disable */
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class LoggedErrorsValidContract extends Contract {
  @abimethod()
  testValid(arg: arc4.Uint<64>): void {
    err('stub only')
  }
}
