import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { arc4, assert, assertMatch, Box, BoxMap, Contract, log, MutableObject } from '@algorandfoundation/algorand-typescript'
import { encodeArc4, methodSelector, UintN } from '@algorandfoundation/algorand-typescript/arc4'

type ARC4Uint64 = UintN<64>
const ARC4Uint64 = UintN<64>

class Vector extends MutableObject<{ x: uint64; y: uint64 }> {}
class Point extends MutableObject<{ y: uint64; x: uint64 }> {}
class VectorPoint extends MutableObject<{ v: Vector; p: Point }> {}

export class MutableObjectDemo extends Contract {
  public testVectorCreationAndEquality() {
    const v1 = new Vector({ x: 0, y: 1 })
    log(v1.x)
    log(v1.y)
    const v2 = new Vector({ y: 1, x: 0 })
    assert(v1 === v2)
  }

  public addVectors(v1: Vector, v2: Vector) {
    return new Vector({
      x: v1.x + v2.x,
      y: v1.y + v2.y,
    })
  }

  public mutateVector(v1: Vector, newX: uint64, newY: uint64): Vector {
    v1.x = newX
    v1.y = newY
    return v1
  }

  public implicitCastingAndSpreading(v1: Vector) {
    const v2 = new Vector(v1)
    const v3 = new Vector({ ...v2 })
    assert(v1.x === v2.x)
    assert(v1.y === v2.y)
    assert(v1 === v2)
    assert(v3.x === v1.x)
    assert(v3.y === v1.y)
    assert(v3 === v1)

    const { x, y } = v3
    assert(x === v3.x)
    assert(y === v3.y)
  }

  public testNestedObjects(vp: VectorPoint) {
    const v1 = new Vector({ x: vp.v.x, y: vp.v.y })
    const p1 = new Point({ x: vp.p.x, y: vp.p.y })
    const vp1 = new VectorPoint({ v: v1.copy(), p: p1.copy() })
    log(vp1.v.x)
    log(vp1.v.y)
    log(vp1.p.x)
    log(vp1.p.y)
    assert(vp1 === vp)
  }

  public testMethodSelector() {
    assert(
      methodSelector(MutableObjectDemo.prototype.mutateVector) ===
        methodSelector('mutateVector((uint64,uint64),uint64,uint64)(uint64,uint64)'),
    )
    assert(methodSelector(MutableObjectDemo.prototype.getPlugin) === methodSelector('getPlugin(string)(uint64,uint64,uint64,bool)'))
    assert(
      methodSelector(MutableObjectDemo.prototype.testNestedObjects) ===
        methodSelector('testNestedObjects(((uint64,uint64),(uint64,uint64)))void'),
    )
  }

  testAssertMatch(x: uint64) {
    let b: uint64
    const obj: Vector = new Vector({
      y: (b = x * 2),
      x: b,
    })
    assertMatch(obj, {
      y: x * 2,
      x: x * 2,
    })
    const v = new Point({ y: obj.y, x: obj.x })

    assertMatch(obj, { x: v.x, y: v.y })
    assertMatch(obj, { y: { greaterThan: x } })
    assertMatch(obj, { x: { greaterThan: x } })
  }

  testArc4Encoding(p: Point) {
    assert(p.x !== p.y, 'For the purpose of this test, a should not equal b')
    const obj: Vector = new Vector({
      x: p.x,
      y: p.y,
    })
    const pEncoded = encodeArc4(p)
    const objEncoded = encodeArc4(obj)
    assert(pEncoded === objEncoded.slice(8).concat(objEncoded.slice(0, 8)), 'Encoded order should be swapped')
  }

  plugins = BoxMap<string, PluginInfo>({ keyPrefix: 'plugins' })

  plugin = Box<PluginInfo>({ key: 'main' })

  public getPlugin(key: string): PluginInfo {
    const value = this.plugins(key).value.copy()
    assert(value.lastCalled.native > 0, 'Last called not zero')
    return value
  }

  public getMain() {
    const value = this.plugin.value.copy()
    assert(value.lastCalled.native > 0, 'Last called not zero')
    return value
  }

  // public setLastCalled(key: string, index: uint64, lastCalled: uint64) {
  //   this.plugins(key).value.methods[index].lastCalled = new arc4.UintN64(lastCalled)
  // }

  public setPlugin(key: string) {
    this.plugins(key).value = new PluginInfo({
      lastValidRound: new arc4.UintN64(1),
      cooldown: new arc4.UintN64(),
      lastCalled: new arc4.UintN64(),
      adminPrivileges: new arc4.Bool(false),
      // methods: new MutableArray(
      //   new MethodInfo({
      //     selector: new arc4.StaticBytes(methodSelector('test()void')),
      //     cooldown: new arc4.UintN64(1),
      //     lastCalled: new arc4.UintN64(1),
      //   }),
      // ),
    })
  }
}

export class PluginInfo extends MutableObject<{
  /** The last round at which this plugin can be called */
  lastValidRound: arc4.UintN64
  /** The number of rounds that must pass before the plugin can be called again */
  cooldown: ARC4Uint64
  /** The last round the plugin was called */
  lastCalled: arc4.UintN64
  /** Whether the plugin has permissions to change the admin account */
  adminPrivileges: arc4.Bool
  // TODO: add this property back in when mutable arrays are supported
  /** The methods that are allowed to be called for the plugin by the address */
  // methods: MutableArray<MethodInfo>
}> {}

export class MethodInfo extends MutableObject<{
  /** The method signature */
  selector: arc4.StaticBytes<4>
  /** The number of rounds that must pass before the method can be called again */
  cooldown: ARC4Uint64
  /** The last round the method was called */
  lastCalled: arc4.UintN64
}> {}
