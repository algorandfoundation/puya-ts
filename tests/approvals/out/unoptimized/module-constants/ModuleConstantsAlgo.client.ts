// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class ModuleConstantsAlgo extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  getBoolConstants(): arc4.Tuple<readonly [arc4.Bool, arc4.Bool]> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  getUintConstants(): arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>, arc4.Uint<64>, arc4.Uint<64>, arc4.Uint<64>, arc4.Uint<64>, arc4.Uint<64>, arc4.Uint<64>, arc4.Uint<64>, arc4.Uint<64>, arc4.Uint<64>]> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  getBigUintConstants(): arc4.Tuple<readonly [arc4.Uint<512>, arc4.Uint<512>, arc4.Uint<512>, arc4.Uint<512>, arc4.Uint<512>, arc4.Uint<512>, arc4.Uint<512>, arc4.Uint<512>]> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  getStringConstants(): arc4.DynamicArray<arc4.Str> {
    err('stub only')
  }
}
