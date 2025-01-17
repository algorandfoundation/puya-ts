[**@algorandfoundation/algorand-typescript**](../README.md)

***

[@algorandfoundation/algorand-typescript](../README.md) / BoxRef

# Type Alias: BoxRef

> **BoxRef**: `object`

Defined in: [packages/algo-ts/src/box.ts:50](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/box.ts#L50)

## Type declaration

### exists

> `readonly` **exists**: `boolean`

### key

> `readonly` **key**: [`bytes`](bytes.md)

### length

> `readonly` **length**: [`uint64`](uint64.md)

### value

> **value**: [`bytes`](bytes.md)

### create()

#### Parameters

##### options

###### size

[`uint64`](uint64.md)

#### Returns

`boolean`

### delete()

#### Returns

`boolean`

### extract()

#### Parameters

##### start

[`uint64`](uint64.md)

##### length

[`uint64`](uint64.md)

#### Returns

[`bytes`](bytes.md)

### get()

#### Parameters

##### options

###### default

[`bytes`](bytes.md)

#### Returns

[`bytes`](bytes.md)

### maybe()

#### Returns

readonly \[[`bytes`](bytes.md), `boolean`\]

### put()

#### Parameters

##### value

[`bytes`](bytes.md)

#### Returns

`void`

### replace()

#### Parameters

##### start

[`uint64`](uint64.md)

##### value

[`bytes`](bytes.md)

#### Returns

`void`

### resize()

#### Parameters

##### newSize

[`uint64`](uint64.md)

#### Returns

`void`

### splice()

#### Parameters

##### start

[`uint64`](uint64.md)

##### length

[`uint64`](uint64.md)

##### value

[`bytes`](bytes.md)

#### Returns

`void`
