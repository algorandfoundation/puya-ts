// This file is auto-generated, do not modify
/* eslint-disable */
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class SubAbi extends Contract {
  @abimethod({ allowActions: ['OptIn'] })
  someMethod(): arc4.Str {
    err('stub only')
  }
}
