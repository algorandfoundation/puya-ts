[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [arc4](../README.md) / DynamicBytes

# Class: DynamicBytes

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:302](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/arc4/encoded-types.ts#L302)

## Extends

- `Arc4ArrayBase`\<[`Byte`](Byte.md)\>

## Indexable

\[`index`: [`uint64`](../../../type-aliases/uint64.md)\]: [`Byte`](Byte.md)

## Constructors

### new DynamicBytes()

> **new DynamicBytes**(`value`?): [`DynamicBytes`](DynamicBytes.md)

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:306](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/arc4/encoded-types.ts#L306)

#### Parameters

##### value?

`string` | [`bytes`](../../../type-aliases/bytes.md)

#### Returns

[`DynamicBytes`](DynamicBytes.md)

#### Overrides

`Arc4ArrayBase<Byte>.constructor`

## Accessors

### bytes

#### Get Signature

> **get** **bytes**(): [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:72](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/arc4/encoded-types.ts#L72)

##### Returns

[`bytes`](../../../type-aliases/bytes.md)

#### Inherited from

`Arc4ArrayBase.bytes`

***

### length

#### Get Signature

> **get** **length**(): [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:139](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/arc4/encoded-types.ts#L139)

Returns the current length of this array

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

#### Inherited from

`Arc4ArrayBase.length`

***

### native

#### Get Signature

> **get** **native**(): [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:310](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/arc4/encoded-types.ts#L310)

##### Returns

[`bytes`](../../../type-aliases/bytes.md)

## Methods

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<[`Byte`](Byte.md)\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:176](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/arc4/encoded-types.ts#L176)

Returns an iterator for the items in this array

#### Returns

`IterableIterator`\<[`Byte`](Byte.md)\>

#### Inherited from

`Arc4ArrayBase.[iterator]`

***

### at()

> **at**(`index`): [`Byte`](Byte.md)

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:148](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/arc4/encoded-types.ts#L148)

Returns the item at the given index.
Negative indexes are taken from the end.

#### Parameters

##### index

[`Uint64Compat`](../../../type-aliases/Uint64Compat.md)

The index of the item to retrieve

#### Returns

[`Byte`](Byte.md)

#### Inherited from

`Arc4ArrayBase.at`

***

### entries()

> **entries**(): `IterableIterator`\<readonly \[[`uint64`](../../../type-aliases/uint64.md), [`Byte`](Byte.md)\]\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:183](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/arc4/encoded-types.ts#L183)

Returns an iterator for a tuple of the indexes and items in this array

#### Returns

`IterableIterator`\<readonly \[[`uint64`](../../../type-aliases/uint64.md), [`Byte`](Byte.md)\]\>

#### Inherited from

`Arc4ArrayBase.entries`

***

### keys()

> **keys**(): `IterableIterator`\<[`uint64`](../../../type-aliases/uint64.md)\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:190](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/arc4/encoded-types.ts#L190)

Returns an iterator for the indexes in this array

#### Returns

`IterableIterator`\<[`uint64`](../../../type-aliases/uint64.md)\>

#### Inherited from

`Arc4ArrayBase.keys`

***

### slice()

#### Call Signature

> **slice**(): [`DynamicArray`](DynamicArray.md)\<[`Byte`](Byte.md)\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:155](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/arc4/encoded-types.ts#L155)

**`Internal`**

Create a new Dynamic array with all items from this array

##### Returns

[`DynamicArray`](DynamicArray.md)\<[`Byte`](Byte.md)\>

##### Inherited from

`Arc4ArrayBase.slice`

#### Call Signature

> **slice**(`end`): [`DynamicArray`](DynamicArray.md)\<[`Byte`](Byte.md)\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:161](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/arc4/encoded-types.ts#L161)

**`Internal`**

Create a new DynamicArray with all items up till `end`.
Negative indexes are taken from the end.

##### Parameters

###### end

[`Uint64Compat`](../../../type-aliases/Uint64Compat.md)

An index in which to stop copying items.

##### Returns

[`DynamicArray`](DynamicArray.md)\<[`Byte`](Byte.md)\>

##### Inherited from

`Arc4ArrayBase.slice`

#### Call Signature

> **slice**(`start`, `end`): [`DynamicArray`](DynamicArray.md)\<[`Byte`](Byte.md)\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:168](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/arc4/encoded-types.ts#L168)

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

[`DynamicArray`](DynamicArray.md)\<[`Byte`](Byte.md)\>

##### Inherited from

`Arc4ArrayBase.slice`
