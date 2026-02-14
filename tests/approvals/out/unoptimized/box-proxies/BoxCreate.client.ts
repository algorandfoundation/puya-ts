// This file is auto-generated, do not modify
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class BoxCreate extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  createBoxes(): void {
    err('stub only')
  }
}
