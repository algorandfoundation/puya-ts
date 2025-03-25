[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [index](../README.md) / BoxMap

# Function: BoxMap()

> **BoxMap**\<`TKey`, `TValue`\>(`options`): [`BoxMap`](../type-aliases/BoxMap.md)\<`TKey`, `TValue`\>

Defined in: [packages/algo-ts/src/box.ts:207](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L207)

Creates a BoxMap proxy object offering methods of getting and setting a set of values stored in individual boxes indexed by a common key type

## Type Parameters

• **TKey**

The type of the value used to key each box. This key will be encoded to bytes and prefixed with `keyPrefix`

• **TValue**

The type of the data stored in the box. This value will be encoded to bytes when stored and decoded on retrieval.

## Parameters

### options

[`CreateBoxMapOptions`](../-internal-/interfaces/CreateBoxMapOptions.md)

Options for creating the BoxMap proxy

## Returns

[`BoxMap`](../type-aliases/BoxMap.md)\<`TKey`, `TValue`\>
