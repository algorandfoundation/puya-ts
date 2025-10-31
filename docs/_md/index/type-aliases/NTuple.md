---
title: NTuple
type: doc
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / NTuple

# Type Alias: NTuple\<T, N\>

> **NTuple**\<`T`, `N`\> = `N` *extends* `N` ? `number` *extends* `N` ? `T`[] : [`_TupleOf`](../-internal-/type-aliases/TupleOf.md)\<`T`, `N`, readonly \[\]\> : `never`

Defined in: [primitives.ts:364](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L364)

Declare a homogeneous tuple with the item type T and length N.

Eg.
NTuple<uint64, 3> === [uint64, uint64, uint64]

## Type Parameters

### T

`T`

### N

`N` *extends* `number`
