[**@algorandfoundation/algorand-typescript**](../README.md)

***

[@algorandfoundation/algorand-typescript](../README.md) / Box

# Type Alias: Box\<TValue\>

> **Box**\<`TValue`\>: `object`

Defined in: [packages/algo-ts/src/box.ts:42](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/box.ts#L42)

## Type Parameters

• **TValue**

## Type declaration

### exists

> `readonly` **exists**: `boolean`

### key

> `readonly` **key**: [`bytes`](bytes.md)

### length

> `readonly` **length**: [`uint64`](uint64.md)

### value

> **value**: `TValue`

### delete()

#### Returns

`boolean`

### get()

#### Parameters

##### options

###### default

`TValue`

#### Returns

`TValue`

### maybe()

#### Returns

readonly \[`TValue`, `boolean`\]
