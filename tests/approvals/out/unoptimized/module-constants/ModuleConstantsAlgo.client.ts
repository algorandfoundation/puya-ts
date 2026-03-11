// This file is auto-generated, do not modify
/* eslint-disable */
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class ModuleConstantsAlgo extends Contract {
  @abimethod()
  getBoolConstants(): arc4.Tuple<readonly [arc4.Bool, arc4.Bool]> {
    err('stub only')
  }

  @abimethod()
  getUintConstants(): arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>, arc4.Uint<64>, arc4.Uint<64>, arc4.Uint<64>, arc4.Uint<64>, arc4.Uint<64>, arc4.Uint<64>, arc4.Uint<64>, arc4.Uint<64>, arc4.Uint<64>]> {
    err('stub only')
  }

  @abimethod()
  getBigUintConstants(): arc4.Tuple<readonly [arc4.Uint<512>, arc4.Uint<512>, arc4.Uint<512>, arc4.Uint<512>, arc4.Uint<512>, arc4.Uint<512>, arc4.Uint<512>, arc4.Uint<512>]> {
    err('stub only')
  }

  @abimethod()
  getStringConstants(): arc4.DynamicArray<arc4.Str> {
    err('stub only')
  }
}
