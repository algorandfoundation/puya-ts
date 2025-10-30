[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / BoxRef

# Type Alias: BoxRef

> **BoxRef** = `object`

Defined in: [packages/algo-ts/src/box.ts:226](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L226)

A BoxRef proxy

## Properties

### exists

> `readonly` **exists**: `boolean`

Defined in: [packages/algo-ts/src/box.ts:84](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L84)

Get a boolean indicating if the box exists or not

***

### key

> `readonly` **key**: [`bytes`](bytes.md)

Defined in: [packages/algo-ts/src/box.ts:80](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L80)

Get the key used by this box proxy

***

### length

> `readonly` **length**: [`uint64`](uint64.md)

Defined in: [packages/algo-ts/src/box.ts:169](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L169)

Returns the length of the box, or error if the box does not exist

***

### value

> **value**: [`bytes`](bytes.md)

Defined in: [packages/algo-ts/src/box.ts:91](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L91)

Get the value of the box.

Error if this value is larger than what the `bytes` type supports
Error if getting the value and the box does not exist

## Methods

### create()

> **create**(`options`): `boolean`

Defined in: [packages/algo-ts/src/box.ts:149](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L149)

Create the box for this proxy with the specified size if it does not exist

No op if the box already exists

#### Parameters

##### options

The size of the box to create

###### size

[`uint64`](uint64.md)

#### Returns

`boolean`

True if the box was created, false if it already existed

***

### delete()

> **delete**(): `boolean`

Defined in: [packages/algo-ts/src/box.ts:141](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L141)

Delete the box associated with this proxy if it exists.

#### Returns

`boolean`

True if the box existed and was deleted, else false

***

### extract()

> **extract**(`start`, `length`): [`bytes`](bytes.md)

Defined in: [packages/algo-ts/src/box.ts:136](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L136)

Extract a slice of bytes from the box

Error if the box does not exist
Error if `start` + `length` is greater than the box size

#### Parameters

##### start

[`uint64`](uint64.md)

The index to start extracting

##### length

[`uint64`](uint64.md)

The number of bytes to extract

#### Returns

[`bytes`](bytes.md)

The extracted bytes

***

### get()

> **get**(`options`): [`bytes`](bytes.md)

Defined in: [packages/algo-ts/src/box.ts:97](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L97)

Get the value stored in the box, or return a specified default value if the box does not exist

#### Parameters

##### options

Options to specify a default value to be returned if no other value exists

###### default

[`bytes`](bytes.md)

#### Returns

[`bytes`](bytes.md)

The value if the box exists, else the default value

***

### maybe()

> **maybe**(): readonly \[[`bytes`](bytes.md), `boolean`\]

Defined in: [packages/algo-ts/src/box.ts:165](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L165)

Get the value stored in the box if available, and a boolean indicating if the box exists.

If the box does not exist, the value returned at position 0 will be an empty byte array.

#### Returns

readonly \[[`bytes`](bytes.md), `boolean`\]

A tuple with the first item being the box value, and the second item being a boolean indicating if the box exists.

***

### put()

> **put**(`value`): `void`

Defined in: [packages/algo-ts/src/box.ts:105](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L105)

Puts the specified bytes into the box replacing any existing value.

Creates the box if it does not exist
Errors if the box exists, but the length does not match the length of `value`

#### Parameters

##### value

[`bytes`](bytes.md)

The value to put into the box

#### Returns

`void`

***

### replace()

> **replace**(`start`, `value`): `void`

Defined in: [packages/algo-ts/src/box.ts:126](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L126)

Replace bytes in a box starting at `start`.

Error if the box does not exist
Error if `start` + `value.length` is greater than the box size

#### Parameters

##### start

[`uint64`](uint64.md)

The index to start replacing

##### value

[`bytes`](bytes.md)

The value to be written

#### Returns

`void`

***

### resize()

> **resize**(`newSize`): `void`

Defined in: [packages/algo-ts/src/box.ts:158](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L158)

Resize the box to the specified size.

Adds zero bytes to the end if the new size is larger
Removes end bytes if the new size is smaller
Error if the box does not exist

#### Parameters

##### newSize

[`uint64`](uint64.md)

The new size for the box

#### Returns

`void`

***

### splice()

> **splice**(`start`, `length`, `value`): `void`

Defined in: [packages/algo-ts/src/box.ts:117](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L117)

Splice the specified bytes into the box starting at `start`, removing `length` bytes
from the existing value and replacing them with `value` before appending the remainder of the original box value.

If the resulting byte value is larger than length, bytes will be trimmed from the end
If the resulting byte value is smaller than length, zero bytes will be appended to the end
Error if the box does not exist

#### Parameters

##### start

[`uint64`](uint64.md)

The index to start inserting the value

##### length

[`uint64`](uint64.md)

The number of bytes after `start` to be omitted

##### value

[`bytes`](bytes.md)

The value to be inserted

#### Returns

`void`
