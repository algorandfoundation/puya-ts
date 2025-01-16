import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, BaseContract, Bytes } from '@algorandfoundation/algorand-typescript'
import { extract } from '@algorandfoundation/algorand-typescript/op'

export class ExtractBytesAlgo extends BaseContract {
  approvalProgram(): boolean {
    this.test(2, 0)
    return true
  }

  private test(two: uint64, zero: uint64) {
    assert(two === 2, 'Param two should be 2')
    assert(zero === 0, 'Param zero should be 0')
    const b = Bytes('abcdefg')
    assert(extract(b, 2) === Bytes('cdefg'))
    assert(extract(b, two) === Bytes('cdefg'))

    assert(extract(b, 2, 2) === Bytes('cd'))
    assert(extract(b, two, two) === Bytes('cd'))

    assert(extract(b, two, zero) === Bytes(''))
  }
}
