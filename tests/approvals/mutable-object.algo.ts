import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { arc4, assert, assertMatch, Box, BoxMap, clone, Contract, log } from '@algorandfoundation/algorand-typescript'
import { encodeArc4, methodSelector, UintN } from '@algorandfoundation/algorand-typescript/arc4'

type ARC4Uint64 = UintN<64>
const ARC4Uint64 = UintN<64>

type Vector = { x: uint64; y: uint64 }
type Point = { y: uint64; x: uint64 }
type VectorPoint = { v: Vector; p: Point }

export class MutableObjectDemo extends Contract {
  public testVectorCreationAndEquality() {
    const v1: Vector = { y: 1, x: 0 }
    log(v1.x)
    log(v1.y)
    const v2: Vector = { y: 1, x: 0 }
    assertMatch(v1, v2)
  }

  public addVectors(v1: Vector, v2: Vector): Vector {
    return {
      x: v1.x + v2.x,
      y: v1.y + v2.y,
    }
  }

  public mutateVector(v1: Vector, newX: uint64, newY: uint64): Vector {
    v1.x = newX
    v1.y = newY
    return v1
  }

  public implicitCastingAndSpreading(v1: Vector) {
    const v2 = clone(v1)
    const v3 = { ...v2 }
    assert(v1.x === v2.x)
    assert(v1.y === v2.y)
    assertMatch(v1, v2)
    assert(v3.x === v1.x)
    assert(v3.y === v1.y)
    assertMatch(v3, v1)

    const { x, y } = v3
    assert(x === v3.x)
    assert(y === v3.y)
  }

  public testNestedObjects(vp: VectorPoint) {
    const v1 = { x: vp.v.x, y: vp.v.y }
    const p1 = { x: vp.p.x, y: vp.p.y }
    const vp1 = { v: clone(v1), p: clone(p1) }
    log(vp1.v.x)
    log(vp1.v.y)
    log(vp1.p.x)
    log(vp1.p.y)
    assertMatch(vp1, vp)
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
    const obj: Vector = {
      y: (b = x * 2),
      x: b,
    }
    assertMatch(obj, {
      y: x * 2,
      x: x * 2,
    })
    const v = { y: obj.y, x: obj.x }

    assertMatch(obj, { x: v.x, y: v.y })
    assertMatch(obj, { y: { greaterThan: x } })
    assertMatch(obj, { x: { greaterThan: x } })
  }

  testArc4Encoding(p: Point) {
    assert(p.x !== p.y, 'For the purpose of this test, a should not equal b')
    const obj: Vector = {
      x: p.x,
      y: p.y,
    }
    const pEncoded = encodeArc4(p)
    const objEncoded = encodeArc4(obj)
    assert(pEncoded === objEncoded.slice(8).concat(objEncoded.slice(0, 8)), 'Encoded order should be swapped')
  }

  plugins = BoxMap<string, PluginInfo>({ keyPrefix: 'plugins' })

  plugin = Box<PluginInfo>({ key: 'main' })

  public getPlugin(key: string): PluginInfo {
    const value = clone(this.plugins(key).value)
    assert(value.lastCalled.native > 0, 'Last called not zero')
    return value
  }

  public getMain() {
    const value = clone(this.plugin.value)
    assert(value.lastCalled.native > 0, 'Last called not zero')
    return value
  }

  // public setLastCalled(key: string, index: uint64, lastCalled: uint64) {
  //   this.plugins(key).value.methods[index].lastCalled = new arc4.UintN64(lastCalled)
  // }

  public setPlugin(key: string) {
    this.plugins(key).value = {
      lastValidRound: new arc4.UintN64(1),
      cooldown: new arc4.UintN64(),
      lastCalled: new arc4.UintN64(),
      adminPrivileges: new arc4.Bool(false),
      methods: [
        {
          selector: new arc4.StaticBytes(methodSelector('test()void')),
          cooldown: new arc4.UintN64(1),
          lastCalled: new arc4.UintN64(1),
        },
      ],
    }
  }
}

type PluginInfo = {
  /** The last round at which this plugin can be called */
  lastValidRound: arc4.UintN64
  /** The number of rounds that must pass before the plugin can be called again */
  cooldown: ARC4Uint64
  /** The last round the plugin was called */
  lastCalled: arc4.UintN64
  /** Whether the plugin has permissions to change the admin account */
  adminPrivileges: arc4.Bool
  /** The methods that are allowed to be called for the plugin by the address */
  methods: MethodInfo[]
}

type MethodInfo = {
  /** The method signature */
  selector: arc4.StaticBytes<4>
  /** The number of rounds that must pass before the method can be called again */
  cooldown: ARC4Uint64
  /** The last round the method was called */
  lastCalled: arc4.UintN64
}
