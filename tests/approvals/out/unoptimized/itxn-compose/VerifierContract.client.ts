// This file is auto-generated, do not modify
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class VerifierContract extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  verify(): void {
    err('stub only')
  }
}
