// This file is auto-generated, do not modify
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class NoBare extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  handleNoop(): void {
    err('stub only')
  }
}
