// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class Arc4BoxContract extends Contract {
  @abimethod({ onCreate: 'require' })
  setBoxes(
    a: arc4.Uint<64>,
    b: arc4.DynamicBytes,
    c: arc4.Str,
  ): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  checkKeys(): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  createManyInts(): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  setManyInts(
    index: arc4.Uint<64>,
    value: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  sumManyInts(): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  deleteBoxes(): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  indirectExtractAndReplace(): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  readBoxes(): arc4.Tuple<readonly [arc4.Uint<64>, arc4.DynamicBytes, arc4.Str, arc4.Uint<64>]> {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  boxesExist(): arc4.Tuple<readonly [arc4.Bool, arc4.Bool, arc4.Bool, arc4.Bool]> {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  sliceBox(): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  arc4Box(): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  testBoxRef(): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  createBools(): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  setBool(
    index: arc4.Uint<64>,
    value: arc4.Bool,
  ): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  sumBools(stopAtTotal: arc4.Uint<64>): arc4.Uint<64> {
    err('stub only')
  }
}
