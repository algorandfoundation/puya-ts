---
title: BoxMap
type: function
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / BoxMap

# Function: BoxMap()

> **BoxMap**\<`TKey`, `TValue`\>(`options`): [`BoxMap`](../type-aliases/BoxMap.md)\<`TKey`, `TValue`\>

Defined in: [box.ts:151](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L151)

Creates a BoxMap proxy object offering methods of getting and setting a set of values stored in individual boxes indexed by a common key type

## Type Parameters

### TKey

`TKey`

The type of the value used to key each box. This key will be encoded to bytes and prefixed with `keyPrefix`

### TValue

`TValue`

The type of the data stored in the box. This value will be encoded to bytes when stored and decoded on retrieval.

## Parameters

### options

[`CreateBoxMapOptions`](../-internal-/interfaces/CreateBoxMapOptions.md)

Options for creating the BoxMap proxy

## Returns

[`BoxMap`](../type-aliases/BoxMap.md)\<`TKey`, `TValue`\>
