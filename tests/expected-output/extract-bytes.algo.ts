import { assert, BaseContract, Bytes } from '@algorandfoundation/algorand-typescript'
import { extract } from '@algorandfoundation/algorand-typescript/op'

export class ExtractBytesAlgo extends BaseContract {
  approvalProgram(): boolean {
    this.test()
    return true
  }

  private test() {
    const b = Bytes('abcdefg')
    // @expect-error Extract with length=0 will always return an empty byte array. Omit length parameter to extract to the end of the sequence.
    assert(extract(b, 2, 0) === Bytes(''))
  }
}
