[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / StaticBytes

# Class: StaticBytes\<TLength\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:548](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L548)

A fixed length sequence of bytes

## Extends

- [`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md)\<[`Byte`](Byte.md)\>

## Type Parameters

### TLength

`TLength` *extends* `number` = `0`

## Indexable

\[`index`: [`uint64`](../../index/type-aliases/uint64.md)\]: [`Byte`](Byte.md)

## Constructors

### Constructor

> **new StaticBytes**\<`TLength`\>(`value`?): `StaticBytes`\<`TLength`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:556](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L556)

Create a new StaticBytes instance

#### Parameters

##### value?

THe bytes or utf8 interpreted string to initialize this type

`string` | [`bytes`](../../index/type-aliases/bytes.md)

#### Returns

`StaticBytes`\<`TLength`\>

#### Overrides

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`constructor`](../-internal-/classes/Arc4ArrayBase.md#constructor)

## Accessors

### bytes

#### Get Signature

> **get** **bytes**(): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:97](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L97)

Retrieve the encoded bytes for this type

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)

#### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`bytes`](../-internal-/classes/Arc4ArrayBase.md#bytes)

***

### length

#### Get Signature

> **get** **length**(): [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:240](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L240)

Returns the current length of this array

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

#### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`length`](../-internal-/classes/Arc4ArrayBase.md#length)

***

### native

#### Get Signature

> **get** **native**(): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:563](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L563)

Get the native bytes value

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)

## Methods

### \[iterator\]()

> **\[iterator\]**(): [`IterableIterator`](../../index/-internal-/interfaces/IterableIterator.md)\<[`Byte`](Byte.md)\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:277](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L277)

Returns an iterator for the items in this array

#### Returns

[`IterableIterator`](../../index/-internal-/interfaces/IterableIterator.md)\<[`Byte`](Byte.md)\>

#### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`[iterator]`](../-internal-/classes/Arc4ArrayBase.md#iterator)

***

### at()

> **at**(`index`): [`Byte`](Byte.md)

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:249](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L249)

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

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:571](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L571)

Returns a dynamic bytes object containing all bytes from _this_ and _other_

#### Parameters

##### other

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md)\<[`Byte`](Byte.md)\>

Another array of bytes to concat with this one

#### Returns

[`DynamicBytes`](DynamicBytes.md)

***

### entries()

> **entries**(): [`IterableIterator`](../../index/-internal-/interfaces/IterableIterator.md)\<readonly \[[`uint64`](../../index/type-aliases/uint64.md), [`Byte`](Byte.md)\]\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:284](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L284)

Returns an iterator for a tuple of the indexes and items in this array

#### Returns

[`IterableIterator`](../../index/-internal-/interfaces/IterableIterator.md)\<readonly \[[`uint64`](../../index/type-aliases/uint64.md), [`Byte`](Byte.md)\]\>

#### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`entries`](../-internal-/classes/Arc4ArrayBase.md#entries)

***

### keys()

> **keys**(): [`IterableIterator`](../../index/-internal-/interfaces/IterableIterator.md)\<[`uint64`](../../index/type-aliases/uint64.md)\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:291](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L291)

Returns an iterator for the indexes in this array

#### Returns

[`IterableIterator`](../../index/-internal-/interfaces/IterableIterator.md)\<[`uint64`](../../index/type-aliases/uint64.md)\>

#### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`keys`](../-internal-/classes/Arc4ArrayBase.md#keys)

***

### slice()

#### Call Signature

> **slice**(): [`DynamicArray`](DynamicArray.md)\<[`Byte`](Byte.md)\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:256](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L256)

**`Internal`**

Create a new Dynamic array with all items from this array

##### Returns

[`DynamicArray`](DynamicArray.md)\<[`Byte`](Byte.md)\>

##### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`slice`](../-internal-/classes/Arc4ArrayBase.md#slice)

#### Call Signature

> **slice**(`end`): [`DynamicArray`](DynamicArray.md)\<[`Byte`](Byte.md)\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:262](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L262)

**`Internal`**

Create a new DynamicArray with all items up till `end`.
Negative indexes are taken from the end.

##### Parameters

###### end

[`Uint64Compat`](../../index/type-aliases/Uint64Compat.md)

An index in which to stop copying items.

##### Returns

[`DynamicArray`](DynamicArray.md)\<[`Byte`](Byte.md)\>

##### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`slice`](../-internal-/classes/Arc4ArrayBase.md#slice)

#### Call Signature

> **slice**(`start`, `end`): [`DynamicArray`](DynamicArray.md)\<[`Byte`](Byte.md)\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:269](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L269)

**`Internal`**

Create a new DynamicArray with items from `start`, up until `end`
Negative indexes are taken from the end.

##### Parameters

###### start

[`Uint64Compat`](../../index/type-aliases/Uint64Compat.md)

An index in which to start copying items.

###### end

[`Uint64Compat`](../../index/type-aliases/Uint64Compat.md)

An index in which to stop copying items

##### Returns

[`DynamicArray`](DynamicArray.md)\<[`Byte`](Byte.md)\>

##### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`slice`](../-internal-/classes/Arc4ArrayBase.md#slice)
