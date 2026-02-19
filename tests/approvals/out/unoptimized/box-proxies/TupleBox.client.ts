// This file is auto-generated, do not modify
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class TupleBox extends Contract {
  @abimethod({ onCreate: 'require' })
  testBox(): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  testBoxMap(): void {
    err('stub only')
  }
}
