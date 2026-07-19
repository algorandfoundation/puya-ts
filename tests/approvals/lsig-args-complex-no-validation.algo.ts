import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, BigUint, Bytes, clone, LogicSig, logicsig, op, Uint64 } from '@algorandfoundation/algorand-typescript'
import type { DynamicArray, StaticArray } from '@algorandfoundation/algorand-typescript/arc4'
import {
  Address,
  Uint64 as ARC4Uint64,
  Bool,
  Byte,
  convertBytes,
  DynamicBytes,
  Str,
  Struct,
  Tuple,
  Uint128,
  Uint8,
} from '@algorandfoundation/algorand-typescript/arc4'

class SimpleStruct extends Struct<{ x: ARC4Uint64; y: ARC4Uint64 }> {}

class NestedStruct extends Struct<{ header: Uint8; data: SimpleStruct }> {}

class SimpleNamedTuple extends Struct<{ a: Uint8; b: ARC4Uint64 }> {}

class OverwriteStruct extends Struct<{ value: Uint8; dontOverwriteMe: Bool }> {}

@logicsig({ validateEncoding: 'unsafe-disabled' })
export class ArgsComplexNoValidation extends LogicSig {
  program(
    arg0: uint64,
    arg1: bytes,
    arg2: biguint,
    arg3: string,
    arg4: boolean,
    arg5: Uint8,
    arg6: ARC4Uint64,
    arg7: Uint128,
    arg8: Address,
    arg9: Bool,
    arg10: Str,
    arg11: DynamicBytes,
    arg12: StaticArray<Byte, 4>,
    arg13: SimpleStruct,
    arg14: NestedStruct,
    arg15: Tuple<[Uint8, ARC4Uint64]>,
    arg16: SimpleNamedTuple,
    arg17: [uint64, bytes],
    arg18: [uint64, [bytes, uint64]],
    arg19: OverwriteStruct,
    arg20: DynamicArray<Uint8>,
  ): boolean {
    // verify args match raw op.arg values
    assert(arg0 === op.btoi(op.arg(0)))
    assert(arg1 === convertBytes<DynamicBytes>(op.arg(1), { strategy: 'unsafe-cast' }).native)
    assert(Bytes(arg2) === op.arg(2))
    assert(arg3 === convertBytes<Str>(op.arg(3), { strategy: 'unsafe-cast' }).native)
    assert(arg4 === (op.btoi(op.arg(4)) !== 0))
    assert(arg5.bytes === op.arg(5))
    assert(arg6.bytes === op.arg(6))
    assert(arg7.bytes === op.arg(7))
    assert(arg8.bytes === op.arg(8))
    assert(arg9.bytes === op.arg(9))
    assert(arg10.bytes === op.arg(10))
    assert(arg11.bytes === op.arg(11))
    assert(arg12.bytes === op.arg(12))
    assert(arg13.bytes === op.arg(13))
    assert(arg14.bytes === op.arg(14))
    assert(arg15.bytes === op.arg(15))
    const _raw16 = convertBytes<Tuple<[Uint8, ARC4Uint64]>>(op.arg(16), { strategy: 'unsafe-cast' })
    assert(arg16.a === _raw16.at(0))
    assert(arg16.b === _raw16.at(1))
    const _raw17 = convertBytes<Tuple<[ARC4Uint64, DynamicBytes]>>(op.arg(17), { strategy: 'unsafe-cast' })
    assert(arg17[0] === _raw17.at(0).asUint64())
    assert(arg17[1] === _raw17.at(1).native)
    const _raw18 = convertBytes<Tuple<[ARC4Uint64, Tuple<[DynamicBytes, ARC4Uint64]>]>>(op.arg(18), { strategy: 'unsafe-cast' })
    assert(arg18[0] === _raw18.at(0).asUint64())
    assert(arg18[1][0] === _raw18.at(1).at(0).native)
    assert(arg18[1][1] === _raw18.at(1).at(1).asUint64())
    assert(arg19.bytes === op.arg(19))
    assert(arg20.bytes === op.arg(20))

    // mutate all
    const mutableArg0: uint64 = arg0 + Uint64(1)
    const mutableArg1 = arg1.concat(Bytes('!'))
    const mutableArg2: biguint = arg2 + BigUint(1)
    const mutableArg3 = `hello_${arg3}`
    const mutableArg4 = !arg4
    const mutableArg5 = new Uint8(arg5.asUint64() + Uint64(1))
    const mutableArg6 = new ARC4Uint64(arg6.asUint64() + Uint64(1))
    const mutableArg7 = new Uint128(arg7.asBigUint() + BigUint(1))
    const mutableArg8 = new Address(op.Global.zeroAddress)
    const mutableArg9 = new Bool(!arg9.native)
    const mutableArg10 = new Str(`${arg10.native} world`)
    const mutableArg11 = new DynamicBytes(arg11.native.concat(Bytes.fromHex('00')))
    arg12[0] = new Byte(0xff)
    const mutableArg13 = new SimpleStruct({ x: new ARC4Uint64(arg13.x.asUint64() + Uint64(1)), y: arg13.y })
    const mutableArg14 = new NestedStruct({
      header: new Uint8(arg14.header.asUint64() + Uint64(1)),
      data: clone(arg14.data),
    })
    const mutableArg15 = new Tuple<[Uint8, ARC4Uint64]>(
      new Uint8(arg15.at(0).asUint64() + Uint64(1)),
      new ARC4Uint64(arg15.at(1).asUint64() + Uint64(1)),
    )
    const mutableArg16 = new SimpleNamedTuple({
      a: new Uint8(arg16.a.asUint64() + Uint64(1)),
      b: new ARC4Uint64(arg16.b.asUint64() + Uint64(1)),
    })
    const mutableArg17: [uint64, bytes] = [arg17[0] + Uint64(1), arg17[1].concat(Bytes('!'))]
    const mutableArg18: [uint64, [bytes, uint64]] = [arg18[0] + Uint64(1), [arg18[1][0].concat(Bytes('!')), arg18[1][1] + Uint64(1)]]
    const mutableArg19 = new OverwriteStruct({
      value: new Uint8(arg19.value.asUint64() + Uint64(1)),
      dontOverwriteMe: new Bool(!arg19.dontOverwriteMe.native),
    })
    arg20.push(new Uint8(0xff))

    // assert all
    assert(mutableArg0 > 0)
    assert(mutableArg1.length > 0)
    assert(mutableArg2 > BigUint(0))
    assert(Bytes(mutableArg3).length > 0)
    assert(mutableArg5.asUint64() > 0)
    assert(mutableArg6.asUint64() > 0)
    assert(mutableArg7.asBigUint() > BigUint(0))
    assert(mutableArg8.native === op.Global.zeroAddress)
    assert(Bytes(mutableArg10.native).length > 0)
    assert(mutableArg11.length > 0)
    assert(arg12[0] === new Byte(0xff))
    assert(mutableArg13.x.asUint64() > 0)
    assert(mutableArg14.header.asUint64() > 0)
    assert(mutableArg15.at(0).asUint64() > 0)
    assert(mutableArg16.a.asUint64() > 0)
    assert(mutableArg17[0] > 0)
    assert(mutableArg17[1].length > 0)
    assert(mutableArg18[0] > 0)
    assert(mutableArg18[1][0].length > 0)
    assert(mutableArg18[1][1] > 0)
    assert(mutableArg19.value.asUint64() > 0)
    assert(arg20.length > 0)

    // some random cross-arg operations
    let total: uint64 = mutableArg0 + mutableArg5.asUint64() + mutableArg6.asUint64() + mutableArg15.at(1).asUint64()
    total += mutableArg16.b.asUint64() + mutableArg17[0] + mutableArg18[0] + mutableArg18[1][1]
    if (mutableArg4) {
      total += mutableArg1.length
    }
    assert(total > 0)
    return mutableArg9.native
  }
}
