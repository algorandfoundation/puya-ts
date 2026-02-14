// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class ForLoopsAlgo extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test_for_loop(
    start: arc4.Uint<64>,
    stop: arc4.Uint<64>,
    step: arc4.Uint<64>,
  ): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test_for_loop_break(
    start: arc4.Uint<64>,
    stop: arc4.Uint<64>,
    step: arc4.Uint<64>,
  ): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test_for_loop_continue(
    start: arc4.Uint<64>,
    stop: arc4.Uint<64>,
    step: arc4.Uint<64>,
  ): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test_for_loop_labelled(
    start: arc4.Uint<64>,
    stop: arc4.Uint<64>,
    step: arc4.Uint<64>,
  ): arc4.Uint<64> {
    err('stub only')
  }
}
