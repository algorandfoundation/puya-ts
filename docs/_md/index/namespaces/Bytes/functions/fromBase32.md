---
title: fromBase32
type: function
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../../README.md)

***

[Algorand TypeScript](../../../../modules.md) / [index](../../../README.md) / [Bytes](../README.md) / fromBase32

# Function: fromBase32()

## Call Signature

> **fromBase32**(`b32`): [`bytes`](../../../type-aliases/bytes.md)\<[`uint64`](../../../type-aliases/uint64.md)\>

Defined in: [primitives.ts:336](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L336)

Create a new bytes value from a base 32 encoded string

### Parameters

#### b32

`string`

A literal string of b32 encoded characters

### Returns

[`bytes`](../../../type-aliases/bytes.md)\<[`uint64`](../../../type-aliases/uint64.md)\>

## Call Signature

> **fromBase32**\<`TLength`\>(`b32`, `options`): [`bytes`](../../../type-aliases/bytes.md)\<`TLength`\>

Defined in: [primitives.ts:342](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L342)

Create a new bytes value from a base 32 encoded string

### Type Parameters

#### TLength

`TLength` *extends* [`uint64`](../../../type-aliases/uint64.md)

### Parameters

#### b32

`string`

A literal string of b32 encoded characters

#### options

[`ToFixedBytesOptions`](../../../-internal-/type-aliases/ToFixedBytesOptions.md)\<`TLength`\>

Options for bounded bytes

### Returns

[`bytes`](../../../type-aliases/bytes.md)\<`TLength`\>
