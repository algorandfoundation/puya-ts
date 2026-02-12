// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class DemoContract extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  run(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test_side_effects(n: arc4.Uint<64>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test_non_trivial_termination_of_clause(
    n: arc4.Uint<64>,
    y: arc4.Uint<64>,
  ): arc4.Uint<64> {
    err('stub only')
  }
}
