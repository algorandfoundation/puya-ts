[**@algorandfoundation/algorand-typescript**](../README.md)

***

[@algorandfoundation/algorand-typescript](../README.md) / BoxMap

# Type Alias: BoxMap\<TKey, TValue\>

> **BoxMap**\<`TKey`, `TValue`\>: `object`

Defined in: [packages/algo-ts/src/box.ts:46](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/box.ts#L46)

## Type Parameters

• **TKey**

• **TValue**

## Type declaration

### keyPrefix

> `readonly` **keyPrefix**: [`bytes`](bytes.md)

### delete()

#### Parameters

##### key

`TKey`

#### Returns

`boolean`

### get()

#### Call Signature

##### Parameters

###### key

`TKey`

##### Returns

`TValue`

#### Call Signature

##### Parameters

###### key

`TKey`

###### options

###### default

`TValue`

##### Returns

`TValue`

### has()

#### Parameters

##### key

`TKey`

#### Returns

`boolean`

### length()

#### Parameters

##### key

`TKey`

#### Returns

[`uint64`](uint64.md)

### maybe()

#### Parameters

##### key

`TKey`

#### Returns

readonly \[`TValue`, `boolean`\]

### set()

#### Parameters

##### key

`TKey`

##### value

`TValue`

#### Returns

`void`
