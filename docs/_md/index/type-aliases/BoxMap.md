[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / BoxMap

# Type Alias: BoxMap()\<TKey, TValue\>

> **BoxMap**\<`TKey`, `TValue`\> = [`Box`](Box.md)\<`TValue`\>

Defined in: [packages/algo-ts/src/box.ts:207](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L207)

A BoxMap proxy

## Type Parameters

### TKey

`TKey`

The type of the value used to key each box.

### TValue

`TValue`

The type of the data stored in the box.

> **BoxMap**(`key`): [`Box`](Box.md)\<`TValue`\>

Defined in: [packages/algo-ts/src/box.ts:70](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L70)

A BoxMap proxy

## Parameters

### key

`TKey`

The key of the box to retrieve a proxy for

## Returns

[`Box`](Box.md)\<`TValue`\>

## Properties

### keyPrefix

> `readonly` **keyPrefix**: [`bytes`](bytes.md)

Defined in: [packages/algo-ts/src/box.ts:64](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L64)

Get the bytes used to prefix each key
