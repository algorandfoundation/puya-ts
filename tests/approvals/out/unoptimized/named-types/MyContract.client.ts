// This file is auto-generated, do not modify
/* eslint-disable */
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
  @abimethod()
  getXY(): XY {
    err('stub only')
  }

  @abimethod()
  getYX(): YX {
    err('stub only')
  }

  @abimethod()
  getAnon(): ReadonlyObjectDC5110F2 {
    err('stub only')
  }

  @abimethod()
  test(
    x: XY,
    y: YX,
  ): void {
    err('stub only')
  }

  @abimethod()
  testing(): arc4.Tuple<readonly [arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>]>, arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>]>, arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>]>]> {
    err('stub only')
  }
}
