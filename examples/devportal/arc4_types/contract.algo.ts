import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import {
  abimethod,
  arc4,
  assert,
  clone,
  Contract,
  err,
  GlobalState,
  op,
  Uint64,
  BigUint,
  Bytes,
  urange,
} from '@algorandfoundation/algorand-typescript'
import { convertBytes, decodeArc4, encodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'

export class Arc4Types extends Contract {
  // example: ARC4_UINT64
  @abimethod()
  addArc4Uint64(a: arc4.Uint64, b: arc4.Uint64): arc4.Uint64 {
    const c: uint64 = a.asUint64() + b.asUint64()
    return new arc4.Uint64(c)
  }

  // example: ARC4_UINT64

  // example: ARC4_UINTN
  @abimethod()
  addArc4UintN(a: arc4.Uint8, b: arc4.Uint16, c: arc4.Uint32, d: arc4.Uint64): arc4.Uint64 {
    assert(a.bytes.length === 1, 'uint8 width mismatch')
    assert(b.bytes.length === 2, 'uint16 width mismatch')
    assert(c.bytes.length === 4, 'uint32 width mismatch')
    assert(d.bytes.length === 8, 'uint64 width mismatch')

    const total: uint64 = a.asUint64() + b.asUint64() + c.asUint64() + d.asUint64()
    return new arc4.Uint64(total)
  }

  // example: ARC4_UINTN

  // example: ARC4_BIGUINT
  @abimethod()
  addArc4BiguintN(a: arc4.Uint128, b: arc4.Uint256, c: arc4.Uint<512>): arc4.Uint<512> {
    assert(a.bytes.length === 16, 'uint128 width mismatch')
    assert(b.bytes.length === 32, 'uint256 width mismatch')
    assert(c.bytes.length === 64, 'uint512 width mismatch')

    const total: biguint = a.asBigUint() + b.asBigUint() + c.asBigUint()
    return new arc4.Uint<512>(total)
  }

  // example: ARC4_BIGUINT

  // example: ARC4_BYTES
  @abimethod()
  arc4Byte(a: arc4.Byte): arc4.Byte {
    return new arc4.Byte(a.asUint64() + 1)
  }

  // example: ARC4_BYTES

  // example: ARC4_ADDRESS
  @abimethod()
  arc4AddressBalance(address: arc4.Address): uint64 {
    const _underlyingBytes = address.bytes
    const account = address.native
    return account.balance
  }

  @abimethod()
  arc4AddressRoundtrip(address: arc4.Address): arc4.Address {
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
    const staticUint32Array = new arc4.StaticArray(
      new arc4.Uint32(1),
      new arc4.Uint32(10),
      new arc4.Uint32(2048),
      new arc4.Uint32(128),
    )

    let total = Uint64(0)
    for (const item of staticUint32Array) {
      total += item.asUint64()
    }
    assert(total === 1 + 10 + 2048 + 128, 'unexpected static-array total')

    const aliasedStatic: AliasedStaticArray = new arc4.StaticArray(new arc4.Uint8(101))
    const index = Uint64(0)
    assert(aliasedStatic[0].asUint64() + aliasedStatic[index].asUint64() === 202, 'alias indexing mismatch')

    aliasedStatic[0] = new arc4.Uint8(202)
    assert(aliasedStatic[0] === new arc4.Uint8(202), 'alias mutation mismatch')
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
    const dynamicStringArray = new arc4.DynamicArray(new arc4.Str('Hello '), name, new arc4.Str('!'))

    const copied = clone(dynamicStringArray)
    const _last = copied.pop()
    const _secondLast = copied.pop()
    copied.push(new arc4.Str('world!'))

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
    const dynamicBytes = new arc4.DynamicBytes(Bytes.fromHex('ffffff'))
    const nativeDynamicBytes = dynamicBytes.native
    assert(nativeDynamicBytes.length === 3, 'unexpected byte length')

    const updatedBytes = dynamicBytes.concat(new arc4.DynamicBytes(Bytes.fromHex('aabbcc')))
    assert(updatedBytes.native.length === 6, 'unexpected concatenated byte length')
    return updatedBytes
  }

  // example: ARC4_DYNAMIC_BYTES
}

// example: ARC4_STRUCT
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
    todos.push(todo)
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
    err('no TODOs in the list')
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
    const name = contact.at(0)
    const email = contact.at(1)
    const phone = contact.at(2)
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
export class Arc4Codec extends Contract {
  @abimethod()
  encodeDecode(value: uint64): uint64 {
    const encoded = encodeArc4(value)
    assert(encoded.length === 8, 'uint64 should encode to 8 bytes')

    const decoded = decodeArc4<uint64>(encoded)
    assert(decoded === value, 'roundtrip decode mismatch')
    return decoded
  }

  @abimethod()
  decodeUnvalidated(raw: bytes): arc4.Uint64 {
    return convertBytes<arc4.Uint64>(raw, { strategy: 'unsafe-cast' })
  }
}

// example: ARC4_ENCODE_DECODE
