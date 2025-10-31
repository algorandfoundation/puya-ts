---
title: Arc4ArrayBase
type: class
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../README.md)

***

[Algorand TypeScript](../../../modules.md) / [arc4](../../README.md) / [\<internal\>](../README.md) / Arc4ArrayBase

# Class: `abstract` Arc4ArrayBase\<TItem\>

Defined in: [arc4/encoded-types.ts:237](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L237)

A base type for arc4 array types

## Extends

- [`ARC4Encoded`](../../classes/ARC4Encoded.md)

## Extended by

- [`StaticArray`](../../classes/StaticArray.md)
- [`DynamicArray`](../../classes/DynamicArray.md)
- [`Address`](../../classes/Address.md)
- [`DynamicBytes`](../../classes/DynamicBytes.md)
- [`StaticBytes`](../../classes/StaticBytes.md)

## Type Parameters

### TItem

`TItem` *extends* [`ARC4Encoded`](../../classes/ARC4Encoded.md)

## Implements

- `ConcatArray`\<`TItem`\>

## Indexable

\[`index`: [`uint64`](../../../index/type-aliases/uint64.md)\]: `TItem`

Get or set the item at the specified index.
Negative indexes are not supported

## Constructors

### Constructor

> `protected` **new Arc4ArrayBase**\<`TItem`\>(): `Arc4ArrayBase`\<`TItem`\>

Defined in: [arc4/encoded-types.ts:238](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L238)

#### Returns

`Arc4ArrayBase`\<`TItem`\>

#### Overrides

[`ARC4Encoded`](../../classes/ARC4Encoded.md).[`constructor`](../../classes/ARC4Encoded.md#constructor)

## Accessors

### bytes

#### Get Signature

> **get** **bytes**(): [`bytes`](../../../index/type-aliases/bytes.md)

Defined in: [arc4/encoded-types.ts:102](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L102)

Retrieve the encoded bytes for this type

##### Returns

[`bytes`](../../../index/type-aliases/bytes.md)

#### Inherited from

[`ARC4Encoded`](../../classes/ARC4Encoded.md).[`bytes`](../../classes/ARC4Encoded.md#bytes)

***

### length

#### Get Signature

> **get** **length**(): [`uint64`](../../../index/type-aliases/uint64.md)

Defined in: [arc4/encoded-types.ts:245](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L245)

Returns the current length of this array

##### Returns

[`uint64`](../../../index/type-aliases/uint64.md)

#### Implementation of

`ConcatArray.length`

## Methods

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`TItem`\>

Defined in: [arc4/encoded-types.ts:292](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L292)

Returns an iterator for the items in this array

#### Returns

`IterableIterator`\<`TItem`\>

***

### at()

> **at**(`index`): `TItem`

Defined in: [arc4/encoded-types.ts:254](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L254)

Returns the item at the given index.
Negative indexes are taken from the end.

#### Parameters

##### index

[`Uint64Compat`](../../../index/type-aliases/Uint64Compat.md)

The index of the item to retrieve

#### Returns

`TItem`

***

### entries()

> **entries**(): `IterableIterator`\<readonly \[[`uint64`](../../../index/type-aliases/uint64.md), `TItem`\]\>

Defined in: [arc4/encoded-types.ts:299](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L299)

Returns an iterator for a tuple of the indexes and items in this array

#### Returns

`IterableIterator`\<readonly \[[`uint64`](../../../index/type-aliases/uint64.md), `TItem`\]\>

***

### ~~join()~~

> **join**(`separator?`): `string`

Defined in: [arc4/encoded-types.ts:285](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L285)

Creates a string by concatenating all the items in the array delimited by the
specified separator (or ',' by default)

#### Parameters

##### separator?

`string`

#### Returns

`string`

#### Deprecated

Join is not supported in Algorand TypeScript

#### Implementation of

`ConcatArray.join`

***

### keys()

> **keys**(): `IterableIterator`\<[`uint64`](../../../index/type-aliases/uint64.md)\>

Defined in: [arc4/encoded-types.ts:306](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L306)

Returns an iterator for the indexes in this array

#### Returns

`IterableIterator`\<[`uint64`](../../../index/type-aliases/uint64.md)\>

***

### ~~slice()~~

#### Call Signature

> **slice**(): `TItem`[]

Defined in: [arc4/encoded-types.ts:261](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L261)

##### Returns

`TItem`[]

##### Deprecated

Array slicing is not yet supported in Algorand TypeScript
Create a new Dynamic array with all items from this array

##### Implementation of

`ConcatArray.slice`

#### Call Signature

> **slice**(`end`): `TItem`[]

Defined in: [arc4/encoded-types.ts:267](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L267)

##### Parameters

###### end

[`Uint64Compat`](../../../index/type-aliases/Uint64Compat.md)

An index in which to stop copying items.

##### Returns

`TItem`[]

##### Deprecated

Array slicing is not yet supported in Algorand TypeScript
Create a new DynamicArray with all items up till `end`.
Negative indexes are taken from the end.

##### Implementation of

`ConcatArray.slice`

#### Call Signature

> **slice**(`start`, `end`): `TItem`[]

Defined in: [arc4/encoded-types.ts:274](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L274)

##### Parameters

###### start

[`Uint64Compat`](../../../index/type-aliases/Uint64Compat.md)

An index in which to start copying items.

###### end

[`Uint64Compat`](../../../index/type-aliases/Uint64Compat.md)

An index in which to stop copying items

##### Returns

`TItem`[]

##### Deprecated

Array slicing is not yet supported in Algorand TypeScript
Create a new DynamicArray with items from `start`, up until `end`
Negative indexes are taken from the end.

##### Implementation of

`ConcatArray.slice`
