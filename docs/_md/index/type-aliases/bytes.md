[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / bytes

# Type Alias: bytes

> **bytes** = `object`

Defined in: [packages/algo-ts/src/primitives.ts:101](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L101)

A sequence of zero or more bytes (ie. byte[])

## Properties

### length

> `readonly` **length**: [`uint64`](uint64.md)

Defined in: [packages/algo-ts/src/primitives.ts:105](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L105)

Retrieve the length of the byte sequence

## Methods

### at()

> **at**(`i`): `bytes`

Defined in: [packages/algo-ts/src/primitives.ts:112](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L112)

Retrieve the byte at the index i

#### Parameters

##### i

[`Uint64Compat`](Uint64Compat.md)

The index to read. Can be negative to read from the end

#### Returns

`bytes`

The byte found at the index, or an empty bytes value

***

### bitwiseAnd()

> **bitwiseAnd**(`other`): `bytes`

Defined in: [packages/algo-ts/src/primitives.ts:128](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L128)

Perform a bitwise AND operation with this bytes value and another bytes value.

The shorter of the two values will be zero-left extended to the larger length.

#### Parameters

##### other

[`BytesCompat`](BytesCompat.md)

The other bytes value

#### Returns

`bytes`

The bitwise operation result

***

### bitwiseInvert()

> **bitwiseInvert**(): `bytes`

Defined in: [packages/algo-ts/src/primitives.ts:152](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L152)

Perform a bitwise INVERT operation with this bytes value

#### Returns

`bytes`

The bitwise operation result

***

### bitwiseOr()

> **bitwiseOr**(`other`): `bytes`

Defined in: [packages/algo-ts/src/primitives.ts:137](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L137)

Perform a bitwise OR operation with this bytes value and another bytes value

The shorter of the two values will be zero-left extended to the larger length.

#### Parameters

##### other

[`BytesCompat`](BytesCompat.md)

The other bytes value

#### Returns

`bytes`

The bitwise operation result

***

### bitwiseXor()

> **bitwiseXor**(`other`): `bytes`

Defined in: [packages/algo-ts/src/primitives.ts:146](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L146)

Perform a bitwise XOR operation with this bytes value and another bytes value.

The shorter of the two values will be zero-left extended to the larger length.

#### Parameters

##### other

[`BytesCompat`](BytesCompat.md)

The other bytes value

#### Returns

`bytes`

The bitwise operation result

***

### concat()

> **concat**(`other`): `bytes`

Defined in: [packages/algo-ts/src/primitives.ts:119](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L119)

Concatenate this bytes value with another bytes value

#### Parameters

##### other

[`BytesCompat`](BytesCompat.md)

The other bytes value

#### Returns

`bytes`

The concatenation result

***

### equals()

> **equals**(`other`): `boolean`

Defined in: [packages/algo-ts/src/primitives.ts:159](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L159)

Compares this bytes value with another.

#### Parameters

##### other

[`BytesCompat`](BytesCompat.md)

The other bytes value

#### Returns

`boolean`

True if both values represent the same byte sequence

***

### slice()

#### Call Signature

> **slice**(): `bytes`

Defined in: [packages/algo-ts/src/primitives.ts:164](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L164)

Returns a copy of this bytes sequence

##### Returns

`bytes`

#### Call Signature

> **slice**(`start`): `bytes`

Defined in: [packages/algo-ts/src/primitives.ts:169](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L169)

Returns a slice of this bytes sequence from the specified start to the end

##### Parameters

###### start

[`Uint64Compat`](Uint64Compat.md)

The index to start slicing from. Can be negative to count from the end.

##### Returns

`bytes`

#### Call Signature

> **slice**(`start`, `end`): `bytes`

Defined in: [packages/algo-ts/src/primitives.ts:175](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L175)

Returns a slice of this bytes sequence from the specified start to the specified end

##### Parameters

###### start

[`Uint64Compat`](Uint64Compat.md)

The index to start slicing from. Can be negative to count from the end.

###### end

[`Uint64Compat`](Uint64Compat.md)

The index to end the slice. Can be negative to count from the end.

##### Returns

`bytes`

***

### toString()

> **toString**(): `string`

Defined in: [packages/algo-ts/src/primitives.ts:184](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L184)

Interpret this byte sequence as a utf-8 string

#### Returns

`string`
