[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [index](../README.md) / bytes

# Type Alias: bytes

> **bytes**: `object`

Defined in: [packages/algo-ts/src/primitives.ts:101](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L101)

A sequence of zero or more bytes (ie. byte[])

## Type declaration

### length

> `readonly` **length**: [`uint64`](uint64.md)

Retrieve the length of the byte sequence

### at()

Retrieve the byte at the index i

#### Parameters

##### i

[`Uint64Compat`](Uint64Compat.md)

The index to read. Can be negative to read from the end

#### Returns

[`bytes`](bytes.md)

The byte found at the index, or an empty bytes value

### bitwiseAnd()

Perform a bitwise AND operation with this bytes value and another bytes value.

The shorter of the two values will be zero-left extended to the larger length.

#### Parameters

##### other

[`BytesCompat`](BytesCompat.md)

The other bytes value

#### Returns

[`bytes`](bytes.md)

The bitwise operation result

### bitwiseInvert()

Perform a bitwise INVERT operation with this bytes value

#### Returns

[`bytes`](bytes.md)

The bitwise operation result

### bitwiseOr()

Perform a bitwise OR operation with this bytes value and another bytes value

The shorter of the two values will be zero-left extended to the larger length.

#### Parameters

##### other

[`BytesCompat`](BytesCompat.md)

The other bytes value

#### Returns

[`bytes`](bytes.md)

The bitwise operation result

### bitwiseXor()

Perform a bitwise XOR operation with this bytes value and another bytes value.

The shorter of the two values will be zero-left extended to the larger length.

#### Parameters

##### other

[`BytesCompat`](BytesCompat.md)

The other bytes value

#### Returns

[`bytes`](bytes.md)

The bitwise operation result

### concat()

Concatenate this bytes value with another bytes value

#### Parameters

##### other

[`BytesCompat`](BytesCompat.md)

The other bytes value

#### Returns

[`bytes`](bytes.md)

The concatenation result

### equals()

Compares this bytes value with another.

#### Parameters

##### other

[`BytesCompat`](BytesCompat.md)

The other bytes value

#### Returns

`boolean`

True if both values represent the same byte sequence

### slice()

#### Call Signature

Returns a copy of this bytes sequence

##### Returns

[`bytes`](bytes.md)

#### Call Signature

Returns a slice of this bytes sequence from the specified start to the end

##### Parameters

###### start

[`Uint64Compat`](Uint64Compat.md)

The index to start slicing from. Can be negative to count from the end.

##### Returns

[`bytes`](bytes.md)

#### Call Signature

Returns a slice of this bytes sequence from the specified start to the specified end

##### Parameters

###### start

[`Uint64Compat`](Uint64Compat.md)

The index to start slicing from. Can be negative to count from the end.

###### end

[`Uint64Compat`](Uint64Compat.md)

The index to end the slice. Can be negative to count from the end.

##### Returns

[`bytes`](bytes.md)

### toString()

Interpret this byte sequence as a utf-8 string

#### Returns

`string`
