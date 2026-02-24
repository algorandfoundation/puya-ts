/**
 * Example 07 — ARC-4 Data Structures
 * Tier: 2 — State & Data
 *
 * Features demonstrated:
 *   - arc4.Struct definition and field access
 *   - arc4.StaticArray — fixed-length typed array
 *   - arc4.DynamicArray — variable-length typed array with push/pop
 *   - arc4.Tuple — heterogeneous fixed tuple
 *   - arc4.Address — 32-byte Algorand address
 *   - arc4.Str — ARC-4 encoded UTF-8 string
 *   - arc4.Bool — ARC-4 encoded boolean
 *   - arc4.Uint<N> variants (Uint8, Uint16, Uint32, Uint64, Uint128, Uint<256>)
 *   - arc4.DynamicBytes — variable-length byte sequence
 *   - encodeArc4 / decodeArc4 — native ↔ ARC-4 encoding round-trips
 *   - sizeOf — compile-time byte size of fixed-length ARC-4 types
 */
import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
// Contract: ABI-routed base; assert: runtime assertion; Bytes: bytes factory; log: txn logging; Uint64: uint64 factory
import { arc4, assert, Bytes, Contract, log, Uint64 } from '@algorandfoundation/algorand-typescript'
// arc4 types imported from the arc4 sub-module
import {
  Address,
  Bool,
  decodeArc4,
  DynamicArray,
  DynamicBytes,
  encodeArc4,
  sizeOf,
  StaticArray,
  Str,
  Tuple,
  Uint,
  Uint8,
  Uint16,
  Uint32,
  Uint64 as Arc4Uint64,
  Uint128,
} from '@algorandfoundation/algorand-typescript/arc4'

// --- arc4.Struct definitions (must be at module scope) ---

// Struct: a 2D point with two Uint64 fields
class Point extends arc4.Struct<{ x: Arc4Uint64; y: Arc4Uint64 }> {}

// Struct: a labeled record combining static and dynamic fields
class LabeledScore extends arc4.Struct<{
  label: Str
  score: Arc4Uint64
  active: Bool
}> {}

// ARC-4 data structures contract showcasing all arc4 encoded types
export class Arc4DataStructures extends Contract {
  // Demonstrate Uint<N> variants: Uint8, Uint16, Uint32, Uint64, Uint128, Uint<256>
  public exploreUintVariants(value: uint64): bytes {
    // Uint8: 1-byte unsigned integer
    const u8 = new Uint8(4)
    // Uint16: 2-byte unsigned integer
    const u16 = new Uint16(1000)
    // Uint32: 4-byte unsigned integer
    const u32 = new Uint32(70000)
    // Uint64: 8-byte unsigned integer (arc4-encoded, distinct from native uint64)
    const u64 = new Arc4Uint64(value)
    // Uint128: 16-byte unsigned integer
    const u128 = new Uint128(2n ** 100n)
    // Uint<256>: 32-byte unsigned integer via generic Uint<N>
    const u256 = new Uint<256>(2n ** 200n)

    // .asUint64(): convert arc4 integer back to native uint64
    assert(u64.asUint64() === value)
    // .asBigUint(): convert arc4 integer to native biguint
    assert(u8.asBigUint() === 4n)

    // log the encoded bytes of the 128-bit value
    log(u128.bytes)

    // Suppress unused variable warnings by logging their sizes
    log(u16.bytes)
    log(u32.bytes)
    log(u256.bytes)

    // Return the encoded bytes of the 256-bit value
    return u256.bytes
  }

  // Demonstrate Bool, Str, Address, and DynamicBytes
  public exploreBasicTypes(name: string, addr: Address): string {
    // Bool: ARC-4 encoded boolean (1 byte)
    const flag = new Bool(true)
    // .native: access the underlying boolean value
    assert(flag.native === true)

    // Str: ARC-4 encoded UTF-8 string (2-byte length prefix + data)
    const greeting = new Str(name)
    // .native: access the underlying string value
    assert(greeting.native === name)

    // Address: 32-byte Algorand address
    // .native: access the underlying Account value
    log(addr.native)

    // DynamicBytes: variable-length byte sequence (2-byte length prefix + data)
    const db1 = new DynamicBytes(Bytes('hello'))
    const db2 = new DynamicBytes(Bytes(' world'))
    // .concat(): join two DynamicBytes values
    const combined = db1.concat(db2)
    // .native: access the underlying bytes value
    assert(combined.native === Bytes('hello world'))

    return greeting.native
  }

  // Demonstrate arc4.Struct creation, field access, and .bytes
  public exploreStruct(x: uint64, y: uint64): Point {
    // Create a Point struct with named fields
    const p = new Point({ x: new Arc4Uint64(x), y: new Arc4Uint64(y) })

    // Direct field access on struct instances
    assert(p.x.asUint64() === x)
    assert(p.y.asUint64() === y)

    // Create a LabeledScore struct with mixed field types
    const record = new LabeledScore({
      label: new Str('alice'),
      score: new Arc4Uint64(x),
      active: new Bool(true),
    })
    // Access dynamic (Str) field via .native
    assert(record.label.native === 'alice')
    // Access Bool field via .native
    assert(record.active.native === true)

    // log the raw ARC-4 encoded bytes of the struct
    log(p.bytes)

    return p
  }

  // Demonstrate StaticArray and DynamicArray
  public exploreArrays(a: uint64, b: uint64, c: uint64): uint64 {
    // StaticArray: fixed-length array — length known at compile time
    const fixed = new StaticArray(
      new Arc4Uint64(a),
      new Arc4Uint64(b),
      new Arc4Uint64(c),
    )
    // Index access on StaticArray
    assert(fixed[0].asUint64() === a)
    assert(fixed[1].asUint64() === b)

    // DynamicArray: variable-length array — supports push/pop
    const dynamic = new DynamicArray(
      new Arc4Uint64(a),
      new Arc4Uint64(b),
    )
    // .push(): append an element to the dynamic array
    dynamic.push(new Arc4Uint64(c))
    // .length: current number of elements
    assert(dynamic.length === 3)
    // .pop(): remove and return the last element
    const last = dynamic.pop()
    assert(last.asUint64() === c)
    // After pop, length decreases
    assert(dynamic.length === 2)

    // .concat(): merge two dynamic arrays
    const merged = new DynamicArray(new Arc4Uint64(a)).concat(
      new DynamicArray(new Arc4Uint64(b)),
    )
    assert(merged.length === 2)

    return fixed[2].asUint64()
  }

  // Demonstrate Tuple with heterogeneous arc4 types
  public exploreTuple(value: uint64): uint64 {
    // Tuple: fixed heterogeneous collection of arc4 types
    const t = new Tuple(
      new Arc4Uint64(value),
      new Bool(true),
      new Str('hello'),
    )

    // .at(): access element by index (type-safe)
    const first = t.at(0)
    assert(first.asUint64() === value)

    // .native: access the tuple as a native readonly array
    const items = t.native
    assert(items[1].native === true)

    // .length: number of elements in the tuple
    assert(t.length === 3)

    return first.asUint64()
  }

  // Demonstrate encodeArc4, decodeArc4, and sizeOf
  public exploreEncodeDecode(value: uint64, flag: boolean): bytes {
    // encodeArc4: encode a native uint64 value to ARC-4 bytes
    const encoded = encodeArc4(value)
    // decodeArc4: decode ARC-4 bytes back to a native uint64
    const decoded = decodeArc4<uint64>(encoded)
    assert(decoded === value)

    // encodeArc4: encode a native boolean to ARC-4 bytes
    const encodedBool = encodeArc4(flag)
    // decodeArc4: decode ARC-4 bytes back to a native boolean
    const decodedBool = decodeArc4<boolean>(encodedBool)
    assert(decodedBool === flag)

    // encodeArc4: encode a native string to ARC-4 bytes
    const encodedStr = encodeArc4('test')
    // decodeArc4: decode ARC-4 bytes back to a native string
    const decodedStr = decodeArc4<string>(encodedStr)
    assert(decodedStr === 'test')

    // sizeOf: returns the byte size of a fixed-length ARC-4 type
    // uint64 occupies 8 bytes in ARC-4 encoding
    assert(sizeOf<uint64>() === 8)
    // boolean occupies 1 byte in ARC-4 encoding
    assert(sizeOf<boolean>() === 1)
    // Uint<256> occupies 32 bytes
    assert(sizeOf<Uint<256>>() === 32)
    // A tuple of two uint64 and a bool occupies 17 bytes (8+8+1)
    assert(sizeOf<[uint64, uint64, boolean]>() === 17)

    // log the size of a uint64 for verification
    log(Uint64(sizeOf<uint64>()))

    return encoded
  }
}
