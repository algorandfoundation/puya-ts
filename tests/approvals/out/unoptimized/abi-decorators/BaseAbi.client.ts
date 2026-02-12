// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class BaseAbi extends Contract {
  @abimethod({ onCreate: 'require' })
  someMethod(): arc4.Str {
    err('stub only')
  }
}
