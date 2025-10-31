---
title: log
type: function
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / log

# Function: log()

> **log**(...`args`): `void`

Defined in: [util.ts:10](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/util.ts#L10)

Write one or more values to the transaction log.

Each value is converted to bytes and concatenated

## Parameters

### args

...(`string` \| `number` \| `bigint` \| `boolean` \| [`uint64`](../type-aliases/uint64.md) \| [`bytes`](../type-aliases/bytes.md)\<[`uint64`](../type-aliases/uint64.md)\> \| [`BytesBacked`](../interfaces/BytesBacked.md)\<[`uint64`](../type-aliases/uint64.md)\>)[]

The values to write

## Returns

`void`
