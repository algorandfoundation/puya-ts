import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { arc4, assert, Box, BoxMap, clone, Contract, log } from '@algorandfoundation/algorand-typescript'
import { convertBytes, methodSelector, Struct, Uint } from '@algorandfoundation/algorand-typescript/arc4'

type ARC4Uint64 = Uint<64>
const ARC4Uint64 = Uint<64>

class Vector extends Struct<{ x: ARC4Uint64; y: ARC4Uint64 }> {}

class StructDemo extends Contract {
  public testVectorCreationAndEquality() {
    const v1 = new Vector({ x: new ARC4Uint64(0), y: new ARC4Uint64(0) })
    log(v1.x)
    log(v1.y)
    const v2 = new Vector({ y: new ARC4Uint64(0), x: new ARC4Uint64(0) })
    assert(v1 === v2)
  }

  public addVectors(v1: Vector, v2: Vector) {
    return new Vector({
      x: new ARC4Uint64(v1.x.asUint64() + v2.x.asUint64()),
      y: new ARC4Uint64(v1.y.asUint64() + v2.y.asUint64()),
    })
  }

  public mutateVector(v1: Vector, newX: ARC4Uint64, newY: ARC4Uint64): Vector {
    v1.x = newX
    v1.y = newY
    return v1
  }

  public implicitCastingAndSpreading(v1: Vector) {
    const v2 = new Vector(v1)
    const v3 = new Vector({ ...v2 })
    assert(v1.bytes === v2.bytes)
    assert(v3.bytes === v1.bytes)
  }

  public toAndFromBytes(v1: Vector): Vector {
    const v1_bytes = v1.bytes
    return convertBytes<Vector>(v1_bytes, { strategy: 'unsafe-cast' })
  }

  public toNative(v1: Vector) {
    return v1.native
  }

  plugins = BoxMap<string, PluginInfo>({ keyPrefix: 'plugins' })

  plugin = Box<PluginInfo>({ key: 'main' })

  public getPlugin(key: string): PluginInfo {
    const value = clone(this.plugins(key).value)
    assert(value.lastCalled.asUint64() > 0, 'Last called not zero')
    return value
  }

  public getMain() {
    const value = clone(this.plugin.value)
    assert(value.lastCalled.asUint64() > 0, 'Last called not zero')
    return value
  }

  public setLastCalled(key: string, index: uint64, lastCalled: uint64) {
    this.plugins(key).value.methods[index].lastCalled = new arc4.Uint64(lastCalled)
  }

  public setPlugin(key: string) {
    this.plugins(key).value = new PluginInfo({
      lastValidRound: new arc4.Uint64(1),
      cooldown: new arc4.Uint64(),
      lastCalled: new arc4.Uint64(),
      adminPrivileges: new arc4.Bool(false),
      methods: new arc4.DynamicArray(
        new MethodInfo({
          selector: new arc4.StaticBytes(methodSelector('test()void')),
          cooldown: new arc4.Uint64(1),
          lastCalled: new arc4.Uint64(1),
        }),
      ),
    })
  }
}

export class PluginInfo extends arc4.Struct<{
  /** The last round at which this plugin can be called */
  lastValidRound: arc4.Uint64
  /** The number of rounds that must pass before the plugin can be called again */
  cooldown: arc4.Uint64
  /** The last round the plugin was called */
  lastCalled: arc4.Uint64
  /** Whether the plugin has permissions to change the admin account */
  adminPrivileges: arc4.Bool
  /** The methods that are allowed to be called for the plugin by the address */
  methods: arc4.DynamicArray<MethodInfo>
}> {}

export class MethodInfo extends arc4.Struct<{
  /** The method signature */
  selector: arc4.StaticBytes<4>
  /** The number of rounds that must pass before the method can be called again */
  cooldown: arc4.Uint64
  /** The last round the method was called */
  lastCalled: arc4.Uint64
}> {}
