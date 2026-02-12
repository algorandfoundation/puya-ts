// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class ExtendsSubWithTotals extends Contract {
  @abimethod({ onCreate: 'require' })
  setState(n: arc4.Uint<64>): void {
    err('stub only')
  }
}
