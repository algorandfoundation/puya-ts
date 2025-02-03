[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [arc4](../README.md) / DynamicArray

# Class: DynamicArray\<TItem\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:215](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/arc4/encoded-types.ts#L215)

## Extends

- `Arc4ArrayBase`\<`TItem`\>

## Type Parameters

• **TItem** *extends* [`ARC4Encoded`](ARC4Encoded.md)

## Indexable

\[`index`: [`uint64`](../../../type-aliases/uint64.md)\]: `TItem`

## Constructors

### new DynamicArray()

> **new DynamicArray**\<`TItem`\>(...`items`): [`DynamicArray`](DynamicArray.md)\<`TItem`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:218](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/arc4/encoded-types.ts#L218)

#### Parameters

##### items

...`TItem`[]

#### Returns

[`DynamicArray`](DynamicArray.md)\<`TItem`\>

#### Overrides

`Arc4ArrayBase<TItem>.constructor`

## Accessors

### bytes

#### Get Signature

> **get** **bytes**(): [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:72](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/arc4/encoded-types.ts#L72)

##### Returns

[`bytes`](../../../type-aliases/bytes.md)

#### Inherited from

`Arc4ArrayBase.bytes`

***

### length

#### Get Signature

> **get** **length**(): [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:139](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/arc4/encoded-types.ts#L139)

Returns the current length of this array

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

#### Inherited from

`Arc4ArrayBase.length`

## Methods

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`TItem`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:176](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/arc4/encoded-types.ts#L176)

Returns an iterator for the items in this array

#### Returns

`IterableIterator`\<`TItem`\>

#### Inherited from

`Arc4ArrayBase.[iterator]`

***

### at()

> **at**(`index`): `TItem`

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:148](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/arc4/encoded-types.ts#L148)

Returns the item at the given index.
Negative indexes are taken from the end.

#### Parameters

##### index

[`Uint64Compat`](../../../type-aliases/Uint64Compat.md)

The index of the item to retrieve

#### Returns

`TItem`

#### Inherited from

`Arc4ArrayBase.at`

***

### copy()

> **copy**(): [`DynamicArray`](DynamicArray.md)\<`TItem`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:237](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/arc4/encoded-types.ts#L237)

#### Returns

[`DynamicArray`](DynamicArray.md)\<`TItem`\>

***

### entries()

> **entries**(): `IterableIterator`\<readonly \[[`uint64`](../../../type-aliases/uint64.md), `TItem`\]\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:183](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/arc4/encoded-types.ts#L183)

Returns an iterator for a tuple of the indexes and items in this array

#### Returns

`IterableIterator`\<readonly \[[`uint64`](../../../type-aliases/uint64.md), `TItem`\]\>

#### Inherited from

`Arc4ArrayBase.entries`

***

### keys()

> **keys**(): `IterableIterator`\<[`uint64`](../../../type-aliases/uint64.md)\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:190](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/arc4/encoded-types.ts#L190)

Returns an iterator for the indexes in this array

#### Returns

`IterableIterator`\<[`uint64`](../../../type-aliases/uint64.md)\>

#### Inherited from

`Arc4ArrayBase.keys`

***

### pop()

> **pop**(): `TItem`

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:233](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/arc4/encoded-types.ts#L233)

Pop a single item from this array

#### Returns

`TItem`

***

### push()

> **push**(...`items`): `void`

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:226](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/arc4/encoded-types.ts#L226)

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

> **slice**(): [`DynamicArray`](DynamicArray.md)\<`TItem`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:155](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/arc4/encoded-types.ts#L155)

**`Internal`**

Create a new Dynamic array with all items from this array

##### Returns

[`DynamicArray`](DynamicArray.md)\<`TItem`\>

##### Inherited from

`Arc4ArrayBase.slice`

#### Call Signature

> **slice**(`end`): [`DynamicArray`](DynamicArray.md)\<`TItem`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:161](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/arc4/encoded-types.ts#L161)

**`Internal`**

Create a new DynamicArray with all items up till `end`.
Negative indexes are taken from the end.

##### Parameters

###### end

[`Uint64Compat`](../../../type-aliases/Uint64Compat.md)

An index in which to stop copying items.

##### Returns

[`DynamicArray`](DynamicArray.md)\<`TItem`\>

##### Inherited from

`Arc4ArrayBase.slice`

#### Call Signature

> **slice**(`start`, `end`): [`DynamicArray`](DynamicArray.md)\<`TItem`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:168](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/arc4/encoded-types.ts#L168)

**`Internal`**

Create a new DynamicArray with items from `start`, up until `end`
Negative indexes are taken from the end.

##### Parameters

###### start

[`Uint64Compat`](../../../type-aliases/Uint64Compat.md)

An index in which to start copying items.

###### end

[`Uint64Compat`](../../../type-aliases/Uint64Compat.md)

An index in which to stop copying items

##### Returns

[`DynamicArray`](DynamicArray.md)\<`TItem`\>

##### Inherited from

`Arc4ArrayBase.slice`
