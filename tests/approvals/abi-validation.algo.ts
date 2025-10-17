import type { bytes } from '@algorandfoundation/algorand-typescript'
import { abimethod, Contract } from '@algorandfoundation/algorand-typescript'

class AbiValidationAlgo extends Contract {
  @abimethod({ validateInputs: true })
  withValidation(value: bytes<32>) {
    return value.length
  }
  @abimethod({ validateInputs: false })
  withoutValidation(value: bytes<32>) {
    return value.length
  }

  defaultValidation(value: bytes<32>) {
    return value.length
  }
}
