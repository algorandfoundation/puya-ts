# Architecture Decision Record - Primitive bytes and strings

- **Status**: Draft
- **Owner:** Tristan Menzel
- **Deciders**: Alessandro Cappellato (Algorand Foundation), Joe Polny (Algorand Foundation), Rob Moore (MakerX)
- **Date created**: 2024-05-21
- **Date decided**: N/A
- **Date updated**: 2024-05-31

## Context

See [Architecture Decision Record - Primitive integer types](./2024-05-21_primitive-integer-types.md) for related decision and context.

The AVM's only non-integer type is a variable length byte array. When *not* being interpreted as a `biguint`, leading zeros are significant and length is constant unless explicitly manipulated. Strings can only be represented in the AVM if they are encoded as bytes. The AVM supports byte literals in the form of base16, base64, and UTF-8 encoded strings. Once a literal has been parsed, the AVM has no concept of the original encoding or of UTF-8 characters. As a result, whilst a byte array can be indexed to receive a single byte (or a slice of bytes); it cannot be indexed to return a single UTF-8 *character* - unless one assumes all characters in the original string were ASCII (i.e. single byte) characters.

Algorand Python has specific [Bytes and String types](https://algorandfoundation.github.io/puya/lg-types.html#avm-types) that have semantics that exactly match the AVM semantics. Python allows for operator overloading so these types also use native operators (where they align to functionality in the underlying AVM).


## Requirements

- Support bytes AVM type and a string type that supports ASCII UTF-8 strings
- Use idiomatic TypeScript expressions for string expressions
- Semantic compatibility between AVM execution and TypeScript execution (e.g. in unit tests)

## Principles

- **[AlgoKit Guiding Principles](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/algokit.md#guiding-principles)** - specifically Seamless onramp, Leverage existing ecosystem, Meet devs where they are
- **[Algorand Python Principles](https://algorandfoundation.github.io/puya/principles.html#principles)**
- **[Algorand TypeScript Guiding Principles](../README.md#guiding-principals)**

## Options


### Option 1 - Direct use of native EcmaScript types


EcmaScript provides two relevant types for bytes and strings.

 - **string**: The native string type. Supports arbitrary length, concatenation, indexation/slicing of characters plus many utility methods (upper/lower/startswith/endswith/charcodeat/trim etc). Supports concat with binary `+` operator.
 - **Uint8Array**: A variable length mutable array of 8-bit numbers. Supports indexing/slicing of 'bytes'.


```ts
const b1 = "somebytes"

const b2 = new Uint8Array([1, 2, 3, 4])

const b3 = b1 + b1
```

Whilst binary data is often a representation of a utf-8 string, it is not always - so direct use of the string type is not a natural fit. It doesn't allow us to represent alternative encodings (b16/b64) and the existing api surface is very 'string' centric. Much of the api would also be expensive to implement on the AVM leading to a bunch of 'dead' methods hanging off the type (or a significant amount of work implementing all the methods).

The Uint8Array type is fit for purpose as an encoding mechanism but the API is not as friendly as it could be for writing declarative contracts. The `new` keyword feels unnatural for something that is ostensibly a primitive type. The fact that it is mutable also complicates the implementation the compiler produces for the AVM.



### Option 2 - Branded strings (TEALScript approach)


TEALScript uses a branded `string` to represent `bytes` and native `string` to represent UTF-8 bytes. Base64/Base16 encoding/decoding is performed with specific methods.

```typescript
const someString = "foo"
const someHexValue = hex("0xdeadbeef") // branded "bytes"
```

Bytes and UTF-8 strings are typed via branded `string` types. UTF-8 strings are the most common use case for strings, thus have the JavaScript `String` prototype functions when working with byteslice, which provides a familiar set of function signatures. This option also enables the usage of `+` for concatenation.

To differentiate between ABI `string` and AVM `byteslice`, a branded type, `bytes`, can be used to represent non-encoded byteslices that may or may not be UTF-8 strings.

Additional functions can be used when wanting to have string literals of a specific encoding represent a string or byteslice.


The downside of this approach is that the string prototype has a huge range of methods that are not all relevant and some of them return `number`, which is [not a semantically relevant type](./2024-05-21_primitive-integer-types.md).


### Option 3 - Define a class to represent Bytes

A `Bytes` class is defined with a very specific API tailored to operations which are available on the AVM:

```ts
class Bytes {
  constructor(v: string) {
    this.v = v
  }

  concat(other: Bytes): Bytes {
    return new Bytes(this.v + other.v)
  }

  at(x: uint64): Bytes {
    return new Bytes(this.v[x])
  }

  /* etc */
}

```

This solution provides great type safety and requires no transpilation to run _correctly_ on Node.js. However, non-primitive types in Node.js have equality checked by reference. Again the `new` keyword feels unnatural. Due to lack of overloading, `+` will not work as expected however concatenations do not require the same understanding of "order of operations" and nesting as numeric operations, so a `concat` method isn't as unwieldy (but still isn't idiomatic).

```ts
const a = new Bytes("Hello")
const b = new Bytes("World")

const ab = a.concat(b)

function testValue(x: Bytes) {
  // No compile error, but will work on reference not value
  switch(x) {
    case a:
      return b
    case b:
      return a
  }
  return new Bytes("default")
}
```

To have equality checks behave as expected we would need a transpilation step to replace bytes values in certain expressions with a primitive type.

### Option 4 - Implement bytes as a class but define it as a type + factory

We can iron out some of the rough edges of using a class by only exposing a factory method for `Bytes` and a resulting type `bytes`. This removes the need for the `new` keyword and lets us use a 'primitive looking' type alias (`bytes` versus `Bytes` - much like `string` and `String`). We can use [tagged templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates) to improve the user experience of multipart concat expressions in lieu of having the `+` operator.

```ts

const a = Bytes("Hello")
const b = Bytes.fromHex("ABFF")
const c = Bytes.fromBase64("...")
const d = Bytes.fromInts(255, 123, 28, 20)
const e = Bytes`${a} World!`


function testValue(x: bytes, y: bytes): bytes {
  return Bytes`${x} and ${y}`
}

```

## Preferred option

TBD

## Selected option

TBD
