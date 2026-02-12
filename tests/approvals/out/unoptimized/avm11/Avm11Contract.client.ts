// This file is auto-generated, do not modify
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class AVM11Contract extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testNewOps(): void {
    err('stub only')
  }
}
