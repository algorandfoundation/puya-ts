[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [index](../README.md) / Box

# Type Alias: Box\<TValue\>

> **Box**\<`TValue`\> = `object`

Defined in: [packages/algo-ts/src/box.ts:187](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L187)

A Box proxy

## Type Parameters

### TValue

`TValue`

The type of the data stored in the box.

## Properties

### exists

> `readonly` **exists**: `boolean`

Defined in: [packages/algo-ts/src/box.ts:31](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L31)

Get a boolean indicating if the box exists or not

***

### key

> `readonly` **key**: [`bytes`](bytes.md)

Defined in: [packages/algo-ts/src/box.ts:21](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L21)

Get the key used by this box proxy

***

### length

> `readonly` **length**: [`uint64`](uint64.md)

Defined in: [packages/algo-ts/src/box.ts:53](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L53)

Returns the length of the box, or error if the box does not exist

***

### value

> **value**: `TValue`

Defined in: [packages/algo-ts/src/box.ts:27](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L27)

Get or set the value stored in the box

Get will error if the box does not exist

## Methods

### create()

> **create**(`options`?): `boolean`

Defined in: [packages/algo-ts/src/box.ts:17](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L17)

Create the box for this proxy with a bzero value.
 - If options.size is specified, the box will be created with that length
 - Otherwise the box will be created with arc4EncodedLength(TValue). Errors if the encoded length is not fixed

No op if the box already exists

#### Parameters

##### options?

###### size?

[`uint64`](uint64.md)

#### Returns

`boolean`

True if the box was created, false if it already existed

***

### delete()

> **delete**(): `boolean`

Defined in: [packages/algo-ts/src/box.ts:42](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L42)

Delete the box associated with this proxy if it exists.

#### Returns

`boolean`

True if the box existed and was deleted, else false

***

### get()

> **get**(`options`): `TValue`

Defined in: [packages/algo-ts/src/box.ts:37](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L37)

Get the value stored in the box, or return a specified default value if the box does not exist

#### Parameters

##### options

Options to specify a default value to be returned if no other value exists

###### default

`TValue`

#### Returns

`TValue`

The value if the box exists, else the default value

***

### maybe()

> **maybe**(): readonly \[`TValue`, `boolean`\]

Defined in: [packages/algo-ts/src/box.ts:49](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L49)

Get the value stored in the box if available, and a boolean indicating if the box exists.

If the box does not exist, the value returned at position 0 should not be relied on to have a valid value.

#### Returns

readonly \[`TValue`, `boolean`\]

A tuple with the first item being the box value, and the second item being a boolean indicating if the box exists.
