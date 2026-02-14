// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class ForOfLoopsAlgo extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test_for_of_loop_tuple(items: arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>, arc4.Uint<64>]>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test_for_of_loop_destructured_tuple(items: arc4.DynamicArray<arc4.Uint<64>>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test_for_of_loop_destructured_object(items: arc4.DynamicArray<arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>]>>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test_for_of_loop_arc4_dynamic_array(items: arc4.DynamicArray<arc4.Uint<64>>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test_for_of_loop_arc4_static_array(items: arc4.StaticArray<arc4.Uint<64>, 5>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test_for_of_loop_native_immutable_array(items: arc4.DynamicArray<arc4.Uint<64>>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test_for_of_loop_native_mutable_array(items: arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>, arc4.Uint<64>]>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test_iterable_props(
    static_array: arc4.StaticArray<arc4.Uint<64>, 3>,
    fixed_array: arc4.StaticArray<arc4.Uint<64>, 3>,
    dyn_array: arc4.DynamicArray<arc4.Uint<64>>,
  ): arc4.Uint<64> {
    err('stub only')
  }
}
