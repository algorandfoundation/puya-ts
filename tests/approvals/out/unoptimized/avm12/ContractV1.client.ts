// This file is auto-generated, do not modify
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class ContractV1 extends Contract {
  @abimethod({ onCreate: 'require' })
  delete(): void {
    err('stub only')
  }
}
