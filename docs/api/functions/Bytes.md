[**@algorandfoundation/algorand-typescript**](../README.md)

***

[@algorandfoundation/algorand-typescript](../README.md) / Bytes

# Function: Bytes()

## Call Signature

> **Bytes**(`value`, ...`replacements`): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:110](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L110)

Create a byte array from a string interpolation template and compatible replacements

### Parameters

#### value

`TemplateStringsArray`

#### replacements

...[`BytesCompat`](../type-aliases/BytesCompat.md)[]

### Returns

[`bytes`](../type-aliases/bytes.md)

## Call Signature

> **Bytes**(`value`): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:114](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L114)

Create a byte array from a utf8 string

### Parameters

#### value

`string`

### Returns

[`bytes`](../type-aliases/bytes.md)

## Call Signature

> **Bytes**(`value`): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:118](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L118)

No op, returns the provided byte array.

### Parameters

#### value

[`bytes`](../type-aliases/bytes.md)

### Returns

[`bytes`](../type-aliases/bytes.md)

## Call Signature

> **Bytes**(`value`): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:122](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L122)

Create a byte array from a biguint value encoded as a variable length big-endian number

### Parameters

#### value

[`biguint`](../type-aliases/biguint.md)

### Returns

[`bytes`](../type-aliases/bytes.md)

## Call Signature

> **Bytes**(`value`): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:126](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L126)

Create a byte array from a uint64 value encoded as a fixed length 64-bit number

### Parameters

#### value

[`uint64`](../type-aliases/uint64.md)

### Returns

[`bytes`](../type-aliases/bytes.md)

## Call Signature

> **Bytes**(`value`): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:130](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L130)

Create a byte array from an Iterable<uint64> where each item is interpreted as a single byte and must be between 0 and 255 inclusively

### Parameters

#### value

`Iterable`\<[`uint64`](../type-aliases/uint64.md)\>

### Returns

[`bytes`](../type-aliases/bytes.md)

## Call Signature

> **Bytes**(): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:134](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L134)

Create an empty byte array

### Returns

[`bytes`](../type-aliases/bytes.md)
