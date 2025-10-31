---
title: BytesBacked
type: interface
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / BytesBacked

# Interface: BytesBacked\<TLength\>

Defined in: [primitives.ts:351](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L351)

An interface for types which are backed by the AVM bytes type

## Type Parameters

### TLength

`TLength` *extends* [`uint64`](../type-aliases/uint64.md) = [`uint64`](../type-aliases/uint64.md)

## Accessors

### bytes

#### Get Signature

> **get** **bytes**(): [`bytes`](../type-aliases/bytes.md)\<`TLength`\>

Defined in: [primitives.ts:355](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L355)

Retrieve the underlying bytes representing this value

##### Returns

[`bytes`](../type-aliases/bytes.md)\<`TLength`\>
