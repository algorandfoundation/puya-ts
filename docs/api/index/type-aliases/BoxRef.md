[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [index](../README.md) / BoxRef

# Type Alias: BoxRef

> **BoxRef**: `object`

Defined in: [packages/algo-ts/src/box.ts:214](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L214)

A BoxRef proxy

## Type declaration

### exists

> `readonly` **exists**: `boolean`

Get a boolean indicating if the box exists or not

### key

> `readonly` **key**: [`bytes`](bytes.md)

Get the key used by this box proxy

### length

> `readonly` **length**: [`uint64`](uint64.md)

Returns the length of the box, or error if the box does not exist

### value

> **value**: [`bytes`](bytes.md)

Get the value of the box. Error if this value is larger than what the `bytes` type supports

### create()

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

### delete()

Delete the box associated with this proxy if it exists.

#### Returns

`boolean`

True if the box existed and was deleted, else false

### extract()

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

### get()

Get the value stored in the box, or return a specified default value if the box does not exist

#### Parameters

##### options

Options to specify a default value to be returned if no other value exists

###### default

[`bytes`](bytes.md)

#### Returns

[`bytes`](bytes.md)

The value if the box exists, else the default value

### maybe()

Get the value stored in the box if available, and a boolean indicating if the box exists.

If the box does not exist, the value returned at position 0 will be an empty byte array.

#### Returns

readonly \[[`bytes`](bytes.md), `boolean`\]

A tuple with the first item being the box value, and the second item being a boolean indicating if the box exists.

### put()

Puts the specified bytes into the box replacing any existing value.

Creates the box if it does not exist
Errors if the box exists, but the length does not match the length of `value`

#### Parameters

##### value

[`bytes`](bytes.md)

The value to put into the box

#### Returns

`void`

### replace()

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

### resize()

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

### splice()

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
