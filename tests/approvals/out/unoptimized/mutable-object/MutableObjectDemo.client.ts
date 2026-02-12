// This file is auto-generated, do not modify
import { Contract, abimethod, arc4, err } from '@algorandfoundation/algorand-typescript'

export class Vector extends arc4.Struct<{
  x: arc4.Uint<64>
  y: arc4.Uint<64>
}> {}

export class Point extends arc4.Struct<{
  y: arc4.Uint<64>
  x: arc4.Uint<64>
}> {}

export class VectorPoint extends arc4.Struct<{
  v: Vector
  p: Point
}> {}

export class PluginInfo extends arc4.Struct<{
  lastValidRound: arc4.Uint<64>
  cooldown: arc4.Uint<64>
  lastCalled: arc4.Uint<64>
  adminPrivileges: arc4.Bool
  methods: arc4.DynamicArray<arc4.Tuple<readonly [arc4.StaticArray<arc4.Byte, 4>, arc4.Uint<64>, arc4.Uint<64>]>>
}> {}

export abstract class MutableObjectDemo extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testVectorCreationAndEquality(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  addVectors(
    v1: Vector,
    v2: Vector,
  ): Vector {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  mutateVector(
    v1: Vector,
    newX: arc4.Uint<64>,
    newY: arc4.Uint<64>,
  ): Vector {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  implicitCastingAndSpreading(v1: Vector): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testNestedObjects(vp: VectorPoint): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testMethodSelector(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testAssertMatch(x: arc4.Uint<64>): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testArc4Encoding(p: Point): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  getPlugin(key: arc4.Str): PluginInfo {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  getMain(): PluginInfo {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  setPlugin(key: arc4.Str): void {
    err('stub only')
  }
}
