// This file is auto-generated, do not modify
/* eslint-disable */
import { Contract, abimethod, arc4, err } from '@algorandfoundation/algorand-typescript'

export class Object2E8A71EC extends arc4.Struct<{
  x: arc4.Uint<64>
}> {}

export abstract class TypeLevelDocMismatchContract extends Contract {
  @abimethod()
  forward(a: Object2E8A71EC): Object2E8A71EC {
    err('stub only')
  }
}
