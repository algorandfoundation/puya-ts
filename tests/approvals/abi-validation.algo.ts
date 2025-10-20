import type { bytes } from '@algorandfoundation/algorand-typescript'
import { abimethod, Contract, validateEncoding } from '@algorandfoundation/algorand-typescript'
import type { StaticBytes } from '@algorandfoundation/algorand-typescript/arc4'
import { interpretAsArc4 } from '@algorandfoundation/algorand-typescript/arc4'

class AbiValidationAlgo extends Contract {
  @abimethod({ validateEncoding: 'args' })
  withValidation(value: StaticBytes<32>) {
    return value.bytes.length
  }

  @abimethod({ validateEncoding: 'unsafe-disabled' })
  withoutValidation(value: StaticBytes<32>) {
    return value.bytes.length
  }

  defaultValidation(value: StaticBytes<32>) {
    return value.bytes.length
  }

  manualValidationAfterConvert(rawBytes: bytes) {
    const value = interpretAsArc4<StaticBytes<32>>(rawBytes)
    validateEncoding(value)
    return value.bytes.length
  }
}
