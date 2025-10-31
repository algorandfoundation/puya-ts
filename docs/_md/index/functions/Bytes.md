---
title: Bytes
type: function
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / Bytes

# Function: Bytes()

## Call Signature

> **Bytes**(`value`, ...`replacements`): [`bytes`](../type-aliases/bytes.md)\<[`uint64`](../type-aliases/uint64.md)\>

Defined in: [primitives.ts:245](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L245)

Create a byte array from a string interpolation template and compatible replacements

### Parameters

#### value

`TemplateStringsArray`

#### replacements

...[`BytesCompat`](../type-aliases/BytesCompat.md)[]

### Returns

[`bytes`](../type-aliases/bytes.md)\<[`uint64`](../type-aliases/uint64.md)\>

## Call Signature

> **Bytes**(`value`): [`bytes`](../type-aliases/bytes.md)\<[`uint64`](../type-aliases/uint64.md)\>

Defined in: [primitives.ts:249](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L249)

Create a byte array from a utf8 string

### Parameters

#### value

`string`

### Returns

[`bytes`](../type-aliases/bytes.md)\<[`uint64`](../type-aliases/uint64.md)\>

## Call Signature

> **Bytes**\<`TLength`\>(`value`, `options`): [`bytes`](../type-aliases/bytes.md)\<`TLength`\>

Defined in: [primitives.ts:253](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L253)

Create a byte array from a utf8 string

### Type Parameters

#### TLength

`TLength` *extends* [`uint64`](../type-aliases/uint64.md)

### Parameters

#### value

`string`

#### options

[`ToFixedBytesOptions`](../-internal-/type-aliases/ToFixedBytesOptions.md)\<`TLength`\>

### Returns

[`bytes`](../type-aliases/bytes.md)\<`TLength`\>

## Call Signature

> **Bytes**(`value`): [`bytes`](../type-aliases/bytes.md)\<[`uint64`](../type-aliases/uint64.md)\>

Defined in: [primitives.ts:257](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L257)

No op, returns the provided byte array.

### Parameters

#### value

[`bytes`](../type-aliases/bytes.md)

### Returns

[`bytes`](../type-aliases/bytes.md)\<[`uint64`](../type-aliases/uint64.md)\>

## Call Signature

> **Bytes**\<`TLength`\>(`value`, `options`): [`bytes`](../type-aliases/bytes.md)\<`TLength`\>

Defined in: [primitives.ts:261](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L261)

No op, returns the provided byte array.

### Type Parameters

#### TLength

`TLength` *extends* [`uint64`](../type-aliases/uint64.md)

### Parameters

#### value

[`bytes`](../type-aliases/bytes.md)

#### options

[`ToFixedBytesOptions`](../-internal-/type-aliases/ToFixedBytesOptions.md)\<`TLength`\>

### Returns

[`bytes`](../type-aliases/bytes.md)\<`TLength`\>

## Call Signature

> **Bytes**(`value`): [`bytes`](../type-aliases/bytes.md)\<[`uint64`](../type-aliases/uint64.md)\>

Defined in: [primitives.ts:265](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L265)

Create a byte array from a biguint value encoded as a variable length big-endian number

### Parameters

#### value

[`biguint`](../type-aliases/biguint.md)

### Returns

[`bytes`](../type-aliases/bytes.md)\<[`uint64`](../type-aliases/uint64.md)\>

## Call Signature

> **Bytes**\<`TLength`\>(`value`, `options`): [`bytes`](../type-aliases/bytes.md)\<`TLength`\>

Defined in: [primitives.ts:269](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L269)

Create a byte array from a biguint value encoded as a variable length big-endian number

### Type Parameters

#### TLength

`TLength` *extends* [`uint64`](../type-aliases/uint64.md)

### Parameters

#### value

[`biguint`](../type-aliases/biguint.md)

#### options

[`ToFixedBytesOptions`](../-internal-/type-aliases/ToFixedBytesOptions.md)\<`TLength`\>

### Returns

[`bytes`](../type-aliases/bytes.md)\<`TLength`\>

## Call Signature

> **Bytes**(`value`): [`bytes`](../type-aliases/bytes.md)\<[`uint64`](../type-aliases/uint64.md)\>

Defined in: [primitives.ts:273](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L273)

Create a byte array from a uint64 value encoded as a a variable length 64-bit number

### Parameters

#### value

[`uint64`](../type-aliases/uint64.md)

### Returns

[`bytes`](../type-aliases/bytes.md)\<[`uint64`](../type-aliases/uint64.md)\>

## Call Signature

> **Bytes**\<`TLength`\>(`value`, `options`): [`bytes`](../type-aliases/bytes.md)\<`TLength`\>

Defined in: [primitives.ts:277](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L277)

Create a byte array from a uint64 value encoded as a a variable length 64-bit number

### Type Parameters

#### TLength

`TLength` *extends* [`uint64`](../type-aliases/uint64.md) = `8`

### Parameters

#### value

[`uint64`](../type-aliases/uint64.md)

#### options

[`ToFixedBytesOptions`](../-internal-/type-aliases/ToFixedBytesOptions.md)\<`TLength`\>

### Returns

[`bytes`](../type-aliases/bytes.md)\<`TLength`\>

## Call Signature

> **Bytes**(`value`): [`bytes`](../type-aliases/bytes.md)\<[`uint64`](../type-aliases/uint64.md)\>

Defined in: [primitives.ts:281](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L281)

Create a byte array from an Iterable<uint64> where each item is interpreted as a single byte and must be between 0 and 255 inclusively

### Parameters

#### value

`Iterable`\<[`uint64`](../type-aliases/uint64.md)\>

### Returns

[`bytes`](../type-aliases/bytes.md)\<[`uint64`](../type-aliases/uint64.md)\>

## Call Signature

> **Bytes**\<`TLength`\>(`value`, `options`): [`bytes`](../type-aliases/bytes.md)\<`TLength`\>

Defined in: [primitives.ts:285](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L285)

Create a byte array from an Iterable<uint64> where each item is interpreted as a single byte and must be between 0 and 255 inclusively

### Type Parameters

#### TLength

`TLength` *extends* [`uint64`](../type-aliases/uint64.md)

### Parameters

#### value

`Iterable`\<[`uint64`](../type-aliases/uint64.md)\>

#### options

[`ToFixedBytesOptions`](../-internal-/type-aliases/ToFixedBytesOptions.md)\<`TLength`\>

### Returns

[`bytes`](../type-aliases/bytes.md)\<`TLength`\>

## Call Signature

> **Bytes**(): [`bytes`](../type-aliases/bytes.md)\<[`uint64`](../type-aliases/uint64.md)\>

Defined in: [primitives.ts:289](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L289)

Create an empty byte array

### Returns

[`bytes`](../type-aliases/bytes.md)\<[`uint64`](../type-aliases/uint64.md)\>

## Call Signature

> **Bytes**\<`TLength`\>(`options`): [`bytes`](../type-aliases/bytes.md)\<`TLength`\>

Defined in: [primitives.ts:293](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L293)

Create an empty byte array

### Type Parameters

#### TLength

`TLength` *extends* [`uint64`](../type-aliases/uint64.md) = [`uint64`](../type-aliases/uint64.md)

### Parameters

#### options

[`ToFixedBytesOptions`](../-internal-/type-aliases/ToFixedBytesOptions.md)\<`TLength`\>

### Returns

[`bytes`](../type-aliases/bytes.md)\<`TLength`\>
