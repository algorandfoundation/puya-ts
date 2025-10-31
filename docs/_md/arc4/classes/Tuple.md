---
title: Tuple
type: class
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / Tuple

# Class: Tuple\<TTuple\>

Defined in: [arc4/encoded-types.ts:408](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L408)

An arc4 encoded tuple of values

## Extends

- [`ARC4Encoded`](ARC4Encoded.md)

## Type Parameters

### TTuple

`TTuple` *extends* readonly \[[`ARC4Encoded`](ARC4Encoded.md), `...ARC4Encoded[]`\]

A type representing the native tuple of item types

## Constructors

### Constructor

> **new Tuple**\<`TTuple`\>(): `Tuple`\<`TTuple`\>

Defined in: [arc4/encoded-types.ts:415](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L415)

Create a new Tuple with the default zero values for items

#### Returns

`Tuple`\<`TTuple`\>

#### Overrides

[`ARC4Encoded`](ARC4Encoded.md).[`constructor`](ARC4Encoded.md#constructor)

### Constructor

> **new Tuple**\<`TTuple`\>(...`items`): `Tuple`\<`TTuple`\>

Defined in: [arc4/encoded-types.ts:420](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L420)

Create a new Tuple with the specified items

#### Parameters

##### items

...`TTuple`

The tuple items

#### Returns

`Tuple`\<`TTuple`\>

#### Overrides

`ARC4Encoded.constructor`

## Accessors

### bytes

#### Get Signature

> **get** **bytes**(): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [arc4/encoded-types.ts:102](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L102)

Retrieve the encoded bytes for this type

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)

#### Inherited from

[`ARC4Encoded`](ARC4Encoded.md).[`bytes`](ARC4Encoded.md#bytes)

***

### length

#### Get Signature

> **get** **length**(): `TTuple`\[`"length"`\] & `object` & `number`

Defined in: [arc4/encoded-types.ts:436](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L436)

Returns the length of this tuple

##### Returns

`TTuple`\[`"length"`\] & `object` & `number`

***

### native

#### Get Signature

> **get** **native**(): `TTuple`

Defined in: [arc4/encoded-types.ts:443](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L443)

Returns the decoded native tuple (with arc4 encoded items)

##### Returns

`TTuple`

## Methods

### at()

> **at**\<`TIndex`\>(`index`): `TTuple`\[`TIndex`\]

Defined in: [arc4/encoded-types.ts:429](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L429)

Returns the item at the specified index

#### Type Parameters

##### TIndex

`TIndex` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### index

`TIndex`

The index of the item to get. Must be a positive literal representing a tuple index

#### Returns

`TTuple`\[`TIndex`\]
