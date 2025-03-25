[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [index](../README.md) / BoxMap

# Type Alias: BoxMap()\<TKey, TValue\>

> **BoxMap**\<`TKey`, `TValue`\>: (`key`) => [`Box`](Box.md)\<`TValue`\>

Defined in: [packages/algo-ts/src/box.ts:207](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L207)

A BoxMap proxy

## Type Parameters

• **TKey**

The type of the value used to key each box.

• **TValue**

The type of the data stored in the box.

## Type declaration

Get a Box proxy for a single item in the BoxMap

## Parameters

### key

`TKey`

The key of the box to retrieve a proxy for

## Returns

[`Box`](Box.md)\<`TValue`\>

### keyPrefix

> `readonly` **keyPrefix**: [`bytes`](bytes.md)

Get the bytes used to prefix each key
