// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class AbiValidationAlgo extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  withValidation(value: arc4.StaticArray<arc4.Byte, 32>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  withoutValidation(value: arc4.StaticArray<arc4.Byte, 32>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  defaultValidation(value: arc4.StaticArray<arc4.Byte, 32>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  manualValidation(value: arc4.StaticArray<arc4.Byte, 32>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  manualValidationInConvert(rawBytes: arc4.DynamicBytes): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  manualValidationAfterConvert(rawBytes: arc4.DynamicBytes): arc4.Uint<64> {
    err('stub only')
  }
}
