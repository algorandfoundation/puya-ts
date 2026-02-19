// This file is auto-generated, do not modify
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class ForLoopsAlgo extends Contract {
  @abimethod
  test_for_loop(
    start: arc4.Uint<64>,
    stop: arc4.Uint<64>,
    step: arc4.Uint<64>,
  ): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod
  test_for_loop_break(
    start: arc4.Uint<64>,
    stop: arc4.Uint<64>,
    step: arc4.Uint<64>,
  ): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod
  test_for_loop_continue(
    start: arc4.Uint<64>,
    stop: arc4.Uint<64>,
    step: arc4.Uint<64>,
  ): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod
  test_for_loop_labelled(
    start: arc4.Uint<64>,
    stop: arc4.Uint<64>,
    step: arc4.Uint<64>,
  ): arc4.Uint<64> {
    err('stub only')
  }
}
