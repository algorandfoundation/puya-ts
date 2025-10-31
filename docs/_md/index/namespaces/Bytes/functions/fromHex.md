---
title: fromHex
type: function
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../../README.md)

***

[Algorand TypeScript](../../../../modules.md) / [index](../../../README.md) / [Bytes](../README.md) / fromHex

# Function: fromHex()

## Call Signature

> **fromHex**(`hex`): [`bytes`](../../../type-aliases/bytes.md)\<[`uint64`](../../../type-aliases/uint64.md)\>

Defined in: [primitives.ts:306](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L306)

Create a new bytes value from a hexadecimal encoded string

### Parameters

#### hex

`string`

A literal string of hexadecimal characters

### Returns

[`bytes`](../../../type-aliases/bytes.md)\<[`uint64`](../../../type-aliases/uint64.md)\>

## Call Signature

> **fromHex**\<`TLength`\>(`hex`, `options`): [`bytes`](../../../type-aliases/bytes.md)\<`TLength`\>

Defined in: [primitives.ts:312](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L312)

Create a new bytes value from a hexadecimal encoded string

### Type Parameters

#### TLength

`TLength` *extends* [`uint64`](../../../type-aliases/uint64.md)

### Parameters

#### hex

`string`

A literal string of hexadecimal characters

#### options

[`ToFixedBytesOptions`](../../../-internal-/type-aliases/ToFixedBytesOptions.md)\<`TLength`\>

Options for bounded bytes

### Returns

[`bytes`](../../../type-aliases/bytes.md)\<`TLength`\>
