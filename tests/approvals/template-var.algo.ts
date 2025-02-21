import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, TemplateVar } from '@algorandfoundation/algorand-typescript'

export class MyContract extends Contract {
  getInt() {
    return TemplateVar<uint64>('AN_INT')
  }

  getString() {
    return TemplateVar<string>('A_STRING')
  }

  getBytes() {
    return TemplateVar<bytes>('SOME_BYTES')
  }
}
