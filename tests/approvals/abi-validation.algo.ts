import type { bytes } from '@algorandfoundation/algorand-typescript'
import { abimethod, Contract } from '@algorandfoundation/algorand-typescript'
import type { StaticBytes } from '@algorandfoundation/algorand-typescript/arc4'
import { interpretAsArc4 } from '@algorandfoundation/algorand-typescript/arc4'

class AbiValidationAlgo extends Contract {
  @abimethod({ validateInputs: true })
  withValidation(value: StaticBytes<32>) {
    return value.bytes.length
  }

  @abimethod({ validateInputs: false })
  withoutValidation(value: StaticBytes<32>) {
    return value.bytes.length
  }

  defaultValidation(value: StaticBytes<32>) {
    return value.bytes.length
  }

  manualValidationAfterConvert(rawBytes: bytes) {
    const value = interpretAsArc4<StaticBytes<32>>(rawBytes)
    value.validate()
    return value.bytes.length
  }
}
