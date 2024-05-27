# Architecture Decision Record - Primitive integer types

- **Status**: Draft
- **Owner:** Tristan Menzel
- **Deciders**: Alessandro Cappellato (Algorand Foundation), Joe Polny (Algorand Foundation), Rob Moore (MakerX)
- **Date created**: 2024-05-21
- **Date decided**: N/A
- **Date updated**: 2024-05-22

## Context

The AVM supports two integer types in its standard set of ops.

* **uint64**: An unsigned 64-bit integer where the AVM will error on over or under flows
* **biguint**: An unsigned variable bit, big-endian integer represented as an array of bytes with an indeterminate number of leading zeros which are truncated by several math ops. The max size of a biguint is 512-bits. Over and under flows will cause errors.

EcmaScript supports two numeric types.

* **number**: A floating point signed value with 64 bits of precision capable of a max safe integer value of 2^53 - 1. A number can be declared with a numeric literal, or with the `Number(...)` factory method.
* **bigint**: A signed arbitrary-precision integer with an implementation defined limit based on the platform. In practice this is greater than 512-bit. A bigint can be declared with a numeric literal and `n` suffix, or with the `BigInt(...)` factory method.

EcmaScript and TypeScript both do not support operator overloading, despite some [previous](https://github.com/tc39/notes/blob/main/meetings/2023-11/november-28.md#withdrawing-operator-overloading) [attempts](https://github.com/microsoft/TypeScript/issues/2319) to do so.

TealScript [makes use of branded `number` types](https://tealscript.netlify.app/guides/supported-types/numbers/) for all bit sizes from 8 => 512, although it doesn't allow `number` variables, you must specify the actual type you want (e.g. `uint64`). Since the source code is never executed, the safe limits of the `number` type are not a concern. Compiled code does not perform overflow checks on calculations until a return value is being encoded meaning a uint<8> is effectively a uint<64> until it's returned.

Algorand Python has specific [UInt64 and BigUint types](https://algorandfoundation.github.io/puya/lg-types.html#avm-types) that have semantics that exactly match the AVM semantics. Python allows for operator overloading so these types also use native operators (where they align to functionality in the underlying AVM).


## Requirements

- Support uint64 and biguint AVM types
- Use idiomatic TypeScript expressions for numeric expressions, including mathematical operators (`+`, `-`, `*`, `/`, etc.)
- Semantic compatibility when executing on Node.js (e.g. in unit tests) and AVM

## Principles

- **[AlgoKit Guiding Principles](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/algokit.md#guiding-principles)** - specifically Seamless onramp, Leverage existing ecosystem, Meet devs where they are
- **[Algorand Python Principles](https://algorandfoundation.github.io/puya/principles.html#principles)**
- **[Algorand TypeScript Guiding Principles](../README.md#guiding-principals)**

## Options

### Option 1 - Direct use of native EcmaScript types

EcmaScript's `number` type is ill-suited to representing either AVM type reliably as it does not have the safe range to cover the full range of a uint64. Being a floating point number, it would also require truncating after division.

EcmaScript's `bigint` is a better fit for both types but does not underflow when presented with a negative number, nor does it overflow at any meaningful limit for the AVM types.

If we solved the over/under flow checking with transpilation we still face an issue that `uint64` and `biguint` would not have discrete types and thus, we would have no type safety against accidentally passing a `biguint` to a method that expects a `uint64` and vice versa.

### Option 2 - Define classes to represent the AVM types

A `UInt64` and `BigUint` class could be defined which make use of `bigint` internally to perform maths operations and check for over or under flows after each op.

```ts
class UInt64 {

  private value: bigint

  constructor(value: bigint | number) {
    this.value = this.checkBounds(value)
  }

  add(other: UInt64): UInt64 {
    return new UInt64(this.value + other.value)
  }

  /* etc */
}

```

This solution provides the ultimate in type safety and semantic/syntactic compatibility, and requires no transpilation to run _correctly_ on Node.js. The semantics should be obvious to anyone familiar with Object Oriented Programming. The downside is that neither EcmaScript nor TypeScript support operator overloading which results in more verbose and unwieldy math expressions.

```ts
const a = UInt64(500n)
const b = Uint64(256)

// Not supported (a compile error in TS, unhelpful behaviour in ES)
const c1 = a + b
// Works, but is verbose and unwieldy for more complicated expressions and isn't idiomatic TypeScript
const c2 = a.add(b)

```

### Option 3 - Use tagged/branded number types

TypeScript allows you to intersect primitive types with a simple interface to brand a value in a way which is incompatible with another primitive branded with a different value within the type system.

```ts
// Constructors
declare function UInt64(v): uint64
declare function BigUint(v): uint64

// Branded types
type uint64 = bigint & { __type?: 'uint64' }
type biguint = bigint & { __type?: 'biguint' }


const a: uint64 = 323n // Declare with type annotation
const b = UInt64(12n) // Declare with factory

// c1 type is `bigint`, but we can mandate a type hint with the compiler (c2)
const c1 = a + b
const c2: uint64 = a + b
// No TypeScript type error, but semantically ambiguous - is a+b performed as a biguint op or a uint64 one and then converted?
// (We could detect this as a compiler error though)
const c3: biguint = a + b

// Type error on b: Argument of type 'uint64' is not assignable to parameter of type 'biguint'. Nice!
test(a, b)

function test(x: uint64, y: biguint) {
  // ...
}

```

This solution looks most like natural TypeScript / EcmaScript and results in math expressions that are much easier to read. The factory methods mimic native equivalents and should be familiar to existing developers.

The drawbacks of this solution are:
 - Less implicit type safety as TypeScript will infer the type of any binary math expression to be the base numeric type (`number`). A type annotation will be required where ever an identifier is declared and additional type checking will be required by the compiler to catch instances of assigning one numeric type to the other.
 - In order to have 'run on Node.js' semantics of a `uint64` or `biguint` match 'run on the AVM', a transpiler will be required to wrap numeric operations in logic that checks for over and under flows.

TEALScript uses a similar approach to this, but uses `number` as the underlying type rather than `bigint`, which has the aforementioned downside of not being able to safely represent a 64-bit unsigned integer, but does has the advantage of being directly compatible with raw numbers (e.g. `3` rather than `3n`) and JavaScript prototype methods that return `number` like `array.length`. The requirement for semantic compatibility dictates that we need to use `bigint` rather than `number` since it's the correct type to represent the data and we will be able to create wrapper classes for things like arrays that have more explicitly typed methods for things like length.

A variation of the above with non-optional `__type` tags would prevent accidental implicit assignment errors, but require explicit casting on all ops and any methods that return a `number` such as the `length` method on arrays.

```ts
declare function Uint64(v): uint64
declare function BigUint(v): uint64

type uint64 = bigint & { __type: 'uint64' }
type biguint = bigint & { __type: 'biguint' }

// Require factory or cast on declaration
const a: uint64 = 323n as uint64
const b = Uint64(12n)

// Also require factory or cast on math
let c2: uint64

c2 = a + b // error
c2 = Uint64(a + b) // ok
c2 = (a + b) as uint64 // ok
```

This introduces a degree of type safety with the in-built TypeScript type system at the expense of legibility.



## Preferred option

TBD

## Selected option

TBD
