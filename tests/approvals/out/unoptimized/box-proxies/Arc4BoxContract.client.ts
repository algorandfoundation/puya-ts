// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class Arc4BoxContract extends Contract {
  @abimethod
  setBoxes(
    a: arc4.Uint<64>,
    b: arc4.DynamicBytes,
    c: arc4.Str,
  ): void {
    err('stub only')
  }

  @abimethod
  checkKeys(): void {
    err('stub only')
  }

  @abimethod
  createManyInts(): void {
    err('stub only')
  }

  @abimethod
  setManyInts(
    index: arc4.Uint<64>,
    value: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod
  sumManyInts(): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod
  deleteBoxes(): void {
    err('stub only')
  }

  @abimethod
  indirectExtractAndReplace(): void {
    err('stub only')
  }

  @abimethod
  readBoxes(): arc4.Tuple<readonly [arc4.Uint<64>, arc4.DynamicBytes, arc4.Str, arc4.Uint<64>]> {
    err('stub only')
  }

  @abimethod
  boxesExist(): arc4.Tuple<readonly [arc4.Bool, arc4.Bool, arc4.Bool, arc4.Bool]> {
    err('stub only')
  }

  @abimethod
  sliceBox(): void {
    err('stub only')
  }

  @abimethod
  arc4Box(): void {
    err('stub only')
  }

  @abimethod
  testBoxRef(): void {
    err('stub only')
  }

  @abimethod
  createBools(): void {
    err('stub only')
  }

  @abimethod
  setBool(
    index: arc4.Uint<64>,
    value: arc4.Bool,
  ): void {
    err('stub only')
  }

  @abimethod
  sumBools(stopAtTotal: arc4.Uint<64>): arc4.Uint<64> {
    err('stub only')
  }
}
