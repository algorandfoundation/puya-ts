[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / MutableArray

# Class: MutableArray\<TItem\>

Defined in: [packages/algo-ts/src/mutable-array.ts:7](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/mutable-array.ts#L7)

An in memory mutable array which is passed by reference

## Type Parameters

### TItem

`TItem`

## Indexable

\[`index`: [`uint64`](../type-aliases/uint64.md)\]: `TItem`

## Constructors

### Constructor

> **new MutableArray**\<`TItem`\>(...`items`): `MutableArray`\<`TItem`\>

Defined in: [packages/algo-ts/src/mutable-array.ts:12](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/mutable-array.ts#L12)

Create a new MutableArray with the specified items

#### Parameters

##### items

...`TItem`[]

The initial items for the array

#### Returns

`MutableArray`\<`TItem`\>

## Accessors

### length

#### Get Signature

> **get** **length**(): [`uint64`](../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/mutable-array.ts:17](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/mutable-array.ts#L17)

Returns the current length of this array

##### Returns

[`uint64`](../type-aliases/uint64.md)

## Methods

### \[iterator\]()

> **\[iterator\]**(): [`IterableIterator`](../-internal-/interfaces/IterableIterator.md)\<`TItem`\>

Defined in: [packages/algo-ts/src/mutable-array.ts:57](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/mutable-array.ts#L57)

Returns an iterator for the items in this array

#### Returns

[`IterableIterator`](../-internal-/interfaces/IterableIterator.md)\<`TItem`\>

***

### at()

> **at**(`index`): `TItem`

Defined in: [packages/algo-ts/src/mutable-array.ts:26](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/mutable-array.ts#L26)

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

> **copy**(): `MutableArray`\<`TItem`\>

Defined in: [packages/algo-ts/src/mutable-array.ts:99](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/mutable-array.ts#L99)

Create a copy of this array

#### Returns

`MutableArray`\<`TItem`\>

***

### entries()

> **entries**(): [`IterableIterator`](../-internal-/interfaces/IterableIterator.md)\<readonly \[[`uint64`](../type-aliases/uint64.md), `TItem`\]\>

Defined in: [packages/algo-ts/src/mutable-array.ts:64](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/mutable-array.ts#L64)

Returns an iterator for a tuple of the indexes and items in this array

#### Returns

[`IterableIterator`](../-internal-/interfaces/IterableIterator.md)\<readonly \[[`uint64`](../type-aliases/uint64.md), `TItem`\]\>

***

### keys()

> **keys**(): [`IterableIterator`](../-internal-/interfaces/IterableIterator.md)\<[`uint64`](../type-aliases/uint64.md)\>

Defined in: [packages/algo-ts/src/mutable-array.ts:71](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/mutable-array.ts#L71)

Returns an iterator for the indexes in this array

#### Returns

[`IterableIterator`](../-internal-/interfaces/IterableIterator.md)\<[`uint64`](../type-aliases/uint64.md)\>

***

### pop()

> **pop**(): `TItem`

Defined in: [packages/algo-ts/src/mutable-array.ts:92](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/mutable-array.ts#L92)

Pop a single item from this array

#### Returns

`TItem`

***

### push()

> **push**(...`items`): `void`

Defined in: [packages/algo-ts/src/mutable-array.ts:85](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/mutable-array.ts#L85)

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

> **slice**(): `MutableArray`\<`TItem`\>

Defined in: [packages/algo-ts/src/mutable-array.ts:34](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/mutable-array.ts#L34)

**`Internal`**

Create a new Dynamic array with all items from this array
 Not supported yet

##### Returns

`MutableArray`\<`TItem`\>

#### Call Signature

> **slice**(`end`): `MutableArray`\<`TItem`\>

Defined in: [packages/algo-ts/src/mutable-array.ts:41](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/mutable-array.ts#L41)

**`Internal`**

Create a new MutableArray with all items up till `end`.
Negative indexes are taken from the end.

##### Parameters

###### end

[`Uint64Compat`](../type-aliases/Uint64Compat.md)

An index in which to stop copying items.
 Not supported yet

##### Returns

`MutableArray`\<`TItem`\>

#### Call Signature

> **slice**(`start`, `end`): `MutableArray`\<`TItem`\>

Defined in: [packages/algo-ts/src/mutable-array.ts:49](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/mutable-array.ts#L49)

**`Internal`**

Create a new MutableArray with items from `start`, up until `end`
Negative indexes are taken from the end.

##### Parameters

###### start

[`Uint64Compat`](../type-aliases/Uint64Compat.md)

An index in which to start copying items.

###### end

[`Uint64Compat`](../type-aliases/Uint64Compat.md)

An index in which to stop copying items
 Not supported yet

##### Returns

`MutableArray`\<`TItem`\>
