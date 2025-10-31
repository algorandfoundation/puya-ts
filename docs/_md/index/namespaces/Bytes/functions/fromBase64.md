---
title: fromBase64
type: function
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../../README.md)

***

[Algorand TypeScript](../../../../modules.md) / [index](../../../README.md) / [Bytes](../README.md) / fromBase64

# Function: fromBase64()

## Call Signature

> **fromBase64**(`b64`): [`bytes`](../../../type-aliases/bytes.md)\<[`uint64`](../../../type-aliases/uint64.md)\>

Defined in: [primitives.ts:321](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L321)

Create a new bytes value from a base 64 encoded string

### Parameters

#### b64

`string`

A literal string of b64 encoded characters

### Returns

[`bytes`](../../../type-aliases/bytes.md)\<[`uint64`](../../../type-aliases/uint64.md)\>

## Call Signature

> **fromBase64**\<`TLength`\>(`b64`, `options`): [`bytes`](../../../type-aliases/bytes.md)\<`TLength`\>

Defined in: [primitives.ts:327](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L327)

Create a new bytes value from a base 64 encoded string

### Type Parameters

#### TLength

`TLength` *extends* [`uint64`](../../../type-aliases/uint64.md)

### Parameters

#### b64

`string`

A literal string of b64 encoded characters

#### options

[`ToFixedBytesOptions`](../../../-internal-/type-aliases/ToFixedBytesOptions.md)\<`TLength`\>

Options for bounded bytes

### Returns

[`bytes`](../../../type-aliases/bytes.md)\<`TLength`\>
