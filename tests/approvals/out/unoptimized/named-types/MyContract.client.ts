// This file is auto-generated, do not modify
import { Contract, abimethod, arc4, err } from '@algorandfoundation/algorand-typescript'

export class XY extends arc4.Struct<{
  x: arc4.Uint<64>
  y: arc4.Uint<64>
}> {}

export class YX extends arc4.Struct<{
  y: arc4.Uint<64>
  x: arc4.Uint<64>
}> {}

export class ReadonlyObjectDC5110F2 extends arc4.Struct<{
  x: arc4.Uint<64>
  y: arc4.Uint<64>
}> {}

export abstract class MyContract extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  getXY(): XY {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  getYX(): YX {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  getAnon(): ReadonlyObjectDC5110F2 {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test(
    x: XY,
    y: YX,
  ): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testing(): arc4.Tuple<readonly [arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>]>, arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>]>, arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>]>]> {
    err('stub only')
  }
}
