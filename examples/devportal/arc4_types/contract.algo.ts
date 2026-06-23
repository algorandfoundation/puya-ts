import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, arc4, assert, clone, Contract, err, GlobalState, Uint64, Bytes, urange } from '@algorandfoundation/algorand-typescript'
import { convertBytes, decodeArc4, encodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'

export class Arc4Types extends Contract {
  // example: ARC4_UINT64
  @abimethod()
  addArc4Uint64(a: arc4.Uint64, b: arc4.Uint64): arc4.Uint64 {
    // Arithmetic operators are not defined directly on ARC-4 integer types
    // because they are stored as fixed-width byte arrays in the AVM.
    // Use `.asUint64()` (or `.asBigUint()` for big integers) to obtain the
    // native value, perform the math, then wrap the result back into the
    // ARC-4 type for ABI compatibility.
    const c: uint64 = a.asUint64() + b.asUint64()
    return new arc4.Uint64(c)
  }

  // example: ARC4_UINT64

  // example: ARC4_UINTN
  @abimethod()
  addArc4UintN(a: arc4.Uint8, b: arc4.Uint16, c: arc4.Uint32, d: arc4.Uint64): arc4.Uint64 {
    // The encoding of ARC-4 integers uses fewer bytes for smaller bit widths.
    // All `UintN` variants up to 64 bits decode to the native `uint64` via `.asUint64()`.
    assert(a.bytes.length === 1, 'Uint8 is encoded in 1 byte')
    assert(b.bytes.length === 2, 'Uint16 is encoded in 2 bytes')
    assert(c.bytes.length === 4, 'Uint32 is encoded in 4 bytes')
    assert(d.bytes.length === 8, 'Uint64 is encoded in 8 bytes')

    const total: uint64 = a.asUint64() + b.asUint64() + c.asUint64() + d.asUint64()
    return new arc4.Uint64(total)
  }

  // example: ARC4_UINTN

  // example: ARC4_BIGUINT
  @abimethod()
  addArc4BiguintN(a: arc4.Uint128, b: arc4.Uint256, c: arc4.Uint<512>): arc4.Uint<512> {
    // Larger bit widths up to 512 bits are supported via `Uint<N>`.
    // Their native representation is `biguint`, obtained via `.asBigUint()`.
    assert(a.bytes.length === 16, 'Uint128 is encoded in 16 bytes')
    assert(b.bytes.length === 32, 'Uint256 is encoded in 32 bytes')
    assert(c.bytes.length === 64, 'Uint512 is encoded in 64 bytes')

    const total: biguint = a.asBigUint() + b.asBigUint() + c.asBigUint()
    return new arc4.Uint<512>(total)
  }

  // example: ARC4_BIGUINT

  // example: ARC4_BYTES
  @abimethod()
  arc4Byte(a: arc4.Byte): arc4.Byte {
    // `arc4.Byte` is an alias for `arc4.Uint8`. As with other UintN types,
    // arithmetic goes through the native representation.
    return new arc4.Byte(a.asUint64() + 1)
  }

  // example: ARC4_BYTES

  // example: ARC4_ADDRESS
  @abimethod()
  arc4AddressBalance(address: arc4.Address): uint64 {
    // The underlying 32 bytes of the address.
    const _underlyingBytes = address.bytes

    // Decode into the native `Account` reference type.
    const account = address.native
    return account.balance
  }

  @abimethod()
  arc4AddressRoundtrip(address: arc4.Address): arc4.Address {
    // `address.native` returns an `Account`, which is a reference type and
    // therefore can't be returned directly from an ABI method.
    // Wrap it back into `arc4.Address` for the return value.
    const convertedAddress = new arc4.Address(address.native)
    assert(convertedAddress === address, 'roundtrip mismatch')
    return convertedAddress
  }

  // example: ARC4_ADDRESS
}

// example: ARC4_STATIC_ARRAY
type AliasedStaticArray = arc4.StaticArray<arc4.Uint8, 1>

export class Arc4StaticArray extends Contract {
  @abimethod()
  arc4StaticArray(): void {
    // A static array has a fixed, compile-time length.
    const staticUint32Array = new arc4.StaticArray(new arc4.Uint32(1), new arc4.Uint32(10), new arc4.Uint32(2048), new arc4.Uint32(128))

    let total = Uint64(0)
    for (const item of staticUint32Array) {
      total += item.asUint64()
    }
    assert(total === 1 + 10 + 2048 + 128, 'unexpected static-array total')

    // A type alias makes the element type and length explicit at the use site.
    const aliasedStatic: AliasedStaticArray = new arc4.StaticArray(new arc4.Uint8(101))
    const index = Uint64(0)
    assert(aliasedStatic[0].asUint64() + aliasedStatic[index].asUint64() === 202, 'alias indexing mismatch')

    aliasedStatic[0] = new arc4.Uint8(202)
    assert(aliasedStatic[0].asUint64() === 202, 'alias mutation mismatch')

    // Static arrays are fixed-size: `.pop()` or `.push(...)` would not compile.
  }
}

// example: ARC4_STATIC_ARRAY

// example: ARC4_DYNAMIC_ARRAY
type Goodbye = arc4.DynamicArray<arc4.Str>

export class Arc4DynamicArray extends Contract {
  @abimethod()
  goodbye(name: arc4.Str): Goodbye {
    return new arc4.DynamicArray(new arc4.Str('Good bye '), name)
  }

  @abimethod()
  hello(name: arc4.Str): string {
    // Dynamic arrays have variable size and capacity. They support
    // `push`, `pop`, and concatenation via `concat`.
    let dynamicStringArray = new arc4.DynamicArray(new arc4.Str('Hello '))

    const extension = new arc4.DynamicArray(name, new arc4.Str('!'))
    dynamicStringArray = dynamicStringArray.concat(extension)

    const copied = clone(dynamicStringArray)
    // `pop()` removes and returns the last element
    const last = copied.pop()
    assert(last.native === '!', 'last element should be the exclamation mark')
    const secondLast = copied.pop()
    assert(secondLast.native === name.native, 'second last element should be the name')
    copied.push(new arc4.Str('world!'))
    assert(copied.length === 2, "copied is now ['Hello ', 'world!']")

    let greeting = ''
    for (const x of dynamicStringArray) {
      greeting += x.native
    }
    return greeting
  }

  // example: ARC4_DYNAMIC_ARRAY

  // example: ARC4_DYNAMIC_BYTES
  @abimethod()
  arc4DynamicBytes(): arc4.DynamicBytes {
    // `arc4.DynamicBytes` is the byte-array specialisation of
    // `arc4.DynamicArray<arc4.Byte>`. It can be constructed straight from a
    // `bytes` literal and decoded back to native `bytes` in one step via `.native`.
    const dynamicBytes = new arc4.DynamicBytes(Bytes.fromHex('ffffff'))

    // Unlike a generic `DynamicArray`, `DynamicBytes` exposes `.native`
    // so the whole sequence can be decoded in one step.
    const nativeDynamicBytes = dynamicBytes.native
    assert(nativeDynamicBytes.length === 3, 'three bytes before concatenation')

    // Sequences are joined with `concat`, which returns a new `DynamicBytes`.
    const extended = dynamicBytes.concat(new arc4.DynamicBytes(Bytes.fromHex('aabbcc')))
    assert(extended.native.length === 6, 'six bytes after concatenation')

    return extended
  }

  // example: ARC4_DYNAMIC_BYTES
}

// example: ARC4_STRUCT
// `arc4.Struct` declares a named, ARC-4-encoded record type. Adding fields or
// reordering them is safe because members are addressed by name at the call site.
class Todo extends arc4.Struct<{
  task: arc4.Str
  completed: arc4.Bool
}> {}

type Todos = arc4.DynamicArray<Todo>

export class Arc4Struct extends Contract {
  todos = GlobalState<Todos>({ initialValue: new arc4.DynamicArray<Todo>() })

  @abimethod()
  addTodo(task: arc4.Str): Todos {
    const todos = clone(this.todos.value)
    const todo = new Todo({ task, completed: new arc4.Bool(false) })
    todos.push(clone(todo))
    this.todos.value = clone(todos)
    return todos
  }

  @abimethod()
  completeTodo(task: arc4.Str): void {
    const todos = clone(this.todos.value)
    for (const index of urange(todos.length)) {
      if (todos[index].task === task) {
        todos[index].completed = new arc4.Bool(true)
        this.todos.value = clone(todos)
        return
      }
    }
  }

  @abimethod()
  returnTodo(task: arc4.Str): Todo {
    const todos = clone(this.todos.value)
    for (const index of urange(todos.length)) {
      if (todos[index].task === task) {
        return clone(todos[index])
      }
    }
    err('todo not found')
  }
}

// example: ARC4_STRUCT

// example: ARC4_TUPLE
type ContactInfo = arc4.Tuple<readonly [arc4.Str, arc4.Str, arc4.Uint64]>

export class Arc4Tuple extends Contract {
  contactInfo = GlobalState<ContactInfo>({
    initialValue: new arc4.Tuple(new arc4.Str(''), new arc4.Str(''), new arc4.Uint64(0)),
  })

  @abimethod()
  addContactInfo(contact: ContactInfo): uint64 {
    // An `arc4.Tuple` is a heterogeneous, ARC-4-encoded collection.
    // `.native` unpacks it into a native tuple of the element types.
    const [name, email, phone] = contact.native
    assert(name.native === 'Alice', 'unexpected name')
    assert(email.native === 'alice@something.com', 'unexpected email')
    assert(phone.asUint64() === 555_555_555, 'unexpected phone')

    this.contactInfo.value = clone(contact)
    return phone.asUint64()
  }

  @abimethod()
  returnContact(): ContactInfo {
    return this.contactInfo.value
  }
}

// example: ARC4_TUPLE

// example: ARC4_ENCODE_DECODE
// Demonstrates `encodeArc4` and `decodeArc4`, the general-purpose ARC-4 codec.
// Use these when you need to build or parse ARC-4 bytes by hand (e.g. constructing
// event payloads, decoding bytes received off-chain) or round-trip a value through
// bytes for hashing, signing, or storage.
export class Arc4Codec extends Contract {
  @abimethod()
  encodeDecode(value: uint64): uint64 {
    // `encodeArc4(value)` returns the ARC-4 encoded bytes; passing the bytes
    // plus a target type to `decodeArc4` reverses it.
    const encoded = encodeArc4(value)
    assert(encoded.length === 8, 'uint64 encodes to 8 big-endian bytes')

    const decoded = decodeArc4<uint64>(encoded)
    assert(decoded === value, 'round-trip through bytes preserves the value')
    return decoded
  }

  @abimethod()
  decodeUnvalidated(raw: bytes): arc4.Uint64 {
    // The `unsafe-cast` strategy skips the ARC-4 encoding check on the input
    // bytes. Smaller bytecode, faster - but only safe when you already trust
    // the source of the bytes (e.g. you wrote them in the same program).
    // The `validate` strategy asserts the encoding instead.
    return convertBytes<arc4.Uint64>(raw, { strategy: 'unsafe-cast' })
  }
}

// example: ARC4_ENCODE_DECODE
