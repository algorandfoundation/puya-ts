// This file is auto-generated, do not modify
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class ExplicitAbiCreateFromBase extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  create(): void {
    err('stub only')
  }
}
