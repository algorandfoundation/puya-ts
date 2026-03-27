import { Contract, LocalMap, type uint64 } from '@algorandfoundation/algorand-typescript'

export class TestContract extends Contract {
  // @expect-error Type unknown cannot be used for storage
  unknownMap = LocalMap<string, unknown>()

  test() {
    // @expect-error Local map must have explicit key prefix provided if not being assigned to a contract property
    const mapNoKey = LocalMap<uint64, uint64>({})
  }
}
