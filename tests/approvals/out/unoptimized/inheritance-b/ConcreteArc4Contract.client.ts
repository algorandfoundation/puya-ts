// This file is auto-generated, do not modify
/* eslint-disable */
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class ConcreteArc4Contract extends Contract {
  @abimethod()
  getVeryImportantValue(): arc4.Str {
    err('stub only')
  }

  @abimethod()
  simpleAbiMethod(
    a: arc4.Uint<64>,
    b: arc4.Uint<64>,
  ): arc4.Uint<64> {
    err('stub only')
  }
}
