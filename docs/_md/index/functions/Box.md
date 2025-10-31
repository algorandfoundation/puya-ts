---
title: Box
type: function
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / Box

# Function: Box()

> **Box**\<`TValue`\>(`options`): [`Box`](../type-aliases/Box.md)\<`TValue`\>

Defined in: [box.ts:131](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L131)

Creates a Box proxy object offering methods of getting and setting the value stored in a single box.

## Type Parameters

### TValue

`TValue`

The type of the data stored in the box. This value will be encoded to bytes when stored and decoded on retrieval.

## Parameters

### options

[`CreateBoxOptions`](../-internal-/interfaces/CreateBoxOptions.md)

Options for creating the Box proxy

## Returns

[`Box`](../type-aliases/Box.md)\<`TValue`\>
