---
title: StaticBytes
type: class
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / StaticBytes

# Class: StaticBytes\<TLength\>

Defined in: [arc4/encoded-types.ts:535](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L535)

A fixed length sequence of bytes

## Extends

- [`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md)\<[`Byte`](Byte.md)\>

## Type Parameters

### TLength

`TLength` *extends* [`uint64`](../../index/type-aliases/uint64.md) = `0`

## Indexable

\[`index`: [`uint64`](../../index/type-aliases/uint64.md)\]: [`Byte`](Byte.md)

Get or set the item at the specified index.
Negative indexes are not supported

## Constructors

### Constructor

> **new StaticBytes**\<`TLength`\>(`value`): `StaticBytes`\<`TLength`\>

Defined in: [arc4/encoded-types.ts:543](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L543)

Create a new StaticBytes instance from native fixed sized bytes

#### Parameters

##### value

[`bytes`](../../index/type-aliases/bytes.md)\<`TLength`\>

The bytes

#### Returns

`StaticBytes`\<`TLength`\>

#### Overrides

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`constructor`](../-internal-/classes/Arc4ArrayBase.md#constructor)

### Constructor

> **new StaticBytes**\<`TLength`\>(`value`): `StaticBytes`\<`TLength`\>

Defined in: [arc4/encoded-types.ts:548](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L548)

Create a new StaticBytes instance from native bytes

#### Parameters

##### value

[`bytes`](../../index/type-aliases/bytes.md)

The bytes

#### Returns

`StaticBytes`\<`TLength`\>

#### Overrides

`Arc4ArrayBase<Byte>.constructor`

### Constructor

> **new StaticBytes**\<`TLength`\>(`value`): `StaticBytes`\<`TLength`\>

Defined in: [arc4/encoded-types.ts:553](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L553)

Create a new StaticBytes instance from a utf8 string

#### Parameters

##### value

`string`

A string

#### Returns

`StaticBytes`\<`TLength`\>

#### Overrides

`Arc4ArrayBase<Byte>.constructor`

### Constructor

> **new StaticBytes**\<`TLength`\>(): `StaticBytes`\<`TLength`\>

Defined in: [arc4/encoded-types.ts:557](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L557)

Create a new StaticBytes instance of length 0

#### Returns

`StaticBytes`\<`TLength`\>

#### Overrides

`Arc4ArrayBase<Byte>.constructor`

## Accessors

### bytes

#### Get Signature

> **get** **bytes**(): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [arc4/encoded-types.ts:102](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L102)

Retrieve the encoded bytes for this type

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)

#### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`bytes`](../-internal-/classes/Arc4ArrayBase.md#bytes)

***

### length

#### Get Signature

> **get** **length**(): [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [arc4/encoded-types.ts:580](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L580)

Returns the statically declared length of this byte array

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

#### Overrides

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`length`](../-internal-/classes/Arc4ArrayBase.md#length)

***

### native

#### Get Signature

> **get** **native**(): [`bytes`](../../index/type-aliases/bytes.md)\<`TLength`\>

Defined in: [arc4/encoded-types.ts:565](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L565)

Get the native bytes value

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)\<`TLength`\>

## Methods

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<[`Byte`](Byte.md)\>

Defined in: [arc4/encoded-types.ts:292](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L292)

Returns an iterator for the items in this array

#### Returns

`IterableIterator`\<[`Byte`](Byte.md)\>

#### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`[iterator]`](../-internal-/classes/Arc4ArrayBase.md#iterator)

***

### at()

> **at**(`index`): [`Byte`](Byte.md)

Defined in: [arc4/encoded-types.ts:254](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L254)

Returns the item at the given index.
Negative indexes are taken from the end.

#### Parameters

##### index

[`Uint64Compat`](../../index/type-aliases/Uint64Compat.md)

The index of the item to retrieve

#### Returns

[`Byte`](Byte.md)

#### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`at`](../-internal-/classes/Arc4ArrayBase.md#at)

***

### concat()

> **concat**(`other`): [`DynamicBytes`](DynamicBytes.md)

Defined in: [arc4/encoded-types.ts:573](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L573)

Returns a dynamic bytes object containing all bytes from _this_ and _other_

#### Parameters

##### other

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md)\<[`Byte`](Byte.md)\>

Another array of bytes to concat with this one

#### Returns

[`DynamicBytes`](DynamicBytes.md)

***

### entries()

> **entries**(): `IterableIterator`\<readonly \[[`uint64`](../../index/type-aliases/uint64.md), [`Byte`](Byte.md)\]\>

Defined in: [arc4/encoded-types.ts:299](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L299)

Returns an iterator for a tuple of the indexes and items in this array

#### Returns

`IterableIterator`\<readonly \[[`uint64`](../../index/type-aliases/uint64.md), [`Byte`](Byte.md)\]\>

#### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`entries`](../-internal-/classes/Arc4ArrayBase.md#entries)

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

#### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`join`](../-internal-/classes/Arc4ArrayBase.md#join)

***

### keys()

> **keys**(): `IterableIterator`\<[`uint64`](../../index/type-aliases/uint64.md)\>

Defined in: [arc4/encoded-types.ts:306](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L306)

Returns an iterator for the indexes in this array

#### Returns

`IterableIterator`\<[`uint64`](../../index/type-aliases/uint64.md)\>

#### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`keys`](../-internal-/classes/Arc4ArrayBase.md#keys)

***

### ~~slice()~~

#### Call Signature

> **slice**(): [`Byte`](Byte.md)[]

Defined in: [arc4/encoded-types.ts:261](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L261)

##### Returns

[`Byte`](Byte.md)[]

##### Deprecated

Array slicing is not yet supported in Algorand TypeScript
Create a new Dynamic array with all items from this array

##### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`slice`](../-internal-/classes/Arc4ArrayBase.md#slice)

#### Call Signature

> **slice**(`end`): [`Byte`](Byte.md)[]

Defined in: [arc4/encoded-types.ts:267](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L267)

##### Parameters

###### end

[`Uint64Compat`](../../index/type-aliases/Uint64Compat.md)

An index in which to stop copying items.

##### Returns

[`Byte`](Byte.md)[]

##### Deprecated

Array slicing is not yet supported in Algorand TypeScript
Create a new DynamicArray with all items up till `end`.
Negative indexes are taken from the end.

##### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`slice`](../-internal-/classes/Arc4ArrayBase.md#slice)

#### Call Signature

> **slice**(`start`, `end`): [`Byte`](Byte.md)[]

Defined in: [arc4/encoded-types.ts:274](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L274)

##### Parameters

###### start

[`Uint64Compat`](../../index/type-aliases/Uint64Compat.md)

An index in which to start copying items.

###### end

[`Uint64Compat`](../../index/type-aliases/Uint64Compat.md)

An index in which to stop copying items

##### Returns

[`Byte`](Byte.md)[]

##### Deprecated

Array slicing is not yet supported in Algorand TypeScript
Create a new DynamicArray with items from `start`, up until `end`
Negative indexes are taken from the end.

##### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`slice`](../-internal-/classes/Arc4ArrayBase.md#slice)
