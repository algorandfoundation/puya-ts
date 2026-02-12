// This file is auto-generated, do not modify
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class ContractV0 extends Contract {
  @abimethod({ onCreate: 'require' })
  update(): void {
    err('stub only')
  }
}
