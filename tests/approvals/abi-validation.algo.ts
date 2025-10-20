import type { bytes } from '@algorandfoundation/algorand-typescript'
import { abimethod, Contract, validate } from '@algorandfoundation/algorand-typescript'
import type { StaticBytes } from '@algorandfoundation/algorand-typescript/arc4'
import { convertBytes } from '@algorandfoundation/algorand-typescript/arc4'

class AbiValidationAlgo extends Contract {
  @abimethod({ validateEncoding: 'args' })
  withValidation(value: bytes<32>) {
    return value.length
  }
  @abimethod({ validateEncoding: 'unsafe-disabled' })
  withoutValidation(value: bytes<32>) {
    return value.length
  }

  defaultValidation(value: bytes<32>) {
    return value.length
  }

  manualValidationInConvert(rawBytes: bytes) {
    const value = convertBytes<StaticBytes<32>>(rawBytes, { strategy: 'validate' })
    return value.length
  }

  manualValidationAfterConvert(rawBytes: bytes) {
    const value = convertBytes<StaticBytes<32>>(rawBytes, { strategy: 'unsafe-cast' })
    validate(value)
    return value.length
  }
}
