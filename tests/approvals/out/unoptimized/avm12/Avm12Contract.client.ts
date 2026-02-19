// This file is auto-generated, do not modify
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class Avm12Contract extends Contract {
  @abimethod({ onCreate: 'require' })
  testFalconVerify(): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  testRejectVersion(): void {
    err('stub only')
  }
}
