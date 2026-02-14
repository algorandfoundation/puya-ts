// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class SubAbi2 extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  someMethod(): arc4.Str {
    err('stub only')
  }
}
