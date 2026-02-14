// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class DemoContract extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test(): arc4.Bool {
    err('stub only')
  }
}
