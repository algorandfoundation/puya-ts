// This file is auto-generated, do not modify
import { Contract, abimethod, arc4, err } from '@algorandfoundation/algorand-typescript'

export class Object7D615236 extends arc4.Struct<{
  exists: arc4.Bool
  expired: arc4.Bool
  hasCooldown: arc4.Bool
  onCooldown: arc4.Bool
  hasMethodRestrictions: arc4.Bool
}> {}

export class ObjectCB267EF3 extends arc4.Struct<{
  useRounds: arc4.Bool
  lastValid: arc4.Uint<64>
  cooldown: arc4.Uint<64>
  lastCalled: arc4.Uint<64>
  exists: arc4.Bool
  hasMethodRestrictions: arc4.Bool
}> {}

export abstract class Arc4BoolAlgo extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test(p: ObjectCB267EF3): Object7D615236 {
    err('stub only')
  }
}
