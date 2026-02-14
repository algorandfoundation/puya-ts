// This file is auto-generated, do not modify
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class SingleEvalAlgo extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test(): void {
    err('stub only')
  }
}
