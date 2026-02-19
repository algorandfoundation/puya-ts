// This file is auto-generated, do not modify
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class LargeBox extends Contract {
  @abimethod({ onCreate: 'require' })
  test(): void {
    err('stub only')
  }
}
