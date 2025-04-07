[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [index](../README.md) / Box

# Type Alias: Box\<TValue\>

> **Box**\<`TValue`\> = `object`

Defined in: [packages/algo-ts/src/box.ts:178](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L178)

A Box proxy

## Type Parameters

### TValue

`TValue`

The type of the data stored in the box.

## Properties

### exists

> `readonly` **exists**: `boolean`

Defined in: [packages/algo-ts/src/box.ts:22](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L22)

Get a boolean indicating if the box exists or not

***

### key

> `readonly` **key**: [`bytes`](bytes.md)

Defined in: [packages/algo-ts/src/box.ts:12](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L12)

Get the key used by this box proxy

***

### length

> `readonly` **length**: [`uint64`](uint64.md)

Defined in: [packages/algo-ts/src/box.ts:44](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L44)

Returns the length of the box, or error if the box does not exist

***

### value

> **value**: `TValue`

Defined in: [packages/algo-ts/src/box.ts:18](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L18)

Get or set the value stored in the box

Get will error if the box does not exist

## Methods

### delete()

> **delete**(): `boolean`

Defined in: [packages/algo-ts/src/box.ts:33](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L33)

Delete the box associated with this proxy if it exists.

#### Returns

`boolean`

True if the box existed and was deleted, else false

***

### get()

> **get**(`options`): `TValue`

Defined in: [packages/algo-ts/src/box.ts:28](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L28)

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

Defined in: [packages/algo-ts/src/box.ts:40](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L40)

Get the value stored in the box if available, and a boolean indicating if the box exists.

If the box does not exist, the value returned at position 0 should not be relied on to have a valid value.

#### Returns

readonly \[`TValue`, `boolean`\]

A tuple with the first item being the box value, and the second item being a boolean indicating if the box exists.
