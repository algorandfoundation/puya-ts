// This file is auto-generated, do not modify
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class AbiValidationAlgo extends Contract {
  @abimethod
  withValidation(value: arc4.StaticArray<arc4.Byte, 32>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod
  withoutValidation(value: arc4.StaticArray<arc4.Byte, 32>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod
  defaultValidation(value: arc4.StaticArray<arc4.Byte, 32>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod
  manualValidation(value: arc4.StaticArray<arc4.Byte, 32>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod
  manualValidationInConvert(rawBytes: arc4.DynamicBytes): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod
  manualValidationAfterConvert(rawBytes: arc4.DynamicBytes): arc4.Uint<64> {
    err('stub only')
  }
}
