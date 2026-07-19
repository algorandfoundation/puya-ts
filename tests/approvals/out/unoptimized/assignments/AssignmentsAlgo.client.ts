// This file is auto-generated, do not modify
/* eslint-disable */
import { Contract, abimethod, arc4, err } from '@algorandfoundation/algorand-typescript'

export class Object3C0E3B9F extends arc4.Struct<{
  balance: arc4.Uint<64>
  minBalance: arc4.Uint<64>
}> {}

export class Object3EB715E7 extends arc4.Struct<{
  a: arc4.Uint<64>
  b: arc4.Str
}> {}

export class ReadonlyObject3EB715E7 extends arc4.Struct<{
  a: arc4.Uint<64>
  b: arc4.Str
}> {}

export abstract class AssignmentsAlgo extends Contract {
  @abimethod()
  testPrimitives(u: arc4.Uint<64>): void {
    err('stub only')
  }

  @abimethod()
  testAccountDestructure(): Object3C0E3B9F {
    err('stub only')
  }

  @abimethod()
  testArrayDestructure(
    i_a: arc4.DynamicArray<arc4.Uint<64>>,
    u: arc4.Uint<64>,
    m_a: arc4.DynamicArray<arc4.Uint<64>>,
  ): void {
    err('stub only')
  }

  @abimethod()
  testArrayNarrowing(
    m_a: arc4.DynamicArray<arc4.Uint<64>>,
    u: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod()
  testTupleToArray(
    m_t: arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>]>,
    i_t: arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>]>,
  ): void {
    err('stub only')
  }

  @abimethod()
  testNested(i_a: arc4.DynamicArray<arc4.DynamicArray<arc4.Uint<64>>>): void {
    err('stub only')
  }

  @abimethod()
  testDestructureObj(
    m: Object3EB715E7,
    i: ReadonlyObject3EB715E7,
  ): void {
    err('stub only')
  }

  @abimethod()
  testObjLiteralNarrowing(
    a: arc4.Uint<64>,
    b: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod()
  testMixed(m: arc4.DynamicArray<arc4.Tuple<readonly [arc4.Tuple<readonly [arc4.Uint<64>]>]>>): void {
    err('stub only')
  }
}
