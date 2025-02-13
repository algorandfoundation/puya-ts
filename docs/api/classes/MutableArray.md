[**@algorandfoundation/algorand-typescript**](../README.md)

***

[@algorandfoundation/algorand-typescript](../README.md) / MutableArray

# Class: MutableArray\<TItem\>

Defined in: [packages/algo-ts/src/mutable-array.ts:4](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/mutable-array.ts#L4)

## Type Parameters

• **TItem**

## Indexable

\[`index`: [`uint64`](../type-aliases/uint64.md)\]: `TItem`

## Constructors

### new MutableArray()

> **new MutableArray**\<`TItem`\>(...`items`): [`MutableArray`](MutableArray.md)\<`TItem`\>

Defined in: [packages/algo-ts/src/mutable-array.ts:5](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/mutable-array.ts#L5)

#### Parameters

##### items

...`TItem`[]

#### Returns

[`MutableArray`](MutableArray.md)\<`TItem`\>

## Accessors

### length

#### Get Signature

> **get** **length**(): [`uint64`](../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/mutable-array.ts:10](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/mutable-array.ts#L10)

Returns the current length of this array

##### Returns

[`uint64`](../type-aliases/uint64.md)

## Methods

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`TItem`\>

Defined in: [packages/algo-ts/src/mutable-array.ts:47](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/mutable-array.ts#L47)

Returns an iterator for the items in this array

#### Returns

`IterableIterator`\<`TItem`\>

***

### at()

> **at**(`index`): `TItem`

Defined in: [packages/algo-ts/src/mutable-array.ts:19](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/mutable-array.ts#L19)

Returns the item at the given index.
Negative indexes are taken from the end.

#### Parameters

##### index

[`Uint64Compat`](../type-aliases/Uint64Compat.md)

The index of the item to retrieve

#### Returns

`TItem`

***

### copy()

> **copy**(): [`MutableArray`](MutableArray.md)\<`TItem`\>

Defined in: [packages/algo-ts/src/mutable-array.ts:86](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/mutable-array.ts#L86)

#### Returns

[`MutableArray`](MutableArray.md)\<`TItem`\>

***

### entries()

> **entries**(): `IterableIterator`\<readonly \[[`uint64`](../type-aliases/uint64.md), `TItem`\]\>

Defined in: [packages/algo-ts/src/mutable-array.ts:54](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/mutable-array.ts#L54)

Returns an iterator for a tuple of the indexes and items in this array

#### Returns

`IterableIterator`\<readonly \[[`uint64`](../type-aliases/uint64.md), `TItem`\]\>

***

### keys()

> **keys**(): `IterableIterator`\<[`uint64`](../type-aliases/uint64.md)\>

Defined in: [packages/algo-ts/src/mutable-array.ts:61](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/mutable-array.ts#L61)

Returns an iterator for the indexes in this array

#### Returns

`IterableIterator`\<[`uint64`](../type-aliases/uint64.md)\>

***

### pop()

> **pop**(): `TItem`

Defined in: [packages/algo-ts/src/mutable-array.ts:82](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/mutable-array.ts#L82)

Pop a single item from this array

#### Returns

`TItem`

***

### push()

> **push**(...`items`): `void`

Defined in: [packages/algo-ts/src/mutable-array.ts:75](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/mutable-array.ts#L75)

Push a number of items into this array

#### Parameters

##### items

...`TItem`[]

The items to be added to this array

#### Returns

`void`

***

### slice()

#### Call Signature

> **slice**(): [`MutableArray`](MutableArray.md)\<`TItem`\>

Defined in: [packages/algo-ts/src/mutable-array.ts:26](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/mutable-array.ts#L26)

Create a new Dynamic array with all items from this array

##### Returns

[`MutableArray`](MutableArray.md)\<`TItem`\>

#### Call Signature

> **slice**(`end`): [`MutableArray`](MutableArray.md)\<`TItem`\>

Defined in: [packages/algo-ts/src/mutable-array.ts:32](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/mutable-array.ts#L32)

Create a new MutableArray with all items up till `end`.
Negative indexes are taken from the end.

##### Parameters

###### end

[`Uint64Compat`](../type-aliases/Uint64Compat.md)

An index in which to stop copying items.

##### Returns

[`MutableArray`](MutableArray.md)\<`TItem`\>

#### Call Signature

> **slice**(`start`, `end`): [`MutableArray`](MutableArray.md)\<`TItem`\>

Defined in: [packages/algo-ts/src/mutable-array.ts:39](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/mutable-array.ts#L39)

Create a new MutableArray with items from `start`, up until `end`
Negative indexes are taken from the end.

##### Parameters

###### start

[`Uint64Compat`](../type-aliases/Uint64Compat.md)

An index in which to start copying items.

###### end

[`Uint64Compat`](../type-aliases/Uint64Compat.md)

An index in which to stop copying items

##### Returns

[`MutableArray`](MutableArray.md)\<`TItem`\>
