[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [arc4](../README.md) / StaticArray

# Class: StaticArray\<TItem, TLength\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:307](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L307)

A fixed sized array of arc4 items

## Extends

- [`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md)\<`TItem`\>

## Type Parameters

### TItem

`TItem` *extends* [`ARC4Encoded`](ARC4Encoded.md)

The type of a single item in the array

### TLength

`TLength` *extends* `number`

The fixed length of the array

## Indexable

\[`index`: [`uint64`](../../index/type-aliases/uint64.md)\]: `TItem`

## Constructors

### Constructor

> **new StaticArray**\<`TItem`, `TLength`\>(): `StaticArray`\<`TItem`, `TLength`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:314](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L314)

Create a new StaticArray instance

#### Returns

`StaticArray`\<`TItem`, `TLength`\>

#### Overrides

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`constructor`](../-internal-/classes/Arc4ArrayBase.md#constructor)

### Constructor

> **new StaticArray**\<`TItem`, `TLength`\>(...`items`): `StaticArray`\<`TItem`, `TLength`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:319](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L319)

Create a new StaticArray instance with the specified items

#### Parameters

##### items

...`TItem`[] & `object`

The initial items for the array

#### Returns

`StaticArray`\<`TItem`, `TLength`\>

#### Overrides

`Arc4ArrayBase<TItem>.constructor`

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

## Methods

### \[iterator\]()

> **\[iterator\]**(): [`IterableIterator`](../../index/-internal-/interfaces/IterableIterator.md)\<`TItem`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:277](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L277)

Returns an iterator for the items in this array

#### Returns

[`IterableIterator`](../../index/-internal-/interfaces/IterableIterator.md)\<`TItem`\>

#### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`[iterator]`](../-internal-/classes/Arc4ArrayBase.md#iterator)

***

### at()

> **at**(`index`): `TItem`

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:249](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L249)

Returns the item at the given index.
Negative indexes are taken from the end.

#### Parameters

##### index

[`Uint64Compat`](../../index/type-aliases/Uint64Compat.md)

The index of the item to retrieve

#### Returns

`TItem`

#### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`at`](../-internal-/classes/Arc4ArrayBase.md#at)

***

### concat()

> **concat**(`other`): [`DynamicArray`](DynamicArray.md)\<`TItem`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:335](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L335)

Returns a new array containing all items from _this_ array, and _other_ array

#### Parameters

##### other

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md)\<`TItem`\>

Another array to concat with this one

#### Returns

[`DynamicArray`](DynamicArray.md)\<`TItem`\>

***

### copy()

> **copy**(): `StaticArray`\<`TItem`, `TLength`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:327](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L327)

Returns a copy of this array

#### Returns

`StaticArray`\<`TItem`, `TLength`\>

***

### entries()

> **entries**(): [`IterableIterator`](../../index/-internal-/interfaces/IterableIterator.md)\<readonly \[[`uint64`](../../index/type-aliases/uint64.md), `TItem`\]\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:284](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L284)

Returns an iterator for a tuple of the indexes and items in this array

#### Returns

[`IterableIterator`](../../index/-internal-/interfaces/IterableIterator.md)\<readonly \[[`uint64`](../../index/type-aliases/uint64.md), `TItem`\]\>

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

> **slice**(): [`DynamicArray`](DynamicArray.md)\<`TItem`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:256](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L256)

**`Internal`**

Create a new Dynamic array with all items from this array

##### Returns

[`DynamicArray`](DynamicArray.md)\<`TItem`\>

##### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`slice`](../-internal-/classes/Arc4ArrayBase.md#slice)

#### Call Signature

> **slice**(`end`): [`DynamicArray`](DynamicArray.md)\<`TItem`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:262](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L262)

**`Internal`**

Create a new DynamicArray with all items up till `end`.
Negative indexes are taken from the end.

##### Parameters

###### end

[`Uint64Compat`](../../index/type-aliases/Uint64Compat.md)

An index in which to stop copying items.

##### Returns

[`DynamicArray`](DynamicArray.md)\<`TItem`\>

##### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`slice`](../-internal-/classes/Arc4ArrayBase.md#slice)

#### Call Signature

> **slice**(`start`, `end`): [`DynamicArray`](DynamicArray.md)\<`TItem`\>

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

[`DynamicArray`](DynamicArray.md)\<`TItem`\>

##### Inherited from

[`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md).[`slice`](../-internal-/classes/Arc4ArrayBase.md#slice)
